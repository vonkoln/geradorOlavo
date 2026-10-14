# Configuração do Modo Desenvolvedor

## Estado atual

O site está hospedado no Cloudflare Pages, conforme a arquitetura atual do projeto. A interface está em `dev.html`, mas a API `api/dev.mjs` e as regras em `vercel.json` foram escritas para Vercel Functions e não são executadas automaticamente pelo Cloudflare Pages.

**O monitor não deve ser considerado funcional na hospedagem atual até que a API seja migrada e testada.** A migração precisa adaptar o handler para Cloudflare Pages Functions (por exemplo, `functions/api/dev.js`), usar o contrato `Request/Response`, configurar variáveis de ambiente no ambiente correto e validar autenticação, expiração de sessão, proteção de endpoints e integração com a Search Console. Não copie segredos para o repositório.

## Configuração legada da Vercel (referência, não instrução de deploy atual)

A implementação antiga usava Vercel Functions e as seguintes variáveis de ambiente:

- `DEV_PASSWORD`: senha forte e exclusiva, com pelo menos 16 caracteres.
- `DEV_SESSION_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `GOOGLE_SERVICE_ACCOUNT_JSON`: conteúdo JSON completo da chave de uma conta de serviço do Google Cloud, incluindo `client_email` e `private_key`.

Gere um segredo de sessão localmente com, por exemplo:

```bash
openssl rand -base64 48
```

Crie uma senha longa e exclusiva em um gerenciador de senhas. Na antiga implantação da Vercel, essas variáveis eram definidas em **Settings → Environment Variables**. Nunca coloque a senha, o segredo ou o JSON da chave em HTML, JavaScript público, commits, issues ou mensagens públicas. Se uma chave privada for exposta acidentalmente, revogue-a no Google Cloud e crie outra.

## Configurar Google Cloud

1. Abra o [Google Cloud Console](https://console.cloud.google.com/), crie ou selecione um projeto.
2. Em **APIs & Services → Library**, procure e ative **Google Search Console API**.
3. Em **IAM & Admin → Service Accounts**, crie uma conta de serviço para o monitor.
4. Crie uma chave JSON para essa conta e guarde o arquivo em local seguro. Copie o conteúdo completo para a variável de ambiente \`GOOGLE_SERVICE_ACCOUNT_JSON\` na Vercel. Não faça upload da chave para o repositório.
5. Copie o e-mail da conta de serviço (campo \`client_email\`).
6. Abra o [Google Search Console](https://search.google.com/search-console/), selecione a propriedade de prefixo de URL **\`https://frasesdoolavo.online/\`** e vá a **Configurações → Usuários e permissões**.
7. Adicione o e-mail da conta de serviço como usuário com permissão suficiente para consultar a propriedade (preferencialmente **Completo**). A conta que administra o Search Console precisa ter autorização para conceder esse acesso.

A conta de serviço e a propriedade precisam corresponder exatamente ao prefixo configurado no painel. A autenticação é feita no servidor com a chave privada; o navegador nunca recebe essa chave nem o token do Google.

Referência oficial: [URL Inspection API — Google Search Console](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect).

## 3. Como usar

1. Acesse \`https://frasesdoolavo.online/dev\`.
2. Entre com o valor configurado em \`DEV_PASSWORD\`.
3. A lista é montada a partir do sitemap e dos links das páginas públicas principais.
4. Use **Verificar** para uma página ou **Verificar todas** para consultar em sequência. O painel aplica um intervalo entre as chamadas e o servidor mantém cache temporário de 15 minutos por instância.
5. Use os filtros para separar indexadas, não indexadas e desconhecidas. **Sair** encerra a sessão no navegador.

## Interpretação dos indicadores

- **Verde — indexada:** a API retornou veredito \`PASS\` e o estado não indica bloqueio conhecido.
- **Vermelho — não indexada:** a API retornou veredito \`FAIL\` com estado de indexação conhecido.
- **Amarelo — desconhecida/pendente:** ainda não consultada, veredito inconclusivo, falta de credenciais, erro de permissão, cota excedida ou falha na consulta.

O estado é o que o Google conhece no momento da inspeção e pode mudar. Não garante indexação futura. O sitemap também não garante indexação.

## Limites e segurança

- O painel não oferece garantia de limitação de tentativas global entre todas as instâncias serverless; o bloqueio básico de tentativas de login é em memória e pode reiniciar entre instâncias. Use uma senha forte e, se necessário, adicione proteção de acesso no nível da hospedagem.
- O cache em memória também pode ser reiniciado por uma nova instância ou deploy. A verificação em massa é sequencial, mas deve ser usada com cuidado para não exceder as cotas do Google.
- A descoberta usa o sitemap e os links de páginas públicas conhecidas; páginas órfãs que não estejam ligadas nem no sitemap podem não aparecer.
- Se a integração ainda não estiver configurada, as consultas aparecem como desconhecidas com uma mensagem explicativa; o painel não inventa resultados.
- A função `api/dev.mjs` usa o formato de handler Node.js da Vercel. O painel só consulta o Google depois que as variáveis de ambiente e as permissões da conta de serviço estiverem configuradas no projeto Vercel ligado ao domínio.
