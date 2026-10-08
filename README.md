# Olavo Frases

Site estático para explorar frases atribuídas a Olavo de Carvalho e publicar artigos em formato editorial.

**Site:** https://olavofrases.netlify.app/

## Funcionalidades

- Página inicial com apresentação do projeto e frase em destaque.
- Gerador de frases com seleção aleatória sem repetição até percorrer a coleção.
- Busca de frases por texto e opção para copiar o resultado.
- Arquivo de artigos com pesquisa e filtro por tema.
- Modelo HTML para criar novos artigos.
- Layout responsivo para computadores e dispositivos móveis.
- Metadados básicos de SEO e sitemap XML.\n- Páginas institucionais de Sobre, Contato e Política de Privacidade.\n- Integração condicional do script do Google AdSense, inativa até configurar o ID real do editor.

## Estrutura do projeto

~~~text
.
├── index.html
├── artigos.html
├── index.js
├── reset.css
├── olavo.json
├── sitemap.xml
└── artigos/
    ├── modelo-artigo.html
    └── olavo-de-carvalho-stf-dias-toffoli-2010.html
~~~

## Tecnologias

- HTML5
- CSS
- JavaScript
- JSON para os dados das frases
- Netlify para hospedagem estática

Não é necessário instalar dependências para editar ou executar a versão estática.

## Como executar localmente

1. Clone ou baixe este repositório.
2. Abra a pasta do projeto.
3. Inicie um servidor HTTP local — por exemplo, a extensão **Live Server** do Visual Studio Code.
4. Acesse a página inicial pelo endereço local fornecido pelo servidor.

Usar um servidor HTTP local é recomendado para que o JavaScript consiga carregar o arquivo olavo.json corretamente.

## Como publicar um artigo

1. Copie artigos/modelo-artigo.html.
2. Dê ao arquivo um nome descritivo, usando hífens no lugar de espaços.
3. Edite o título, a descrição, a data, o conteúdo e os metadados de compartilhamento.
4. Mantenha a navegação e os caminhos relativos compatíveis com os arquivos dentro da pasta artigos/.
5. Adicione o artigo à listagem em artigos.html.
6. Inclua a URL canônica do novo artigo em sitemap.xml.
7. Revise o texto, os links e as fontes antes de publicar.

## SEO e conteúdo

- Use um título e uma descrição próprios para cada página.
- Mantenha uma hierarquia clara de títulos HTML (h1, h2, h3).
- Prefira URLs legíveis e estáveis.
- Cite fontes verificáveis em artigos factuais.
- Atualize o sitemap quando adicionar ou remover páginas públicas.
- O sitemap, por si só, não garante que as páginas sejam indexadas pelos mecanismos de busca.

## Observações

Este projeto é uma publicação editorial estática. Recursos que dependam de servidor — como cadastro de usuários, comentários, newsletter ou envio de artigos por formulário — exigem serviços ou infraestrutura adicionais e não são fornecidos por este repositório.

## Licença

Nenhuma licença específica foi definida neste repositório. Entre em contato com o responsável pelo projeto antes de reutilizar o conteúdo ou os materiais de forma que exija autorização.
