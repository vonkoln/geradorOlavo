# Configuração do Modo Desenvolvedor

O painel fica em \`/dev\` e usa uma Vercel Function para autenticar a sessão e consultar a Google Search Console URL Inspection API. A página HTML, por si só, não concede acesso: todas as operações da API exigem uma sessão assinada pelo servidor.

## 1. Configurar a hospedagem

Este projeto é estático e a implementação usa Vercel Functions. Publique a branch \`master\` em um site Vercel com Functions habilitadas. O arquivo \`netlify.toml\` cria os caminhos \`/dev\` e \`/api/dev\`.

No painel da Vercel, abra **Settings → Environment Variables** e crie:

- \`DEV_PASSWORD\`: senha forte e exclusiva, com pelo menos 16 caracteres.
- \`DEV_SESSION_SECRET\`: segredo aleatório com pelo menos 32 caracteres.
- \`GOOGLE_SERVICE_ACCOUNT_JSON\`: conteúdo JSON completo da chave de uma conta de serviço do Google Cloud, incluindo \`client_email\` e \`private_key\`.

Gere um segredo de sessão localmente com, por exemplo:

\`\`\`bash
openssl rand -base64 48
\`\`\`

Crie uma senha longa e exclusiva em um gerenciador de senhas. Não use a mesma senha de outros serviços. Configure as três variáveis no ambiente de produção da Vercel e acione um novo deploy. **Nunca coloque a senha, o segredo ou o JSON da chave em HTML, JavaScript público, commits, issues ou mensagens públicas.** Se uma chave privada for exposta acidentalmente, revogue-a no Google Cloud e crie outra.

## 2. Configurar Google Cloud

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
