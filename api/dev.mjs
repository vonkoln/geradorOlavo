import { createHmac, createSign, timingSafeEqual } from "node:crypto";

const SITE_ORIGIN = "https://frasesdoolavo.online";
const SITE_HOST = new URL(SITE_ORIGIN).hostname;
const SESSION_SECONDS = 8 * 60 * 60;
const CACHE_MS = 15 * 60 * 1000;
const inspectionCache = new Map();
const tokenCache = { token: "", expiresAt: 0 };
const loginAttempts = new Map();

function response(res, statusCode, body, extraHeaders = {}) {
  res.statusCode = statusCode;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    ...extraHeaders
  };
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  if (statusCode === 204) return res.end();
  return res.status(statusCode).json(body);
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a ?? ""));
  const right = Buffer.from(String(b ?? ""));
  return left.length === right.length && timingSafeEqual(left, right);
}
function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}
function makeSession(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, v: 1 })).toString("base64url");
  return payload + "." + sign(payload, secret);
}
function validSession(event, secret) {
  const cookies = (event.headers.cookie || event.headers.Cookie || "").split(";").map(part => part.trim());
  const item = cookies.find(part => part.startsWith("of_dev_session="));
  if (!item) return false;
  const value = item.slice("of_dev_session=".length);
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.v === 1 && Number(decoded.exp) > Math.floor(Date.now() / 1000);
  } catch { return false; }
}
function originAllowed(event) {
  const headers = event.headers || {};
  const origin = headers.origin;
  const allowedOrigins = new Set([
    "https://frasesdoolavo.online",
    "https://www.frasesdoolavo.online"
  ]);

  // Se o navegador envia Origin, exige uma das origens oficiais.
  if (origin) return allowedOrigins.has(String(origin).replace(/\/$/, ""));

  // Alguns navegadores não enviam Origin em GET same-origin. Como o painel
  // usa Referrer-Policy: no-referrer, Referer também pode estar ausente.
  // Nesse caso, só permite leitura quando Fetch Metadata confirma same-origin.
  const method = String(event.httpMethod || "GET").toUpperCase();
  const fetchSite = String(headers["sec-fetch-site"] || "").toLowerCase();
  return method === "GET" && fetchSite === "same-origin";
}
function parseBody(event) {
  try {
    if (event.body && typeof event.body === "object") return event.body;
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : (event.body || "");
    return JSON.parse(raw || "{}");
  } catch { return null; }
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
  const queue = ["/", "/artigos.html", "/sobre.html", "/contato.html", "/privacidade.html"];
  for (const path of queue) {
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
async function getGoogleAccessToken() {
  if (tokenCache.token && tokenCache.expiresAt > Date.now() + 60000) return tokenCache.token;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Configuração pendente: defina GOOGLE_SERVICE_ACCOUNT_JSON nas variáveis de ambiente da Vercel.");
  let account;
  try { account = JSON.parse(raw); } catch { throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON não contém JSON válido."); }
  if (!account.client_email || !account.private_key) throw new Error("A credencial do Google precisa conter client_email e private_key.");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(JSON.stringify({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600
  })).toString("base64url");
  const unsigned = header + "." + claims;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned); signer.end();
  const assertion = unsigned + "." + signer.sign(account.private_key).toString("base64url");
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
  if (!result) return {
    status: "unknown", reason: "A API não retornou resultado conclusivo.",
    checkedAt: new Date().toISOString(), details: "Resposta sem indexStatusResult"
  };
  const verdict = result.verdict || "NEUTRAL";
  const state = result.indexingState || "UNKNOWN";
  let status = "unknown";
  if (verdict === "PASS" && !/BLOCKED_BY_META_TAG|BLOCKED_BY_HTTP_HEADER|BLOCKED_BY_ROBOTS_TXT/i.test(state)) status = "indexed";
  else if (verdict === "FAIL" && state !== "UNKNOWN") status = "not_indexed";
  return {
    status,
    reason: result.coverageState || result.indexingState || ("Veredito da API: " + verdict),
    verdict, indexingState: state,
    pageFetchState: result.pageFetchState || null,
    robotsTxtState: result.robotsTxtState || null,
    lastCrawlTime: result.lastCrawlTime || null,
    googleCanonical: result.googleCanonical || null,
    userCanonical: result.userCanonical || null,
    checkedAt: new Date().toISOString()
  };
}
async function inspectUrl(url) {
  const cached = inspectionCache.get(url);
  if (cached && Date.now() - cached.at < CACHE_MS) return { ...cached.value, cached: true };
  const accessToken = await getGoogleAccessToken();
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
export default async function handler(req, res) {
  const event = { httpMethod: req.method, path: req.url, headers: req.headers, body: req.body, isBase64Encoded: false };
  const method = req.method || "GET";
  const path = req.url || "/";
  const action = new URL(path, SITE_ORIGIN).searchParams.get("action");
  const sessionSecret = process.env.DEV_SESSION_SECRET;
  const configuredPassword = process.env.DEV_PASSWORD;
  if (method === "OPTIONS") return response(res, 204, {});
  if (!originAllowed(event)) return response(res, 403, { error: "Origem não autorizada." });
  if (action === "login" && method === "POST") {
    if (!sessionSecret || sessionSecret.length < 32 || !configuredPassword || configuredPassword.length < 16) {
      return response(res, 503, { error: "Configure DEV_PASSWORD (mínimo 16 caracteres) e DEV_SESSION_SECRET (mínimo 32 caracteres) na Vercel." });
    }
    const ip = String(event.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
    const attempt = loginAttempts.get(ip) || { count: 0, until: 0 };
    if (attempt.until > Date.now() && attempt.count >= 8) return response(res, 429, { error: "Muitas tentativas. Aguarde 15 minutos." });
    if (attempt.until < Date.now()) { attempt.count = 0; attempt.until = Date.now() + 15 * 60 * 1000; }
    const body = parseBody(event);
    if (!body || typeof body.password !== "string" || !safeEqual(body.password, configuredPassword)) {
      attempt.count++; loginAttempts.set(ip, attempt);
      return response(res, 401, { error: "Senha incorreta." });
    }
    loginAttempts.delete(ip);
    return response(res, 200, { ok: true }, {
      "Set-Cookie": "of_dev_session=" + makeSession(sessionSecret) + "; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=" + SESSION_SECONDS
    });
  }
  if (action === "logout" && method === "POST") {
    return response(res, 200, { ok: true }, { "Set-Cookie": "of_dev_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0" });
  }
  if (!sessionSecret || !validSession(event, sessionSecret)) return response(res, 401, { error: "Sessão encerrada ou não autenticada." });
  if (action === "urls" && method === "GET") {
    try { return response(res, 200, { urls: await discoverUrls(), discoveredAt: new Date().toISOString() }); }
    catch (error) {
      console.error("Falha ao descobrir URLs públicas:", error.message);
      return response(res, 502, { error: "Não foi possível descobrir as páginas públicas do site." });
    }
  }
  if (action === "inspect" && method === "POST") {
    const body = parseBody(event);
    const url = body && safePublicUrl(body.url);
    if (!url) return response(res, 400, { error: "Informe URL HTTPS pública do domínio frasesdoolavo.online, sem parâmetros." });
    try { return response(res, 200, { url, ...await inspectUrl(url) }); }
    catch (error) {
      console.error("Consulta inconclusiva:", error.message);
      return response(res, 200, { url, status: "unknown", reason: error.message || "Falha na consulta.", checkedAt: new Date().toISOString() });
    }
  }
  if (action === "status" && method === "GET") return response(res, 200, { authenticated: true });
  return response(res, 404, { error: "Operação não encontrada." });
};
