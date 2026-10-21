# PRD — Jogo casual de adivinhação de palavras

**Status:** requisitos consolidados; MVP implementado com referência no protótipo acessível  
**Data:** 2026-10-21  
**Plataforma:** web responsiva, mobile-first  
**Público:** crianças e jovens de 8 a 18 anos  
**Monetização:** nenhuma no MVP

## 1. Resumo

Criar um jogo casual diário, em português brasileiro, no qual a pessoa descobre uma palavra de cinco letras em até seis tentativas. A palavra é associada a um tema familiar de “memes absurdos”; as tentativas recebem pistas por letra e posição. O jogo deve ensinar as regras rapidamente, funcionar bem em celulares e permitir que a pessoa acompanhe sua sequência e compartilhe um resultado sem revelar a solução.

O MVP não exige cadastro, não coleta telemetria e não monetiza. O progresso e as estatísticas ficam no armazenamento local do navegador.

## 2. Problema e oportunidade

Jogos diários de palavras combinam uma sessão curta, uma regra fácil de explicar e um desafio compartilhável. Ainda assim, uma pessoa nova pode desistir se não entender as pistas, encontrar palavras obscuras ou não conseguir operar o jogo no celular ou com tecnologia assistiva.

O produto busca oferecer um ritual diário leve e apropriado à faixa etária, com tema reconhecível, feedback imediato e progresso pessoal sem cadastro. Referências públicas de jogos semelhantes sugerem que a escassez de um desafio diário ajuda a criar uma rotina, enquanto grades de compartilhamento sem spoilers facilitam conversa entre jogadores. O tema e o vocabulário próprios devem distinguir a experiência sem reproduzir marca, conteúdo ou interface proprietária de outros jogos.

## 3. Objetivos e não objetivos

### Objetivos do MVP

- Permitir iniciar e entender uma partida em poucos segundos.
- Oferecer um desafio diário comum, com uma palavra temática de cinco letras e seis tentativas.
- Tornar as pistas compreensíveis sem depender somente da cor.
- Incentivar retorno diário por meio de sequência e estatísticas locais.
- Permitir compartilhar/copiar um resultado sem a resposta.
- Atender a telas pequenas, teclado físico, toque e requisitos básicos de acessibilidade.
- Evitar conta, coleta remota de dados e monetização.

### Fora do escopo

- Multiplayer, ranking global, chat, contas ou sincronização entre dispositivos.
- Anúncios, compras, assinatura ou recompensas que pressionem o uso.
- Geração de conteúdo por usuário ou coleta de dados pessoais.
- Arquivo de partidas anteriores, modo ilimitado, níveis de dificuldade ou múltiplos idiomas no MVP.
- Sons ou animações necessários para compreender o jogo.

## 4. Público e necessidades

Pessoas de 8 a 18 anos que usam principalmente celular ou tablet e gostam de desafios curtos e temas de cultura de internet. A experiência também deve ser utilizável por adultos, por pessoas com deficiência e por quem não conhece jogos desse tipo.

Necessidades principais:

- Começar sem cadastro nem tutorial longo.
- Entender o tema, o comprimento da resposta, as tentativas restantes e o significado de cada pista.
- Receber mensagens claras para palavra inválida e partida encerrada.
- Conseguir jogar por teclado físico ou teclado na tela.
- Consultar progresso sem criar conta e escolher compartilhar sem revelar a solução.
- Encontrar vocabulário e conteúdo adequados para a faixa etária.

## 5. Proposta de valor

Um desafio diário de palavras rápido, acolhedor e inspirado em memes absurdos familiares, com pistas claras, progresso privado no próprio dispositivo e compartilhamento sem spoilers.

## 6. Mecânica e regras

1. Há um desafio por dia, o mesmo para todos os jogadores na data de referência definida para o MVP: data civil de `America/Sao_Paulo`.
2. A resposta tem cinco letras e pertence à lista curada de palavras do jogo. O tema diário dá contexto, sem revelar a resposta.
3. O jogador pode enviar até seis tentativas de cinco letras, aceitas somente se forem entradas válidas da lista de palpites.
4. Depois de cada tentativa, cada letra recebe um estado:
   - **Correta:** letra presente na posição correta.
   - **Presente:** letra presente na resposta em outra posição.
   - **Ausente:** letra não usada na resposta.
