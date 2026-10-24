# Frases do Olavo

Portal editorial estático com uma coleção de frases atribuídas a Olavo de Carvalho e artigos de análise sobre política, tecnologia, economia, segurança digital, cultura e sociedade.

**Site:** https://frasesdoolavo.online/  
**Repositório:** https://github.com/vonkoln/geradorOlavo  
**Hospedagem atual:** Cloudflare Pages (conforme a configuração operacional do projeto).

## Funcionalidades

- Página inicial com frase em destaque e gerador de citações.
- Seleção aleatória sem repetição até percorrer a coleção.
- Busca textual e opção para copiar a frase.
- Arquivo de artigos com pesquisa e filtro por tema.
- Páginas institucionais de Sobre, Contato e Política de Privacidade.
- Categorias editoriais, incluindo Economia.
- Versões de navegação em português, inglês, espanhol, francês, alemão e italiano.
- Layout responsivo e metadados básicos de SEO.

## Estrutura do projeto

- `index.html`, `index.js`, `reset.css`: página inicial, comportamento e estilos.
- `olavo.json`: coleção de frases.
- `artigos.html` e `artigos/`: arquivo, modelo e artigos editoriais.
- `sitemap.xml` e `robots.txt`: descoberta e orientação de rastreamento.
- `adsense.js` e integrações presentes nas páginas: carregamento do script do AdSense.
- `dev.html`, `api/dev.mjs` e `vercel.json`: painel privado de monitoramento e configuração legada associada à Vercel.

## Tecnologias

- HTML5, CSS e JavaScript.
- JSON para os dados das frases.
- Cloudflare Pages como hospedagem atual do site público.
- Google Search Console URL Inspection API para o monitor privado, dependente de autenticação e infraestrutura de servidor.

## Como executar localmente

1. Clone ou baixe o repositório.
2. Abra a pasta do projeto.
3. Inicie um servidor HTTP local, por exemplo com a extensão Live Server do Visual Studio Code.
4. Acesse o endereço local fornecido pelo servidor.

Um servidor HTTP local é recomendado para que o JavaScript carregue `olavo.json` corretamente.

## Como publicar um artigo

1. Copie `artigos/modelo-artigo.html`.
2. Dê ao arquivo um nome descritivo, com hífens no lugar de espaços.
3. Atualize título, descrição, conteúdo, autoria, datas reais e metadados de compartilhamento.
4. Mantenha os caminhos relativos compatíveis com arquivos dentro de `artigos/`.
5. Adicione o artigo ao arquivo `artigos.html`.
6. Inclua a URL canônica correta em `sitemap.xml).
7. Revise originalidade, atribuições, links e fontes primárias antes da publicação.
8. Teste o artigo no preview antes de integrá-lo à branch de produção.

## SEO e qualidade editorial

- Use título, descrição e URL canônica próprios para cada página.
- Mantenha uma hierarquia coerente de títulos HTML.
- Use dados estruturados que correspondam ao conteúdo visível; não invente autores, datas ou imagens.
- Cite fontes verificáveis para alegações factuais e diferencie fatos confirmados, relatos e hipóteses.
- Verifique atribuições de citações e preserve a incerteza quando não houver fonte confiável.
- Atualize o sitemap ao adicionar ou retirar páginas públicas.
- A presença no sitemap não garante indexação.
- Não publique traduções ou equivalências hreflang que não correspondam ao conteúdo disponível.

## Hospedagem e modo desenvolvedor

O site público é hospedado no Cloudflare Pages. O repositório ainda contém `vercel.json` e `api/dev.mjs`, cujo formato de handler e regras são associados à Vercel. **A compatibilidade do endpoint privado com Cloudflare Pages precisa ser validada e, se necessário, migrada antes de considerar o monitor de indexação plenamente operacional.** Não presuma que a configuração legada da Vercel seja aplicada pelo Cloudflare.

Consulte `DEV_SETUP.md` para conhecer a implementação existente e suas dependências. Nunca armazene senhas, tokens ou chaves privadas no código público. Recursos dependentes de servidor exigem configuração adicional e testes no ambiente de destino.

## AdSense

O estado de aprovação e a configuração de anúncios são gerenciados no painel oficial do Google AdSense. A presença do script ou do arquivo `ads.txt` não significa que o site esteja aprovado. Antes de solicitar nova análise, confira conteúdo, políticas, experiência do usuário e funcionamento real da integração.

## Licença

Nenhuma licença específica foi definida neste repositório. Entre em contato com o responsável antes de reutilizar conteúdo ou materiais que exijam autorização.
