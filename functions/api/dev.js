const SITE_ORIGIN = "https://frasesdoolavo.online";
const SITE_HOST = new URL(SITE_ORIGIN).hostname;
const SESSION_SECONDS = 8 * 60 * 60;
const CACHE_MS = 15 * 60 * 1000;
const inspectionCache = new Map();
const tokenCache = { token: "", expiresAt: 0 };
const loginAttempts = new Map();

const json = (data, status = 200, extra = {}) => new Response(
  status === 204 ? null : JSON.stringify(data),
  { status, headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    ...extra
  }}
);
const enc = value => new TextEncoder().encode(value);
function base64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function decodeBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}
function safeEqual(a, b) {
  const left = enc(String(a ?? ""));
  const right = enc(String(b ?? ""));
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}
async function signHmac(value, secret) {
  const key = await crypto.subtle.importKey("raw", enc(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc(value))));
}
async function makeSession(secret) {
  const payload = base64url(enc(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, v: 1 })));
  return payload + "." + await signHmac(payload, secret);
}
async function validSession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const item = cookie.split(";").map(part => part.trim()).find(part => part.startsWith("of_dev_session="));
  if (!item) return false;
  const value = item.slice("of_dev_session=".length);
  const dot = value.indexOf(".");
  if (dot < 1) return false;
  const payload = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  if (!signature || !safeEqual(signature, await signHmac(payload, secret))) return false;
  try {
    const decoded = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    return decoded.v === 1 && Number(decoded.exp) > Math.floor(Date.now() / 1000);
  } catch { return false; }
}
function originAllowed(request, env) {
  const origin = request.headers.get("Origin");
  const configured = String(env.DEV_ALLOWED_ORIGINS || "https://frasesdoolavo.online,https://www.frasesdoolavo.online")
    .split(",").map(value => value.trim().replace(/\/$/, "")).filter(Boolean);
  if (origin) return configured.includes(origin.replace(/\/$/, ""));
  return request.method === "GET" && request.headers.get("Sec-Fetch-Site")?.toLowerCase() === "same-origin";
}
async function parseBody(request) {
  try { return await request.json(); } catch { return null; }
}
function safePublicUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== SITE_HOST || url.username || url.password) return null;
    url.hash = "";
    if (url.search || (!url.pathname.endsWith(".html") && url.pathname !== "/")) return null;
    if (url.pathname.includes("modelo-artigo")) return null;
    return url.toString();
  } catch { return null; }
}
async function fetchText(url) {
  const result = await fetch(url, {
    redirect: "error",
    headers: { "User-Agent": "OlavoFrases-DevIndexMonitor/1.0" },
    signal: AbortSignal.timeout(8000)
  });
  if (!result.ok) throw new Error("Falha ao consultar " + new URL(url).pathname + ": HTTP " + result.status);
  return result.text();
}
function decodeXml(value) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}
async function discoverUrls() {
  const found = new Set([SITE_ORIGIN + "/"]);
  try {
    const xml = await fetchText(SITE_ORIGIN + "/sitemap.xml");
    for (const match of xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)) {
      const url = safePublicUrl(decodeXml(match[1].trim()));
      if (url) found.add(url);
    }
  } catch (error) {
    console.warn("Sitemap indisponível; usando links públicos:", error.message);
  }
  for (const path of ["/", "/artigos.html", "/sobre.html", "/contato.html", "/privacidade.html"]) {
    const pageUrl = SITE_ORIGIN + path;
    try {
      const html = await fetchText(pageUrl);
      for (const match of html.matchAll(/(?:href|canonical)\s*=\s*["']([^"'#]+)["']/gi)) {
        const candidate = safePublicUrl(new URL(match[1], pageUrl).toString());
        if (candidate) found.add(candidate);
      }
    } catch (error) {
      console.warn("Não foi possível descobrir links em " + pageUrl + ": " + error.message);
    }
  }
  const urls = [...found].sort((a, b) => a.localeCompare(b));
  return Promise.all(urls.map(async url => {
    let title = url === SITE_ORIGIN + "/" ? "Olavo Frases — página inicial" : new URL(url).pathname;
    try {
      const html = await fetchText(url);
      const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (match) title = match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    } catch (error) { console.warn("Título não lido para " + url + ": " + error.message); }
    const path = new URL(url).pathname;
    const type = path === "/" ? "Página inicial" : path === "/artigos.html" ? "Arquivo de artigos" :
      path.startsWith("/artigos/") ? "Artigo" : "Página institucional";
    return { url, title, type };
  }));
}
function pemBytes(pem) {
  const base64 = pem.replace(/-----BEGIN PRIVATE KEY-----/g, "").replace(/-----END PRIVATE KEY-----/g, "").replace(/\s/g, "");
  return decodeBase64Url(base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""));
}
async function getGoogleAccessToken(env) {
  if (tokenCache.token && tokenCache.expiresAt > Date.now() + 60000) return tokenCache.token;
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error("Configuração pendente: defina GOOGLE_SERVICE_ACCOUNT_JSON nas variáveis de ambiente do Cloudflare Pages.");
  let account;
  try { account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON); }
  catch { throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON não contém JSON válido."); }
  if (!account.client_email || !account.private_key) throw new Error("A credencial do Google precisa conter client_email e private_key.");
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(enc(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claims = base64url(enc(JSON.stringify({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600
  })));
  const unsigned = header + "." + claims;
  const key = await crypto.subtle.importKey("pkcs8", pemBytes(account.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc(unsigned)));
  const assertion = unsigned + "." + base64url(signature);
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    signal: AbortSignal.timeout(10000)
  });
  const tokenData = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokenData.access_token) {
    console.error("Falha na autenticação Google:", tokenData.error || tokenResponse.status);
    throw new Error("Falha na autenticação do Google. Confira a credencial e as permissões no Search Console.");
  }
  tokenCache.token = tokenData.access_token;
  tokenCache.expiresAt = Date.now() + Math.max(60, Number(tokenData.expires_in || 3600)) * 1000;
  return tokenCache.token;
}
function normalizeInspection(data) {
  const result = data?.inspectionResult?.indexStatusResult;
  if (!result) return { status: "unknown", reason: "A API não retornou resultado conclusivo.", checkedAt: new Date().toISOString(), details: "Resposta sem indexStatusResult" };
  const verdict = result.verdict || "NEUTRAL";
  const state = result.indexingState || "UNKNOWN";
  let status = "unknown";
  if (verdict === "PASS" && !/BLOCKED_BY_META_TAG|BLOCKED_BY_HTTP_HEADER|BLOCKED_BY_ROBOTS_TXT/i.test(state)) status = "indexed";
  else if (verdict === "FAIL" && state !== "UNKNOWN") status = "not_indexed";
  return {
    status, reason: result.coverageState || result.indexingState || ("Veredito da API: " + verdict),
    verdict, indexingState: state, pageFetchState: result.pageFetchState || null,
    robotsTxtState: result.robotsTxtState || null, lastCrawlTime: result.lastCrawlTime || null,
    googleCanonical: result.googleCanonical || null, userCanonical: result.userCanonical || null,
    checkedAt: new Date().toISOString()
  };
}
async function inspectUrl(url, env) {
  const cached = inspectionCache.get(url);
  if (cached && Date.now() - cached.at < CACHE_MS) return { ...cached.value, cached: true };
  const accessToken = await getGoogleAccessToken(env);
  const googleResponse = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: "Bearer " + accessToken, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_ORIGIN + "/" }),
    signal: AbortSignal.timeout(15000)
  });
  const data = await googleResponse.json().catch(() => ({}));
  if (!googleResponse.ok) {
    console.error("URL Inspection API erro:", googleResponse.status, data.error?.status || data.error?.message || "sem detalhes");
    throw new Error(googleResponse.status === 403 ?
      "Acesso negado: confirme que a conta de serviço tem acesso à propriedade no Search Console e que a API está ativada." :
      googleResponse.status === 429 ? "Limite de consultas do Google atingido. Aguarde antes de tentar novamente." :
      "A Search Console API retornou HTTP " + googleResponse.status + ".");
  }
  const value = normalizeInspection(data);
  inspectionCache.set(url, { at: Date.now(), value });
  return { ...value, cached: false };
}
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  if (request.method === "OPTIONS") return json({}, 204);
  if (!originAllowed(request, env)) return json({ error: "Origem não autorizada." }, 403);

  if (action === "login" && request.method === "POST") {
    const configuredPassword = env.DEV_PASSWORD;
    const sessionSecret = env.DEV_SESSION_SECRET;
    if (!sessionSecret || sessionSecret.length < 32 || !configuredPassword || configuredPassword.length < 16) {
      return json({ error: "Configure DEV_PASSWORD (mínimo 16 caracteres) e DEV_SESSION_SECRET (mínimo 32 caracteres) nas variáveis do Cloudflare Pages." }, 503);
    }
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const attempt = loginAttempts.get(ip) || { count: 0, until: 0 };
    if (attempt.until > Date.now() && attempt.count >= 8) return json({ error: "Muitas tentativas. Aguarde 15 minutos." }, 429);
    if (attempt.until < Date.now()) { attempt.count = 0; attempt.until = Date.now() + 15 * 60 * 1000; }
    const body = await parseBody(request);
    if (!body || typeof body.password !== "string" || !safeEqual(body.password, configuredPassword)) {
      attempt.count++; loginAttempts.set(ip, attempt);
      return json({ error: "Senha incorreta." }, 401);
    }
    loginAttempts.delete(ip);
    const session = await makeSession(sessionSecret);
    return json({ ok: true }, 200, {
      "Set-Cookie": "of_dev_session=" + session + "; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=" + SESSION_SECONDS
    });
  }
  if (action === "logout" && request.method === "POST") {
    return json({ ok: true }, 200, { "Set-Cookie": "of_dev_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0" });
  }
  if (!env.DEV_SESSION_SECRET || !await validSession(request, env.DEV_SESSION_SECRET)) {
    return json({ error: "Sessão encerrada ou não autenticada." }, 401);
  }
  if (action === "urls" && request.method === "GET") {
    try { return json({ urls: await discoverUrls(), discoveredAt: new Date().toISOString() }); }
    catch (error) {
      console.error("Falha ao descobrir URLs públicas:", error.message);
      return json({ error: "Não foi possível descobrir as páginas públicas do site." }, 502);
    }
  }
  if (action === "inspect" && request.method === "POST") {
    const body = await parseBody(request);
    const publicUrl = body && safePublicUrl(body.url);
    if (!publicUrl) return json({ error: "Informe URL HTTPS pública do domínio frasesdoolavo.online, sem parâmetros." }, 400);
    try { return json({ url: publicUrl, ...await inspectUrl(publicUrl, env) }); }
    catch (error) {
      console.error("Consulta inconclusiva:", error.message);
      return json({ url: publicUrl, status: "unknown", reason: error.message || "Falha na consulta.", checkedAt: new Date().toISOString() });
    }
  }
  if (action === "status" && request.method === "GET") return json({ authenticated: true });
  return json({ error: "Operação não encontrada." }, 404);
}