5. As pistas devem tratar corretamente letras repetidas, respeitando a quantidade de ocorrências na resposta; uma letra repetida na tentativa não pode receber pistas de presença além do total correspondente na resposta.
6. Palavras são comparadas sem distinção entre maiúsculas e minúsculas. Acentos do português são normalizados para validação e comparação; caracteres acentuados contam como uma letra. A apresentação pode preservar acentos naturais.
7. A resposta só é revelada após vitória ou após a sexta tentativa sem acerto.
8. A partida diária fica concluída quando a pessoa acerta ou esgota as tentativas. Recarregar a página não pode apagar uma partida em andamento ou concluída, enquanto o armazenamento local permanecer disponível.
9. O MVP oferece apenas o desafio do dia; não existe botão para reiniciar nem para jogar novamente no mesmo dia.
10. Não se exige que uma tentativa use pistas anteriores (sem modo difícil).

## 7. Escopo funcional do MVP

### 7.1 Início e regras

- Identificação do desafio diário e tema do dia.
- Acesso à partida, às regras concisas e às estatísticas.
- Explicação de como as pistas funcionam, com texto além de cor.
- Exibição de progresso da sequência, se existir.

### 7.2 Partida

- Grade de seis tentativas por cinco letras.
- Entrada por teclado físico e teclado virtual visível em dispositivos móveis.
- Ações acessíveis de apagar e enviar.
- Atualização das teclas com o melhor estado conhecido da letra, sem substituir uma pista correta por uma inferior.
- Retorno imediato para tentativa inválida, letra faltante, acerto e fim da partida.
- Anúncio textual das pistas por tentativa para leitores de tela, sem tornar a grade inacessível ou redundante.
- Foco visível e gerenciamento de foco que não desoriente a pessoa após enviar uma tentativa.

### 7.3 Fim da partida

- Indicação de vitória ou fim de tentativas.
- Revelação da resposta ao terminar.
- Número de tentativas usadas.
- Acesso às estatísticas e ao compartilhamento.
- Indicação do próximo desafio/tempo até ele, se possível sem exigir relógio preciso.

### 7.4 Estatísticas e sequência

- Partidas concluídas, vitórias, percentual de vitórias, sequência atual e melhor sequência.
- Registro da data e resultado necessários para calcular esses indicadores.
- Armazenamento local, sem envio a servidor.
- Regras de sequência: uma vitória em dias consecutivos aumenta a sequência; um dia sem vitória a interrompe; a partida de hoje não altera a sequência até ser concluída. Partidas perdidas contam como concluídas, mas não como vitória.
- Interface sem estatísticas deve permanecer funcional se o armazenamento local estiver indisponível; informar que o progresso não poderá ser salvo, sem simular persistência.

### 7.5 Compartilhamento

- Botão para copiar ou compartilhar pelo mecanismo nativo disponível.
- Texto e grade resumida com número de tentativas ou resultado de derrota.
- Não incluir resposta, palpites em texto nem informações pessoais.
- Mensagem clara de sucesso ou falha ao copiar/compartilhar, com alternativa selecionável/copiável quando necessário.

## 8. Requisitos de conteúdo

- Português brasileiro.
- Tema editorial do MVP: “memes absurdos”, com referências e expressões reconhecíveis, familiares e apropriadas para 8–18 anos.
- Evitar palavrões, conteúdo sexual, violência, incentivo a comportamento nocivo, assédio e material discriminatório.
- Lista de soluções selecionada e revisada manualmente; não depender de uma API ou serviço de terceiros.
- A lista de palpites pode ser mais ampla que a de soluções, mas deve ser local e determinística.
- O tema fornece contexto, não deve tornar a resposta óbvia nem depender de conhecimento de uma comunidade muito específica.
- Palavras e explicações devem ser legíveis e concisas; erros devem sugerir como corrigi-los.

## 9. Requisitos não funcionais e acessibilidade

