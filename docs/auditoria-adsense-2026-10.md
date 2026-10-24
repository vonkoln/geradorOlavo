# Auditoria editorial e técnica — prontidão para AdSense

**Data da inspeção:** 24 de outubro de 2026  
**Repositório:** [vonkoln/geradorOlavo](https://github.com/vonkoln/geradorOlavo)  
**Branch examinada inicialmente:** `master`  
**Commit de referência informado pela comparação GitHub:** `f1de4ea2c4926f5e18b373562876b0418c6b76e8`  
**Branch de trabalho:** `audit/adsense-editorial-review-2026-10`  
**Produção:** não alterada; a versão publicada não pôde ser acessada neste ambiente.

## 1. Resumo executivo

### Fatos verificados no repositório

- `sitemap.xml` contém **51 URLs únicas**: 6 páginas iniciais, 6 arquivos de artigos, 15 artigos em português e 24 páginas institucionais/localizadas.
- Os 15 arquivos HTML de artigos do sitemap existem na branch `master`. O arquivo de artigos em português contém 15 cartões e um contador inicial de 15; os filtros usam aliases sem acento na URL e valores acentuados na interface.
- `robots.txt` permite rastreamento e declara `https://frasesdoolavo.online/sitemap.xml`. `ads.txt` contém `google.com, pub-0610793785321752, DIRECT, f08c47fec0942fa0`.
- `olavo.json` contém 358 registros de frases e 354 textos distintos (quatro ocorrências repetidas). O JavaScript remove duplicatas em tempo de execução, mas os registros do JSON não têm campos de fonte, obra, data ou contexto para cada citação.
- As páginas localizadas explicam, em geral, que as citações permanecem em português e que artigos sem tradução integral são originais em português. As páginas de arquivo em inglês e espanhol mostram 15 cartões; francês, alemão e italiano mostram 12 artigos selecionados. A diferença não é, por si só, erro, mas precisa continuar explicitamente comunicada.
- O modelo `artigos/modelo-artigo.html` contém `noindex, follow` e não aparece no sitemap.
- O código do Google AdSense está presente em várias páginas. A presença do script e do `ads.txt` não comprova que anúncios estejam sendo servidos nem que a conta esteja aprovada.
- O README ainda descrevia a Vercel como hospedagem e dizia que a integração AdSense estava inativa até configurar o ID do editor, embora o script e o ID do publisher já estejam no HTML. Também continha sequências literais `\\n` em vez de quebras de linha.
- `vercel.json` permanece no repositório, com rewrite de `/dev` para `/dev.html` e cabeçalhos para a Vercel. Não foram encontrados `_headers`, `_redirects`, `wrangler.toml` ou `package.json` na raiz. Isso não prova que a produção esteja na Vercel; significa que a configuração pública de roteamento e hospedagem precisa ser confirmada separadamente.
- Há quatro pull requests de auditoria abertos com branches divergentes e muito atrás de `master`. A branch `audit/adsense-readiness-2026-10` estava 101 commits atrás e `audit/site-ux-editorial-2026-10` estava 104 commits atrás na comparação executada. Não devem ser mescladas sem rebase, revisão e novos testes.

### Hipóteses plausíveis para o diagnóstico “Conteúdo de baixo valor” — não causas confirmadas

1. **Coleção de citações sem proveniência por item.** O aviso geral de que as frases são “atribuídas” e devem ser conferidas é honesto, mas não substitui a fonte individual. Um gerador que apresenta frases curtas sem obra, data, página, gravação ou grau de verificação pode entregar utilidade limitada.
2. **Amplitude temática e identidade editorial.** O projeto reúne citações filosóficas e artigos sobre STF, Bitcoin, saúde, esporte, negócios locais, eleição e desaparecimento de carga. Essa variedade pode funcionar em um portal, mas precisa de uma promessa editorial e critérios de apuração muito claros para não parecer uma coleção de temas desconectados.
3. **Diferença entre curadoria e reportagem original.** Muitos artigos têm estrutura, fontes e ressalvas; ainda assim, em vários casos o valor diferencial é principalmente síntese de fontes externas. Aumentar palavras não resolve isso. O ganho real virá de documentos primários, método reproduzível, entrevistas autorizadas, dados próprios e análise que vá além do resumo.
4. **Risco editorial de saúde.** Os dois artigos sobre iodo descrevem teses de altas doses e alegações extratireoidianas. O artigo histórico tinha uma lista bibliográfica sem links externos no corpo; essa falha foi corrigida nesta branch com fontes clínicas independentes e um aviso de segurança mais explícito. O segundo artigo continua exigindo conferência da fonte original da aula e rastreamento de cada alegação.
5. **Sinais institucionais incompletos.** O canal de contato é uma issue pública no GitHub, com aviso de privacidade adequado; não há endereço de e-mail privado publicado. Isso é uma escolha legítima, mas reduz a expectativa de contato confidencial e deve permanecer claro.
6. **Internacionalização de páginas de navegação versus conteúdo.** As páginas institucionais e os arquivos são traduzidos, enquanto os artigos completos continuam em português. O site sinaliza essa limitação, o que é positivo. É necessário manter essa indicação em todos os idiomas e evitar qualquer promessa de tradução integral inexistente.

Essas hipóteses seguem os critérios públicos do Google para conteúdo útil: originalidade, análise própria, exatidão, transparência sobre autoria e valor real além de resumir fontes. Elas não permitem prever a decisão do AdSense.

## 2. Matriz das 51 URLs do sitemap

**Como interpretar a coluna “estado”:** “Arquivo encontrado” significa que o caminho correspondente existe no código da branch `master`; não significa que a URL respondeu HTTP 200 na produção. A resolução DNS do domínio falhou neste ambiente e a inspeção ao vivo não foi possível.

| # | URL | Tipo / idioma | Estado e evidência no código | Ação recomendada |
|---:|---|---|---|---|
| 1 | [https://frasesdoolavo.online/](https://frasesdoolavo.online/) | Início, pt-BR | Arquivo encontrado; gerador, busca de frases, destaques editoriais e temas. | Manter a proposta “citações + contexto editorial”; iniciar auditoria de proveniência das citações e evitar sugerir que cada frase foi autenticada. |
| 2 | [https://frasesdoolavo.online/en/](https://frasesdoolavo.online/en/) | Início, en | Arquivo encontrado; informa que citações e artigos permanecem em português quando não traduzidos. | Manter aviso de idioma original; revisar links e interação do gerador em navegador real. |
| 3 | [https://frasesdoolavo.online/es/](https://frasesdoolavo.online/es/) | Início, es | Arquivo encontrado; apresenta conteúdo como original em português quando aplicável. | Manter aviso; validar interação e textos acessíveis em produção. |
| 4 | [https://frasesdoolavo.online/artigos.html](https://frasesdoolavo.online/artigos.html) | Arquivo de artigos, pt-BR | 15 cartões, contador 15, pesquisa, filtros, estado vazio e aliases de URL presentes no JavaScript. | Manter contagem e filtros; validar cliques, teclado e parâmetros em navegador real. |
| 5 | [https://frasesdoolavo.online/en/articles.html](https://frasesdoolavo.online/en/articles.html) | Arquivo de artigos, en | Arquivo encontrado; 15 cartões e aviso de artigos ainda em português. | Manter indicação explícita de idioma do artigo; verificar se cada link de artigo é rotulado como original em português. |
| 6 | [https://frasesdoolavo.online/es/articulos.html](https://frasesdoolavo.online/es/articulos.html) | Arquivo de artigos, es | Arquivo encontrado; 15 cartões e aviso de artigos originais em português. | Manter indicação explícita; validar filtros e destinos em produção. |
| 7 | [https://frasesdoolavo.online/artigos/olavo-de-carvalho-stf-dias-toffoli-2010.html](https://frasesdoolavo.online/artigos/olavo-de-carvalho-stf-dias-toffoli-2010.html) | Artigo, pt-BR | Arquivo encontrado; 6 links externos; o próprio texto admite não ter localizado gravação/transcrição primária verificável da fala atribuída. | Título suavizado nesta branch para não apresentar como comprovada uma previsão atribuída sem fonte primária; manter distinção entre crítica atribuída e fatos documentados. |
| 8 | [https://frasesdoolavo.online/artigos/requisitos-ministro-stf-constituicao.html](https://frasesdoolavo.online/artigos/requisitos-ministro-stf-constituicao.html) | Artigo, pt-BR | Arquivo encontrado; referências à Constituição, Planalto, STF, Emenda Constitucional 122/2022 e Senado. | Manter; conferir a redação vigente do art. 101 e preservar links oficiais diretos. |
| 9 | [https://frasesdoolavo.online/artigos/hack-coldcard-carteiras-drenadas.html](https://frasesdoolavo.online/artigos/hack-coldcard-carteiras-drenadas.html) | Artigo, pt-BR | Arquivo encontrado; 8 links externos, incluindo Coldcard, Galaxy Research, TRM Labs, Bitquery e imprensa especializada. | Manter atribuições e datas de corte; verificar novamente a página oficial de segurança e distinguir atribuição on-chain de identidade comprovada. |
| 10 | [https://frasesdoolavo.online/artigos/lavagem-bitcoins-roubados-coldcard-rastreamento.html](https://frasesdoolavo.online/artigos/lavagem-bitcoins-roubados-coldcard-rastreamento.html) | Artigo, pt-BR | Arquivo encontrado; 7 links externos; contém ressalva de que uma transferência isolada não prova identidade ou intenção. | Manter a ressalva; datar cada atualização e evitar atribuir intenção criminosa a endereços sem fonte que sustente a inferência. |
| 11 | [https://frasesdoolavo.online/artigos/zachxbt-349-mil-dolares-lavagem-lazarus-coreia-norte.html](https://frasesdoolavo.online/artigos/zachxbt-349-mil-dolares-lavagem-lazarus-coreia-norte.html) | Artigo, pt-BR | Arquivo encontrado; 9 links externos, incluindo FBI e FinCEN, além de veículos que relatam a investigação de ZachXBT. | Manter atribuição explícita; separar a atribuição oficial do ataque à Bybit das afirmações atribuídas ao investigador sobre intermediários e fundos. |
| 12 | [https://frasesdoolavo.online/artigos/neymar-dois-gols-santos-flamengo-lideranca-brasileirao-2026.html](https://frasesdoolavo.online/artigos/neymar-dois-gols-santos-flamengo-lideranca-brasileirao-2026.html) | Artigo, pt-BR | Arquivo encontrado; 5 links externos, incluindo ge e Folha; o texto identifica a imagem como foto de arquivo, não da partida relatada. | Manter essa distinção; confirmar placar, tabela e data antes de republicar ou atualizar. |
| 13 | [https://frasesdoolavo.online/artigos/openai-722-manuscritos-matematicos-ia-singularidade-skynet-asimov.html](https://frasesdoolavo.online/artigos/openai-722-manuscritos-matematicos-ia-singularidade-skynet-asimov.html) | Artigo, pt-BR | Arquivo encontrado; 4 links externos, incluindo anúncio oficial da OpenAI, Encyclopedia of Science Fiction e NASA. | Manter; distinguir resultados gerados, formalizações verificáveis e resultados ainda em revisão. A fonte primária da OpenAI confirma a divulgação de resultados matemáticos, não consciência de máquina. |
| 14 | [https://frasesdoolavo.online/artigos/sierra-poker-sports-economia-poker-presencial.html](https://frasesdoolavo.online/artigos/sierra-poker-sports-economia-poker-presencial.html) | Artigo, pt-BR | Arquivo encontrado; 6 links externos, incluindo entrevista do Mundo Poker e site oficial do Sierra; declara que não confirmou fechamento definitivo. | Manter a ressalva; aumentar valor original com dados verificáveis de eventos, operação ou entrevista autorizada, sem inventar impacto econômico. |
| 15 | [https://frasesdoolavo.online/artigos/sierra-espetinho-polarizacao-poker-belo-horizonte.html](https://frasesdoolavo.online/artigos/sierra-espetinho-polarizacao-poker-belo-horizonte.html) | Artigo, pt-BR | Arquivo encontrado; 5 links externos e dois vídeos incorporados; trata “polarização” como memória de parte da comunidade, não como rivalidade oficial. | Corrigida nesta branch a autoria do JSON-LD para corresponder à assinatura visível. Acrescentar datas/contexto dos vídeos e evidência direta para as afirmações históricas quando disponível. |
| 16 | [https://frasesdoolavo.online/artigos/ledger-nano-x-implante-chupacabra-ataque-supply-chain.html](https://frasesdoolavo.online/artigos/ledger-nano-x-implante-chupacabra-ataque-supply-chain.html) | Artigo, pt-BR | Arquivo encontrado; 7 links externos, incluindo documentação da Ledger; o texto distingue o implante hipotético de perdas sob investigação. | Manter linguagem condicional; não apresentar implante físico como causa confirmada sem declaração ou evidência técnica independente. |
| 17 | [https://frasesdoolavo.online/artigos/vida-saudavel-creatina-carnosina-carnitina-metabolismo-muscular.html](https://frasesdoolavo.online/artigos/vida-saudavel-creatina-carnosina-carnitina-metabolismo-muscular.html) | Artigo, pt-BR | Arquivo encontrado; 5 links externos, incluindo NIH ODS, ISSN e NCCIH; distingue mecanismo biológico de eficácia de suplemento. | Manter; acrescentar fontes específicas para carnosina/carnitina e rotular a força da evidência por composto antes de fazer alegações de desempenho. |
| 18 | [https://frasesdoolavo.online/artigos/iodo-tireoide-beneficios-riscos-suplementacao.html](https://frasesdoolavo.online/artigos/iodo-tireoide-beneficios-riscos-suplementacao.html) | Artigo, pt-BR | Arquivo encontrado; bibliografia de 14 itens, mas nenhum link externo detectado no corpo original. | **Corrigido nesta branch:** adicionados links diretos a NIH ODS, American Thyroid Association e OMS, além de uma distinção explícita entre bibliografia histórica, evidência clínica independente e ausência de recomendação individual. |
| 19 | [https://frasesdoolavo.online/artigos/iodo-fisiologia-ortoiodossuplementacao-analise-tecnica.html](https://frasesdoolavo.online/artigos/iodo-fisiologia-ortoiodossuplementacao-analise-tecnica.html) | Artigo, pt-BR | Arquivo encontrado; 4 links externos únicos, incluindo OMS, ATA e PubMed; reconstrói alegações de uma aula e já indica que parte das referências precisa de rastreamento. | **Pendência prioritária:** incluir URL e identificação verificável da aula original; rastrear cada alegação clínica e adicionar revisões/diretrizes independentes. Resolver a discrepância entre autoria “Redação” no rodapé, autor no JSON-LD e cartão de Bruno Stefano sem adivinhar o responsável. |
| 20 | [https://frasesdoolavo.online/artigos/voto-repetido-carlos-bolsonaro-carol-de-toni-102-mil-nulos-sc.html](https://frasesdoolavo.online/artigos/voto-repetido-carlos-bolsonaro-carol-de-toni-102-mil-nulos-sc.html) | Artigo, pt-BR | Arquivo encontrado; 5 URLs externas únicas, com imprensa local, Agência Senado, TSE e dados abertos; a soma de 102.308 é atribuída a levantamento jornalístico. | Reproduzir o cálculo a partir do arquivo bruto do TSE e documentar método/filtro, se os dados permitirem; não inferir intenção política a partir de votos nulos. |
| 21 | [https://frasesdoolavo.online/artigos/misterio-carga-placas-video-oderco-aeroporto-guarulhos.html](https://frasesdoolavo.online/artigos/misterio-carga-placas-video-oderco-aeroporto-guarulhos.html) | Artigo, pt-BR | Arquivo encontrado; 3 URLs externas únicas, incluindo Aeroin, GMC Online e contato oficial do GRU; não atribui culpa e distingue relato da empresa de conclusão comprovada. | Adicionar link direto ao vídeo público original, se verificável e autorizado. O vídeo que o responsável informou possuir ainda não foi fornecido nesta auditoria; não foi analisado nem incorporado. |
| 22 | [https://frasesdoolavo.online/fr/](https://frasesdoolavo.online/fr/) | Início, fr | Arquivo encontrado; conteúdo traduzido, citações no idioma original. | Manter aviso de idioma; revisar traduções e links com revisor fluente antes de promover como produto editorial internacional. |
| 23 | [https://frasesdoolavo.online/de/](https://frasesdoolavo.online/de/) | Início, de | Arquivo encontrado; conteúdo traduzido, citações no idioma original. | Manter aviso; validar visualmente e testar gerador/pesquisa em navegador real. |
| 24 | [https://frasesdoolavo.online/it/](https://frasesdoolavo.online/it/) | Início, it | Arquivo encontrado; conteúdo traduzido, citações no idioma original. | Manter aviso; validar visualmente e testar gerador/pesquisa em navegador real. |
| 25 | [https://frasesdoolavo.online/fr/articles.html](https://frasesdoolavo.online/fr/articles.html) | Arquivo de artigos, fr | Arquivo encontrado; 12 cartões selecionados. | Deixar claro que é uma seleção de artigos e que os textos completos estão em português; conferir se todos os 12 links têm indicação de idioma. |
| 26 | [https://frasesdoolavo.online/de/artikel.html](https://frasesdoolavo.online/de/artikel.html) | Arquivo de artigos, de | Arquivo encontrado; 12 cartões selecionados; texto identifica artigos não traduzidos como originais em português. | Manter aviso; validar consistência dos 12 cartões e links de retorno. |
| 27 | [https://frasesdoolavo.online/it/articoli.html](https://frasesdoolavo.online/it/articoli.html) | Arquivo de artigos, it | Arquivo encontrado; 12 cartões selecionados; texto identifica artigos não traduzidos como originais em português. | Manter aviso; validar consistência dos 12 cartões e links de retorno. |
| 28 | [https://frasesdoolavo.online/sobre.html](https://frasesdoolavo.online/sobre.html) | Sobre, pt-BR | Arquivo encontrado; explica propósito, independência, critérios editoriais, atribuição de citações e correções. | Manter; revisar a formulação biográfica ambígua com o responsável antes de alterá-la. Não foram inventadas credenciais nem alterada a biografia nesta branch. |
| 29 | [https://frasesdoolavo.online/en/about.html](https://frasesdoolavo.online/en/about.html) | Sobre, en | Arquivo encontrado; versão traduzida com princípios editoriais. | Manter; revisão linguística humana recomendada. |
| 30 | [https://frasesdoolavo.online/es/sobre.html](https://frasesdoolavo.online/es/sobre.html) | Sobre, es | Arquivo encontrado; versão traduzida com princípios editoriais. | Manter; revisão linguística humana recomendada. |
| 31 | [https://frasesdoolavo.online/fr/about.html](https://frasesdoolavo.online/fr/about.html) | Sobre, fr | Arquivo encontrado; versão traduzida com princípios editoriais. | Manter; revisão linguística humana recomendada. |
| 32 | [https://frasesdoolavo.online/de/about.html](https://frasesdoolavo.online/de/about.html) | Sobre, de | Arquivo encontrado; versão traduzida com princípios editoriais. | Manter; revisão linguística humana recomendada. |
| 33 | [https://frasesdoolavo.online/it/about.html](https://frasesdoolavo.online/it/about.html) | Sobre, it | Arquivo encontrado; versão traduzida com princípios editoriais. | Manter; revisão linguística humana recomendada. |
| 34 | [https://frasesdoolavo.online/contato.html](https://frasesdoolavo.online/contato.html) | Contato, pt-BR | Arquivo encontrado; link abre issues públicas no GitHub e avisa que podem ser públicas; não promete resposta. | Manter aviso; testar o destino e garantir que o canal público não seja descrito como confidencial. |
| 35 | [https://frasesdoolavo.online/en/contact.html](https://frasesdoolavo.online/en/contact.html) | Contato, en | Arquivo encontrado; aviso de canal público traduzido. | Manter; validar links e revisão linguística. |
| 36 | [https://frasesdoolavo.online/es/contacto.html](https://frasesdoolavo.online/es/contacto.html) | Contato, es | Arquivo encontrado; aviso de canal público traduzido. | Manter; validar links e revisão linguística. |
| 37 | [https://frasesdoolavo.online/fr/contact.html](https://frasesdoolavo.online/fr/contact.html) | Contato, fr | Arquivo encontrado; aviso de canal público traduzido. | Manter; validar links e revisão linguística. |
| 38 | [https://frasesdoolavo.online/de/contact.html](https://frasesdoolavo.online/de/contact.html) | Contato, de | Arquivo encontrado; aviso de canal público traduzido. | Manter; validar links e revisão linguística. |
| 39 | [https://frasesdoolavo.online/it/contact.html](https://frasesdoolavo.online/it/contact.html) | Contato, it | Arquivo encontrado; aviso de canal público traduzido. | Manter; validar links e revisão linguística. |
| 40 | [https://frasesdoolavo.online/privacidade.html](https://frasesdoolavo.online/privacidade.html) | Privacidade, pt-BR | Arquivo encontrado; descreve hospedagem, cookies, serviços de terceiros, contato e LGPD sem alegar certificação legal. | **Corrigido nesta branch:** informa que o script do AdSense está presente em várias páginas e que isso não confirma veiculação. Confirmar consentimento e serviços realmente ativos no painel. |
| 41 | [https://frasesdoolavo.online/en/privacy.html](https://frasesdoolavo.online/en/privacy.html) | Privacidade, en | Arquivo encontrado; política traduzida. | **Corrigido nesta branch:** mesma precisão sobre o script; revisão linguística humana recomendada. |
| 42 | [https://frasesdoolavo.online/es/privacidad.html](https://frasesdoolavo.online/es/privacidad.html) | Privacidade, es | Arquivo encontrado; política traduzida. | **Corrigido nesta branch:** mesma precisão sobre o script; revisão linguística humana recomendada. |
| 43 | [https://frasesdoolavo.online/fr/privacy.html](https://frasesdoolavo.online/fr/privacy.html) | Privacidade, fr | Arquivo encontrado; política traduzida. | **Corrigido nesta branch:** mesma precisão sobre o script; revisão linguística humana recomendada. |
| 44 | [https://frasesdoolavo.online/de/privacy.html](https://frasesdoolavo.online/de/privacy.html) | Privacidade, de | Arquivo encontrado; política traduzida. | **Corrigido nesta branch:** mesma precisão sobre o script; revisão linguística humana recomendada. |
| 45 | [https://frasesdoolavo.online/it/privacy.html](https://frasesdoolavo.online/it/privacy.html) | Privacidade, it | Arquivo encontrado; política traduzida. | **Corrigido nesta branch:** mesma precisão sobre o script; revisão linguística humana recomendada. |
| 46 | [https://frasesdoolavo.online/economia.html](https://frasesdoolavo.online/economia.html) | Economia, pt-BR | Arquivo encontrado; seção destaca dois artigos e informa critérios editoriais. | Manter enquanto houver conteúdo real; não criar subpáginas vazias para temas sem cobertura. |
| 47 | [https://frasesdoolavo.online/en/economy.html](https://frasesdoolavo.online/en/economy.html) | Economia, en | Arquivo encontrado; página localizada com links para artigos em português. | Manter indicação do idioma dos artigos; validar links em produção. |
| 48 | [https://frasesdoolavo.online/es/economia.html](https://frasesdoolavo.online/es/economia.html) | Economia, es | Arquivo encontrado; página localizada com links para artigos em português. | Manter indicação do idioma dos artigos; validar links em produção. |
| 49 | [https://frasesdoolavo.online/fr/economy.html](https://frasesdoolavo.online/fr/economy.html) | Economia, fr | Arquivo encontrado; página localizada com links para artigos em português. | Manter indicação do idioma dos artigos; validar links em produção. |
| 50 | [https://frasesdoolavo.online/de/economy.html](https://frasesdoolavo.online/de/economy.html) | Economia, de | Arquivo encontrado; página localizada com links para artigos em português. | Manter indicação do idioma dos artigos; validar links em produção. |
| 51 | [https://frasesdoolavo.online/it/economy.html](https://frasesdoolavo.online/it/economy.html) | Economia, it | Arquivo encontrado; página localizada com links para artigos em português. | Manter indicação do idioma dos artigos; validar links em produção. |

## 3. Auditoria individual dos 15 artigos em português

### 3.1. A indicação de Dias Toffoli e o debate sobre o notável saber jurídico
- **Evidências positivas:** discute a controvérsia da indicação, lista fontes institucionais e jornalísticas e declara que não encontrou gravação ou transcrição primária verificável da fala atribuída a Olavo.
- **Problema verificável:** o título anterior sugeria que o diagnóstico “antecipou a crise do STF”, embora a fonte primária da fala atribuída não estivesse verificada. O corpo também contém afirmações históricas sobre trajetória e concursos que devem ser ligadas diretamente a documentos que as sustentem.
- **Correção nesta branch:** título, H1, descrição e cartões da página inicial/arquivo foram ajustados para descrever a controvérsia sem tratar a previsão atribuída como fato autenticado.
- **Pendência:** localizar gravação/transcrição primária e documentar as alegações biográficas mais específicas. Não remover a ressalva de ausência de fonte primária.

### 3.2. O que a Constituição exige para alguém ser ministro do STF?
- **Evidências positivas:** fontes oficiais do Planalto, STF e Senado; estrutura de perguntas e respostas; explica idade, nacionalidade, “notável saber jurídico”, reputação e aprovação pelo Senado.
- **Risco/checagem:** manter a versão vigente do texto constitucional e a alteração da idade máxima pela EC 122/2022. Não confundir o requisito constitucional escrito com critérios desejáveis de política pública.
- **Correção recomendada:** manter links diretos para o texto constitucional e para o procedimento do Senado; revisar a página sempre que houver alteração constitucional ou regimental.

### 3.3. O hack da Coldcard: como carteiras frias foram drenadas quase simultaneamente
- **Evidências positivas:** fontes de análise on-chain e pesquisa de segurança, incluindo Galaxy Research, TRM Labs, Bitquery e status oficial da Coldcard; nota editorial separa fatos, inferências e pontos não confirmados.
- **Risco/checagem:** os números de BTC, endereços e atribuição do ataque variam conforme data de corte e nível de confiança. A análise de blockchain não identifica automaticamente pessoas.
- **Correção recomendada:** manter data de atualização e atribuição por fonte para cada cifra; priorizar o comunicado oficial da fabricante para recomendações por modelo/firmware.

### 3.4. Como os bitcoins roubados da Coldcard estão sendo lavados — e o que ainda pode ser rastreado
- **Evidências positivas:** cronologia, fontes especializadas e explicação dos limites da análise on-chain; afirma que uma transferência isolada não prova identidade ou intenção.
- **Risco/checagem:** “lavagem” é uma conclusão jurídica/interpretativa que deve continuar atribuída aos pesquisadores ou ao padrão de movimentação, não a cada endereço individual.
- **Correção recomendada:** datar as observações, distinguir fundos atribuídos de fundos confirmados e não publicar inferências de identidade sem confirmação independente.

### 3.5. ZachXBT e os US$ 349,7 mil
- **Evidências positivas:** fontes do FBI e FinCEN para o contexto institucional, além de reportagens especializadas sobre a investigação do pesquisador.
- **Risco/checagem:** distinguir a atribuição oficial do ataque à Bybit de detalhes da operação de infiltração, quantias transacionadas e atribuições a intermediários, que dependem das publicações de ZachXBT e de veículos.
- **Correção recomendada:** atribuir explicitamente as conclusões ao pesquisador/fonte correspondente; incluir atualizações se houver esclarecimentos ou correções posteriores.

### 3.6. Neymar, Santos 2 x 2 Flamengo e a liderança
- **Evidências positivas:** links a cobertura esportiva; o artigo esclarece que a foto é de arquivo e não da partida descrita; separa gols de pênalti da narrativa de desempenho.
- **Risco/checagem:** placar, escalações, expulsão, tabela e impacto matemático na disputa do título são fatos que mudam rapidamente.
- **Correção recomendada:** conferir com súmula/relatório oficial e tabela da competição; manter data da apuração e corrigir o texto se a tabela evoluir.

### 3.7. 722 manuscritos e a pergunta sobre IA
- **Evidências positivas:** fonte primária da OpenAI e links a material de referência; o artigo explica que 722 manuscritos não significam 722 problemas independentes definitivamente resolvidos.
- **Risco/checagem:** a fonte da OpenAI confirma a divulgação de resultados matemáticos, formalizações em Lean para muitas demonstrações e detalhes da avaliação; não comprova consciência, singularidade ou equivalência a capacidade humana geral.
- **Correção recomendada:** manter a separação entre fato e reflexão especulativa; identificar claramente as passagens filosóficas como interpretação editorial.

### 3.8. Sierra Poker Sports e a economia do poker presencial
- **Evidências positivas:** entrevista do Mundo Poker, calendário/site oficial e fonte municipal; declara que não foi possível confirmar encerramento definitivo e que não há dados suficientes para estimar impacto econômico.
- **Risco/checagem:** várias conclusões sobre emprego, fornecedores, público e gastos são análise econômica geral, não medições do Sierra.
- **Correção recomendada:** não estimar impacto sem dados; valor diferencial maior viria de entrevista autorizada, dados públicos de eventos ou descrição verificável de custos e operação.

### 3.9. Sierra x Espetinho: a polarização do poker em Belo Horizonte
- **Evidências positivas:** trata “polarização” como lembrança de parte da comunidade e inclui dois vídeos incorporados e fontes locais.
- **Problemas verificáveis:** o schema JSON-LD indicava uma organização como autora, enquanto a página apresenta Bruno Stefano como autor; o schema não trazia data de publicação.
- **Correção nesta branch:** autoria estruturada ajustada para a pessoa indicada na página, título estruturado alinhado ao H1 e data publicada registrada como 9 de outubro de 2026.
- **Pendência:** registrar a data/contexto dos vídeos e usar relatos diretos identificáveis para sustentar afirmações históricas sobre a rivalidade.

### 3.10. O golpe do “chupacabra” e a Ledger Nano X
- **Evidências positivas:** o texto afirma que a Ledger investigava perdas, mas que não havia confirmado o implante físico como causa; inclui documentação técnica da Ledger sobre autenticidade.
- **Risco/checagem:** o apelido e a hipótese do implante partem de relato externo. Não confundir imagens alegadas de placas adulteradas com verificação forense independente.
- **Correção recomendada:** manter linguagem condicional, linkar a declaração oficial da Ledger quando disponível e atualizar apenas com confirmação verificável.

### 3.11. Creatina, carnosina, carnitina e metabolismo muscular
- **Evidências positivas:** referências a NIH ODS, posição da ISSN sobre creatina/beta-alanina e NCCIH; explicita que mecanismo bioquímico não prova benefício clínico de suplemento.
- **Risco/checagem:** o artigo cobre muitas moléculas e níveis de evidência diferentes; cinco links não sustentam necessariamente cada alegação específica sobre todos os compostos.
- **Correção recomendada:** acrescentar revisões sistemáticas/diretrizes específicas para carnosina, carnitina, CoQ10, taurina, citrulina e glutamina; diferenciar evidência forte, limitada e insuficiente. Não recomendar doses individualizadas.

### 3.12. Iodo na medicina: história, Lugol e a hipótese da suficiência em todo o organismo
- **Evidências positivas:** distingue argumentos do Projeto Iodo de validação independente; contém aviso de que as doses descritas não são prescrição e que a ingestão elevada pode causar efeitos adversos; lista referências históricas.
- **Problema verificável:** a versão inicial tinha bibliografia em texto simples, sem links externos detectados no corpo, impedindo o leitor de conferir as fontes com facilidade.
- **Correção nesta branch:** incluídos links diretos ao NIH Office of Dietary Supplements, à American Thyroid Association e à OMS, com explicação de que essas fontes contextualizam riscos/recomendações e não validam a tese de suficiência de iodo em todo o organismo.
- **Pendência:** conferir dados editoriais de cada referência histórica; a própria nota bibliográfica reconhece itens incompletos. Para alegações sobre câncer, mama e outros tecidos, citar estudos específicos e indicar qualidade/limitações da evidência.

### 3.13. Iodo além da tireoide: ortoiodossuplementação e argumentos de uma aula
- **Evidências positivas:** o texto identifica que está reconstruindo uma tese apresentada em aula, atribui as afirmações ao palestrante e inclui fontes independentes sobre gravidez, riscos de excesso e estudos específicos.
- **Riscos verificáveis:** o artigo discute alegações de altas doses, câncer, gestação, transporte de iodeto e “desintoxicação” por halogênios; essas alegações têm implicações de saúde e exigem rastreabilidade muito superior a um resumo de palestra. Há apenas quatro URLs externas únicas e não foi identificada a URL da aula original no código examinado. A autoria também está inconsistente: JSON-LD indica “Frases do Olavo — Redação”, o rodapé diz “Redação: Frases do Olavo” e há cartão biográfico de Bruno Stefano.
- **Correção recomendada:** identificar e linkar a aula original; mapear cada alegação a uma fonte primária; distinguir claramente hipótese do palestrante, resultados de estudos e consenso clínico; confirmar quem é o autor responsável antes de alterar autoria estruturada. Não transformar a reconstrução em recomendação clínica.

### 3.14. 102 mil votos nulos em Santa Catarina
- **Evidências positivas:** links para TSE, dados abertos, Agência Senado e imprensa regional; o artigo adverte que voto nulo não revela automaticamente intenção de protesto.
- **Risco/checagem:** o número de 102.308 aparece atribuído a levantamento jornalístico; é preciso confirmar o cálculo diretamente nos dados eleitorais, com critério replicável.
- **Correção recomendada:** documentar arquivo bruto, campos e regra de cálculo; manter separados dados oficiais, cálculo editorial e interpretação.

### 3.15. O desaparecimento de placas de vídeo no Aeroporto de Guarulhos
- **Evidências positivas:** fontes secundárias identificadas; valor é atribuído à empresa e descrito como preço de custo; o texto explicita que desaparecimento não prova roubo e não acusa um responsável.
- **Risco/checagem:** a narrativa depende de declarações da distribuidora e reportagens secundárias; não há, no artigo, link direto confirmado ao vídeo público original. O vídeo que o responsável informou possuir não estava disponível nesta auditoria.
- **Correção recomendada:** acrescentar o vídeo original ou documento primário apenas após confirmar URL, autoria e autorização; procurar resposta oficial de operadores logísticos/autoridades se disponível. Não inferir culpa.

## 4. Páginas institucionais, navegação e internacionalização

- **Sobre:** descreve o projeto, separa citações de artigos e apresenta critérios editoriais, independência e correções. A formulação biográfica “mecânico de motores diesel sem experiência” é semanticamente incomum; não foi alterada por não haver base documental para mudar uma informação biográfica fornecida pelo responsável. Recomenda-se confirmação editorial antes de qualquer reescrita.
- **Contato:** o único canal visível é o formulário de criação de issue no repositório público. A página avisa que o conteúdo pode ser público, que não é canal privado e que não há prazo garantido. Não apresentar isso como contato confidencial.
- **Privacidade:** as seis versões informam sobre hospedagem, dados técnicos, cookies, publicidade e links de terceiros. Nesta branch, a redação foi ajustada para informar que o script do AdSense está no código, sem alegar que anúncios estejam sendo veiculados. O código não permite confirmar sozinho consentimento, cookies efetivamente gravados em cada região ou configurações da conta; isso requer inspeção do navegador e do painel.
- **Economia:** há dois artigos reais em destaque e a página informa o idioma original. Não é necessário criar páginas de categoria vazias.
- **Cabeçalho/rodapé:** as páginas compartilham marca e navegação, mas ainda existem variações no conjunto de links do rodapé e na navegação de temas. A página inicial e o arquivo não têm exatamente o mesmo menu (o arquivo aponta “Temas” para o filtro local). Isso pode ser funcional, mas precisa de teste visual/responsivo para confirmar que não há quebra ou duplicação.
- **Idiomas:** as páginas institucionais são versões traduzidas; artigos completos continuam em português. O sitemap tem 51 URLs únicas e alternates para home, arquivos e páginas institucionais. Não se deve adicionar hreflang a artigos sem versões equivalentes reais. As versões localizadas devem continuar rotulando o idioma dos artigos.
- **Autoria estruturada:** há inconsistência entre artigos: alguns não têm JSON-LD de artigo; outros têm autor/data, outros não; o artigo Sierra/Espetinho tinha autor estruturado divergente da assinatura visível (corrigido nesta branch); o artigo técnico de iodo ainda precisa de decisão editorial sobre a autoria correta.
- **Citações:** `olavo.json` não contém metadados de fonte por citação. O texto de aviso na página inicial e a página Sobre reconhecem que a atribuição pode precisar de confirmação. Recomendação: criar um inventário editorial separado com texto, obra/entrevista, URL da fonte, trecho/contexto, data de conferência e estado de verificação. Não remover em massa as frases sem apuração individual.

## 5. SEO, arquivos e infraestrutura

- **Canonical/sitemap:** o sitemap tem 51 URLs únicas e os caminhos correspondem a arquivos encontrados na branch `master`. A inspeção de código encontrou canonicals coerentes nas páginas amostradas, mas não foi possível fazer um teste HTTP de todas as URLs em produção.
- **Hreflang:** as páginas iniciais, arquivos e páginas institucionais têm grupos de idiomas. O sitemap lista as variantes para cada grupo; não foram adicionadas variantes aos 15 artigos, que não têm traduções integrais publicadas.
- **Robots:** `robots.txt` contém `Allow: /` e a declaração do sitemap. Nenhuma alteração foi necessária.
- **Modelo:** `artigos/modelo-artigo.html` mantém `noindex, follow` e não aparece no sitemap. Não incluir esse modelo no índice.
- **AdSense:** `ads.txt` contém o publisher ID informado e o script aparece no HTML. O estado de autorização do `ads.txt` informado pelo responsável não prova aprovação de conteúdo. Os três recursos publicitários externos bloqueados pelo robots.txt de domínios do Google não foram tratados como causa da reprovação.
- **Hospedagem:** `vercel.json` e texto de README ainda são vestígios da arquitetura anterior. O README foi corrigido nesta branch para refletir GitHub + Cloudflare Pages, esclarecer que `vercel.json` é específico da Vercel e alertar que roteamento e serviços externos precisam de validação no provedor ativo. Não foram alterados DNS, domínio, configuração do Cloudflare, Search Console ou AdSense.
- **Erro `Server: Vercel`:** não foi possível confirmar a resposta pública nesta sessão. A existência de `vercel.json` e de integrações antigas é uma explicação plausível para a divergência de configuração, mas não prova que o DNS/produção esteja servindo pela Vercel. É necessário consultar o painel Cloudflare e testar cabeçalhos/respostas de forma independente.

## 6. Alterações nesta branch

1. **README.md:** corrigida a documentação obsoleta sobre hospedagem e estado do AdSense; removidas sequências literais de quebra de linha; documentados idiomas, estrutura, modelo `noindex` e vestígios de configuração Vercel sem alterar a infraestrutura.
2. **Seis políticas de privacidade:** redação atualizada para declarar que o script AdSense está presente em várias páginas e que sua presença não comprova veiculação de anúncios.
3. **Artigo de iodo histórico:** incluídas fontes clínicas independentes com links diretos (NIH ODS, American Thyroid Association e OMS) e reforçada a distinção entre teses históricas e recomendações clínicas.
4. **Artigo Sierra/Espetinho:** alinhados autor, título e data do JSON-LD à assinatura visível.
5. **Artigo sobre Toffoli, página inicial e arquivo de artigos:** título e descrições ajustados para não sugerir como fato comprovado uma previsão atribuída sem fonte primária verificada.

Nenhuma URL pública foi alterada. Nenhum artigo foi apagado. Nenhuma configuração de produção foi alterada. A biografia não foi reescrita nesta branch.

## 7. Testes executados e limitações

### Executado

- Leitura dos arquivos do sitemap e contagem de 51 URLs únicas.
- Inspeção dos 15 arquivos de artigo, incluindo títulos, H1, metadados, fontes externas presentes, ressalvas editoriais e algumas marcações estruturadas.
- Inspeção das páginas de arquivo, institucionais e localizadas e dos caminhos declarados no sitemap.
- Verificação estática do código dos filtros de artigos: aliases `politica`/`saude` são mapeados para categorias acentuadas; a contagem e o estado vazio são atualizados; o botão de limpar busca remove o parâmetro.
- Consulta do `robots.txt`, `ads.txt`, `sitemap.xml`, `README.md`, `vercel.json`, `dev.html` e modelo de artigo no repositório.
- Comparação de branches e pull requests para evitar reutilizar branches antigas.
- Pesquisa de fontes oficiais do Google, NIH ODS, American Thyroid Association, OMS e OpenAI.
- Alterações realizadas somente na branch de auditoria.

### Não executado / não verificável nesta sessão

- O site publicado não resolveu DNS no ambiente de teste; tentativas de navegador e `curl` falharam. Não foram confirmados status HTTP, cabeçalhos, redirects, TLS, conteúdo publicado, resposta do `ads.txt` ou implantação Cloudflare.
- Não houve teste visual em navegador real, desktop/celular, teclado, contraste automatizado ou console JavaScript.
- Não foi executado validador HTML nem teste automático de todos os destinos de links externos.
- Não há `package.json` ou comando de build na raiz; portanto, não há build npm a executar. Não foi executado Lighthouse nem teste de performance.
- Não foi possível verificar cookies reais, CMP/consentimento por região, configuração privada do AdSense ou status atual no painel.
- Não foram localizados e verificados os documentos primários que sustentariam todas as alegações específicas dos artigos. Os links externos foram inspecionados no código; isso não significa que cada URL externa foi aberta e confirmada nesta sessão.

## 8. Próximas ações prioritárias

1. **Antes de pedir nova revisão:** confirmar que a versão de produção servida é a versão pretendida no Cloudflare; testar HTTP/HTTPS, www/não-www, cabeçalhos e `ads.txt` sem alterar DNS durante a auditoria.
2. **Saúde:** localizar a fonte original da aula sobre ortoiodossuplementação; revisar cada alegação de dose, gravidez, câncer e tecidos extratireoidianos com fontes primárias e diretrizes; solicitar revisão de profissional qualificado se o artigo continuar publicado como conteúdo de saúde.
3. **Citações:** auditar as 358 entradas, identificar fonte individual quando possível e marcar explicitamente as não verificadas; não apresentar atribuição como autenticada sem fonte.
4. **Reportagem:** incluir documentos, vídeos públicos, dados brutos ou entrevistas autorizadas quando forem a base de uma matéria. Prioridade: vídeo/documentação original da carga de placas de vídeo e dados brutos do TSE para a contagem de votos nulos.
5. **Autoria:** resolver a discrepância entre redação e autor individual no artigo técnico sobre iodo; padronizar JSON-LD dos artigos somente após confirmar a autoria real.
6. **Privacidade/consentimento:** verificar no painel do AdSense as configurações de consentimento e requisitos aplicáveis aos países visitantes; revisar a política com assessoria jurídica se necessário.
7. **Regressão visual:** testar todas as 51 URLs em preview com navegador, desktop e celular; validar menu, foco, filtros, links, imagens, console e páginas 404.
8. **AdSense:** solicitar nova análise apenas depois de publicar a versão revisada, confirmar que páginas e recursos são acessíveis, concluir a revisão de saúde/autoria/fontes e validar a experiência de navegação. A aprovação não pode ser garantida e deve ser confirmada no painel do AdSense.

## 9. Fontes de referência

- Google AdSense — [Sua conta não foi aprovada / problemas de qualidade do conteúdo](https://support.google.com/adsense/answer/81904?hl=pt-BR)
- Google AdSense — [Requisitos de qualificação](https://support.google.com/adsense/answer/9724?hl=pt-BR)
- Google Search Central — [Criar conteúdo útil, confiável e que prioriza as pessoas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=pt-BR)
- Google Search Central — [Políticas de spam da Pesquisa Google](https://developers.google.com/search/docs/essentials/spam-policies?hl=pt-BR)
- Google Search Central — [Versões localizadas e hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=pt-BR)
- NIH Office of Dietary Supplements — [Iodine: Fact Sheet for Health Professionals](https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/)
- American Thyroid Association — [Risks of Excess Iodine Ingestion and Exposure](https://www.thyroid.org/ata-statement-on-the-potential-risks-of-excess-iodine-ingestion-and-exposure/)
- Organização Mundial da Saúde — [Iodine supplementation in pregnant and lactating women](https://www.who.int/tools/elena/interventions/iodine-pregnancy)
- OpenAI — [Sharing AI progress in mathematics](https://openai.com/index/sharing-ai-progress-in-mathematics/)
