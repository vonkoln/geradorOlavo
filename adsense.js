/*
 * Integração do Google AdSense para o Olavo Frases.
 *
 * O ID abaixo foi informado pelo proprietário do site.
 * A aprovação do site e as configurações de anúncios continuam sendo
 * gerenciadas no painel oficial do Google AdSense.
 */
(() => {
  const publisherId = "ca-pub-0610793785321752";
  if (!/^ca-pub-\d{16}$/.test(publisherId)) return;
  if (document.querySelector('script[data-olavo-adsense="true"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.olavoAdsense = "true";
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(publisherId);
  document.head.appendChild(script);
})();