- Layout responsivo a partir de telas estreitas e usável em orientação retrato.
- Funcionar em navegadores modernos sem conta ou conexão permanente após carregar os arquivos do jogo.
- Carregamento inicial inferior a 2 segundos em uma conexão estável de banda larga, como meta a medir no build final.
- Todas as funções operáveis por teclado; ordem de foco lógica e foco sempre perceptível.
- Nomes acessíveis para controles e status; mensagens de estado anunciadas por tecnologia assistiva sem excesso de anúncios repetidos.
- Pistas comunicadas por texto ou símbolos além de cor; preferências de movimento reduzido respeitadas.
- Teclas do teclado virtual que receberam pistas exibem também marcadores não cromáticos, além de seus nomes acessíveis.
- Contraste de texto conforme WCAG 2.2 AA: pelo menos 4,5:1 para texto comum e 3:1 para texto grande. Não comunicar estado só por cor.
- Alvos de interação de pelo menos 24 × 24 CSS px ou espaçamento equivalente segundo WCAG 2.2 SC 2.5.8; preferir alvos maiores para controles primários em toque.
- Não usar animação, som ou limite de tempo como requisito de jogo.
- Armazenamento minimizado no dispositivo; sem identificador remoto ou telemetria no MVP.
- Persistência limitada pelo navegador: limpar dados do site ou trocar de dispositivo pode apagar o progresso, e isso deve ser entendido como limitação do produto.

## 10. Modelo de dados local

Guardar apenas o estado necessário para retomar a partida do dia e calcular estatísticas, por exemplo:

- versão do formato de armazenamento;
- data do desafio e tentativas submetidas com seus resultados;
- estado terminal e resultado da partida;
- datas/resultados recentes suficientes para calcular sequência atual e melhor sequência, além dos totais.

Não guardar nome, e-mail, idade, identificadores de dispositivo, localização ou dados de terceiros. Se a estrutura local for inválida ou de versão incompatível, exibir uma mensagem apropriada e permitir iniciar o desafio do dia sem afirmar que o histórico foi recuperado.

## 11. Histórias de usuário

- Como novo jogador, quero ler regras curtas e ver um exemplo para começar sem pedir ajuda.
- Como jogador, quero receber pistas claras por letra para escolher uma tentativa seguinte.
- Como jogador jovem, quero encontrar palavras temáticas divertidas e apropriadas para minha idade.
- Como jogador recorrente, quero ver minha sequência e minhas estatísticas no mesmo navegador.
- Como jogador, quero continuar minha partida após recarregar a página.
- Como jogador, quero compartilhar meu resultado sem entregar a resposta.
- Como pessoa que navega com teclado ou leitor de tela, quero jogar e compreender cada pista sem depender de mouse ou cor.

## 12. Critérios de aceitação

1. Em uma tela de 320 CSS px de largura, grade, entrada e ações não exigem rolagem horizontal.
2. Uma pessoa que lê as instruções de até duas frases consegue explicar que há cinco letras, seis tentativas e que pistas indicam posição ou presença.
3. Uma tentativa aceita produz cinco pistas de acordo com as regras, inclusive quando a resposta e a tentativa contêm letras repetidas.
4. A mesma data de desafio em `America/Sao_Paulo` seleciona a mesma palavra e tema para todas as instâncias da mesma versão do conjunto de palavras.
5. Palavras inválidas ou de tamanho incorreto não consomem tentativa; há mensagem de erro compreensível.
6. A resposta não aparece antes de vitória ou derrota; depois de concluir, a resposta e o total de tentativas aparecem.
7. A partida é retomada após recarregar, quando o armazenamento local está disponível.
8. Estatísticas e sequência correspondem a partidas diárias realmente concluídas segundo as regras do produto.
9. O resultado copiado/compartilhado não contém a resposta nem os palpites textuais.
10. Todas as ações da partida são possíveis apenas com teclado; foco visível e feedback de validação estão presentes.
11. Cada estado de pista, inclusive nas teclas do teclado virtual, tem uma indicação não cromática perceptível e é comunicado de forma apropriada a leitores de tela.
12. Texto comum, texto grande e alvos interativos cumprem os limiares WCAG declarados neste documento.
13. O conteúdo de solução e tema passa por curadoria familiar antes de ser incluído no conjunto de palavras.
14. Sem suporte a armazenamento local, o jogo continua utilizável na sessão e informa que o progresso não será salvo.

## 13. Métricas

Como não haverá telemetria no MVP, as métricas são objetivos para avaliação posterior consentida ou testes manuais, não eventos coletados silenciosamente:

- taxa de conclusão e taxa de vitória;
- distribuição de tentativas usadas;
- tempo até a primeira tentativa e duração de sessão;
- retorno ao desafio em dias seguintes e sequência média;
- taxa de tentativas inválidas;
- sucesso de conclusão com teclado e leitor de tela em avaliação assistida;
- entendimento das regras em teste de usabilidade;
- falhas de persistência ou compartilhamento observadas durante QA.

