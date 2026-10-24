# Configuração do Modo Desenvolvedor

O painel privado fica em `/dev` e foi criado para consultar a Google Search Console URL Inspection API. A página HTML, por si só, não concede acesso: as operações protegidas exigem autenticação no servidor e uma sessão assinada.

## 1. Estado atual da hospedagem

O site público está hospedado no Cloudflare Pages. O arquivo `api/dev.mjs` e o arquivo `vercel.json` foram escritos para o formato de Vercel Functions e **não devem ser considerados automaticamente compatíveis com Cloudflare Pages**. A presença da página `/dev` não comprova que o endpoint `/api/dev` autentique sessões e consulte a API corretamente.

Esta documentação descreve a implementação legada. Antes de depender do monitor na hospedagem atual, migre o endpoint para Cloudflare Pages Functions/Workers, configure as variáveis no ambiente correto e teste o login, a sessão, a consulta individual, a consulta em lote e o logout em um preview isolado. Não faça um deploy de produção na Vercel apenas para seguir as instruções antigas.

## 2. Variáveis de ambiente necessárias

A implementação existente espera estas variáveis no runtime que executar o endpoint:

- `DEV_PASSWORD`: senha forte e exclusiva, com pelo menos 16 caracteres.
- `DEV_SESSION_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `GOOGLE_SERVICE_ACCOUNT_JSON`: JSON completo da chave de uma conta de serviço do Google Cloud, incluindo `client_email` e `private_key`.

Gere um segredo de sessão localmente com, por exemplo:

```bash
openssl rand -base64 48
```

Guarde senhas e chaves em um gerenciador de senhas e no armazenamento de secrets do runtime apropriado. **Nunca coloque senha, segredo, token ou JSON de chave privada em HTML, JavaScript público, commits, issues ou mensagens públicas.** Se uma chave privada for exposta, revogue-a no Google Cloud e crie outra.

Na implementação legada da Vercel, as variáveis ficam em **Settings → Environment Variables** do projeto correspondente. Depois de migrar para Cloudflare, configure-as no ambiente de Pages/Workers utilizado pelo endpoint; as variáveis da Vercel não são transferidas automaticamente.

## 3. Configurar Google Cloud e Search Console

1. Abra o [Google Cloud Console](https://console.cloud.google.com/) e crie ou selecione um projeto.
2. Em **APIs & Services → Library**, ative a **Google Search Console API**.
3. Em **IAM & Admin → Service Accounts**, crie uma conta de serviço.
4. Crie uma chave JSON e guarde-a em local seguro. Não envie a chave ao repositório.
5. Copie o e-mail de `client_email`.
6. No [Google Search Console](https://search.google.com/search-console/), selecione a propriedade de prefixo de URL `https://frasesdoolavo.online/` e abra **Configurações → Usuários e permissões**.
7. Conceda à conta de serviço a permissão necessária para consultar a propriedade.

A conta de serviço precisa ter acesso à propriedade exata consultada pelo painel. A chave privada e o token do Google devem permanecer no servidor; o navegador não deve recebê-los.

Referência oficial: [URL Inspection API — Google Search Console](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect).

## 4. Comportamento esperado do painel

Depois de migrar e configurar o endpoint, testar:

1. Acesso a `https://frasesdoolavo.online/dev`.
2. Login com `DEV_PASSWORD`.
3. Consulta individual e consulta em lote.
4. Mensagens de erro quando faltarem credenciais, permissões ou cotas.
5. Logout e invalidação da sessão.

A lista de URLs pode ser descoberta a partir do sitemap e dos links conhecidos. Páginas órfãs que não estejam ligadas nem incluídas no sitemap podem não aparecer.

## 5. Interpretação dos indicadores

- **Verde — indexada:** a API retornou um veredito positivo e o estado não indica bloqueio conhecido.
- **Vermelho — não indexada:** a API retornou um veredito negativo com estado de indexação conhecido.
- **Amarelo — desconhecida/pendente:** ainda não consultada, veredito inconclusivo, credenciais ausentes, erro de permissão, cota excedida ou falha na consulta.

O resultado é uma fotografia do que o Google informa no momento da inspeção; não garante indexação futura. A inclusão no sitemap também não garante indexação.

## 6. Limites e segurança

- O bloqueio de tentativas de login em memória pode reiniciar entre instâncias serverless; não equivale a uma limitação global.
- O cache em memória pode reiniciar por mudança de instância ou deploy.
- Consultas em lote devem ser sequenciais e respeitar as cotas da API.
- Use senha forte e exclusiva e mantenha as credenciais fora do repositório.
- A compatibilidade do endpoint legado com Cloudflare permanece pendente até que a migração e os testes sejam concluídos.
