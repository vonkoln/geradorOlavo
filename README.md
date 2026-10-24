# Frases do Olavo

Publicação editorial independente que reúne frases atribuídas a Olavo de Carvalho e publica artigos de análise, reportagem e reflexão. A coleção de citações e os artigos são conteúdos distintos; atribuições devem ser verificadas no contexto original sempre que possível.

**Site:** https://frasesdoolavo.online/

## Arquitetura atual

- Código-fonte versionado no GitHub: `vonkoln/geradorOlavo`, branch principal `master`.
- Domínio registrado na Hostinger.
- Hospedagem declarada pelo projeto: Cloudflare Pages; a implantação ao vivo não foi validada nesta auditoria.
- O projeto é majoritariamente HTML, CSS, JavaScript e JSON, sem `package.json` nem etapa de build definida no repositório.
- O arquivo `vercel.json` ainda existe e contém regras específicas da Vercel para `/dev` e cabeçalhos. Essas regras não são automaticamente aplicadas pelo Cloudflare Pages. A configuração pública de DNS, implantação e eventuais funções externas deve ser verificada no painel do provedor; não é inferida apenas a partir deste repositório.

## Funcionalidades

- Página inicial com gerador e pesquisa de frases.
- Coleção de frases em `olavo.json`; atualmente os registros contêm o texto da frase, sem metadados de fonte individual.
- Arquivo de artigos com pesquisa, filtros por tema e contagem dinâmica.
- Artigos em português e páginas de navegação/institucionais em português, inglês, espanhol, francês, alemão e italiano.
- Páginas institucionais de Sobre, Contato e Política de Privacidade, além da seção Economia.
- Modelo HTML de artigo com `noindex, follow`.
- Metadados de SEO, canonicals, alternates de idioma, `sitemap.xml`, `robots.txt` e `ads.txt`.
- Script de integração do Google AdSense presente em várias páginas. A presença do script ou de um registro em `ads.txt` não comprova aprovação da conta nem veiculação efetiva de anúncios.

## Estrutura

- `index.html`, `index.js`, `olavo.json`: página inicial e coleção de frases.
- `artigos.html`: arquivo de artigos em português.
- `artigos/`: artigos publicados e `modelo-artigo.html`.
- `en/`, `es/`, `fr/`, `de/`, `it/`: páginas localizadas.
- `economia.html` e variantes localizadas: seção Economia.
- `sobre.html`, `contato.html`, `privacidade.html` e variantes localizadas: páginas institucionais.
- `reset.css`: estilos compartilhados.
- `sitemap.xml`, `robots.txt`, `ads.txt`: arquivos de descoberta e configuração para crawlers/publicidade.
- `dev.html`, `vercel.json` e `DEV_SETUP.md`: área de desenvolvimento e documentação associada. A disponibilidade de `/dev` e de seus serviços depende da implantação e de configurações externas; não deve ser considerada validada apenas pelo código.

## Desenvolvimento local

1. Clone ou baixe o repositório.
2. Abra a pasta do projeto.
3. Inicie um servidor HTTP local, por exemplo, com a extensão Live Server do Visual Studio Code.
4. Acesse a página inicial pelo endereço local do servidor.

Usar um servidor HTTP local é recomendado para que o JavaScript consiga carregar `olavo.json` corretamente. Não há dependências npm declaradas no repositório.

## Como publicar um artigo

1. Copie `artigos/modelo-artigo.html` para um novo arquivo com nome descritivo.
2. Atualize título, descrição, URL canônica, metadados de compartilhamento, idioma, data e autoria com informações verificadas.
3. Escreva o texto com contexto e análise própria; diferencie fatos, alegações atribuídas, interpretação e incerteza.
4. Inclua links diretos para fontes confiáveis e verifique a licença/atribuição de imagens.
5. Confira os caminhos relativos, a navegação, a acessibilidade e o comportamento em telas pequenas.
6. Adicione o artigo ao arquivo `artigos.html` e aos arquivos localizados quando for realmente útil e o idioma estiver claramente indicado.
7. Inclua a URL pública no `sitemap.xml` e revise os alternates de idioma apenas quando houver páginas equivalentes reais.
8. Valide o HTML, os links e os metadados antes de publicar.

## SEO e conteúdo

- Use títulos e descrições únicos e informativos.
- Mantenha uma hierarquia semântica de títulos e um H1 principal por página.
- Preserve URLs canônicas estáveis e confirme redirecionamentos no ambiente publicado.
- Cite fontes verificáveis em artigos factuais; em saúde, segurança e temas de impacto público, priorize fontes primárias, diretrizes e revisões confiáveis.
- Não apresente artigos em português como se estivessem traduzidos; as páginas localizadas devem indicar claramente quando o artigo completo está disponível apenas em português.
- Atualize o sitemap ao adicionar/remover páginas públicas. O sitemap não garante indexação.
- O modelo de artigo deve permanecer fora do índice e não deve ser listado no sitemap.

## Privacidade e publicidade

A política de privacidade deve refletir o código e os serviços efetivamente utilizados. O script do AdSense está presente em várias páginas do repositório; a veiculação depende da situação da conta e das configurações aplicáveis. Verifique as exigências de consentimento e mensagens de privacidade no painel do Google conforme os países dos visitantes. Esta documentação não constitui certificação jurídica ou garantia de conformidade.

## Área de desenvolvimento

A página `dev.html` inclui metadados `noindex, nofollow, noarchive`. O `vercel.json` contém uma regra legada para reescrever `/dev` para `/dev.html` e cabeçalhos de segurança no ambiente Vercel. Como o site foi migrado para Cloudflare Pages, valide separadamente o roteamento, a proteção de acesso, os cabeçalhos e os endpoints usados pela área privada no provedor realmente ativo. Não exponha chaves ou credenciais no repositório.

## Licença

Nenhuma licença geral de reutilização foi identificada neste repositório. Verifique as licenças específicas de imagens e outros materiais antes de reutilizá-los; a ausência de licença do projeto não autoriza a reprodução indiscriminada do conteúdo.