## 14. Riscos e mitigação

- **Vocabulário difícil ou datado:** curadoria e revisão periódica das soluções e temas.
- **Referências de meme envelhecem rapidamente:** evitar dependência de notícia do dia ou de conhecimento extremamente nichado.
- **Pistas injustas com letras repetidas:** casos unitários dedicados à regra de duplicatas.
- **Desalinhamento entre data e fuso:** fixar e testar explicitamente `America/Sao_Paulo`.
- **Perda de sequência por dados locais apagados:** comunicar que estatísticas são locais e não sincronizadas.
- **Revelação da solução por inspeção do app cliente:** como o MVP é estático e sem servidor, um jogador tecnicamente experiente pode inspecionar os arquivos locais. Não prometer segredo criptográfico; evitar expor a solução na interface antes de concluir.
- **Conteúdo destinado a menores:** manter processamento local, não coletar dados pessoais e revisar qualquer futura mudança de produto/serviços à luz das obrigações legais aplicáveis.

## 15. Decisões confirmadas e hipóteses

Confirmado pelo solicitante e pelo rascunho fornecido:

- jogo diário de palavras, web responsiva e mobile-first;
- público de 8 a 18 anos;
- português brasileiro, palavra de cinco letras, seis tentativas;
- tema de memes absurdos, com curadoria familiar;
- lista curada no aplicativo;
- estatísticas, sequência, resultado compartilhável sem spoiler;
- sem monetização, contas, sincronização ou telemetria no MVP;
- progresso local.

Hipóteses adotadas para permitir prototipagem e desenvolvimento:

- desafio diário usa a data civil de `America/Sao_Paulo`;
- nenhum modo ilimitado ou arquivo de desafios;
- acentos são ignorados na validação e na comparação;
- letras repetidas em uma tentativa são permitidas; a mesma palavra não pode ser enviada mais de uma vez;
- persistência local usa armazenamento do navegador; apagar os dados do site apaga o progresso;
- a solução será entregue dentro da aplicação cliente, com a limitação de que conteúdo estático pode ser inspecionado;
- direção visual de referência: protótipo acessível, recomendação usada porque a escolha enviada não continha uma opção.

## 16. Referências de pesquisa

- [Termo](https://term.ooo/) — descrição das regras publicadas: seis tentativas, tamanho fixo, pistas por posição, acentos ignorados e letras repetidas.
- [Wordle — The New York Times](https://www.nytimes.com/games/wordle/index.html) — referência de formato diário. A página automatizada consultada não expôs seu conteúdo de regras; não foi usada como fonte exclusiva de mecânica.
- [Quordle — Merriam-Webster](https://www.merriam-webster.com/games/quordle/) — exemplo de variante que aumenta a carga ao pedir quatro respostas em nove tentativas; essa complexidade não será adotada no MVP.
- [Contexto](https://contexto.me/) — referência de variante de adivinhação por proximidade semântica; mecanismo fora do escopo.
- [Nielsen Norman Group — 10 heurísticas de usabilidade](https://www.nngroup.com/articles/ten-usability-heuristics/) — visibilidade de estado, correspondência com a linguagem da pessoa, prevenção/recuperação de erros e reconhecimento.
- [WCAG 2.2 — teclado (2.1.1)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) — funcionalidade disponível por teclado.
- [WCAG 2.2 — contraste mínimo (1.4.3)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — razões mínimas de contraste textual.
- [WCAG 2.2 — tamanho mínimo do alvo (2.5.8)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — dimensão e espaçamento de alvos.
- [Game Accessibility Guidelines — considerações básicas](https://gameaccessibilityguidelines.com/basic/) — recomendações gerais, incluindo daltonismo e legibilidade.

## 17. Direção visual

O [protótipo de acessibilidade](../../prototypes/02-accessibility.html) orienta a implementação do MVP: alto contraste, pistas com símbolos e texto além da cor, alvos amplos e estrutura semântica. A clareza e hierarquia do [protótipo UX](../../prototypes/01-ux.html) também são aproveitadas. O [protótipo visual](../../prototypes/03-visual.html) permanece como alternativa de direção, não implementada.
