/*
 * Integração opcional do Google AdSense para o Olavo Frases.
 *
 * Antes de ativar:
 * 1. Cadastre/valide o site na sua conta AdSense.
 * 2. Substitua o valor vazio abaixo pelo ID de editor exibido pelo Google,
 *    no formato ca-pub-0000000000000000.
 * 3. Confirme a política de privacidade e as configurações de consentimento.
 * 4. Configure anúncios automáticos ou blocos na conta AdSense.
 *
 * Enquanto o ID estiver vazio ou inválido, nenhum script de publicidade será
 * carregado. Este arquivo não substitui a aprovação do site pelo Google.
 */
(() => {
  const publisherId = ""; // Preencher somente com o ID real da conta AdSense.
  if (!/^ca-pub-\d{16}$/.test(publisherId)) return;
  if (document.querySelector('script[data-olavo-adsense="true"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.olavoAdsense = "true";
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(publisherId);
  document.head.appendChild(script);
})();