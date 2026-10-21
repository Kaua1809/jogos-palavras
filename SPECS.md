# Especificação técnica — Palavrada

**Base de produto:** [PRD](./docs/plans/2026-10-21-jogo-casual-adivinhacao-palavras.md)  
**Design de referência:** [protótipo de acessibilidade](./prototypes/02-accessibility.html)  
**Status:** MVP

## 1. Decisão de design e escopo

O pedido de seleção do mockup foi aceito sem uma opção preenchida. Para não interromper o trabalho, esta especificação usa a direção recomendada: acessibilidade primeiro, com a hierarquia simples do conceito UX. O protótipo visual continua sendo uma alternativa, não a interface escolhida.

O produto é uma aplicação estática, sem framework ou dependências de runtime. A primeira entrega implementa desafio diário para palavras de cinco letras, seis tentativas, tema “Memes absurdos”, pistas claras por texto/símbolo/cor, estatísticas, sequência e compartilhamento sem spoilers.

O nome “Palavrada” é provisório e pode ser trocado sem afetar o modelo de jogo.

## 2. Arquitetura

### 2.1 Componentes

- `index.html`: estrutura semântica, regiões de interface, diálogos e carregamento dos arquivos estáticos.
- `src/styles.css`: tema visual, grade, teclado, diálogos, estados de foco, responsividade e movimento reduzido.
- `src/game.js`: funções puras e dados curados: normalização, palavras, escolha determinística do desafio, avaliação de pistas, validação de tentativas, estatísticas e texto de compartilhamento. Exporta a API em `window.WordGame` no navegador e `module.exports` no Node para permitir testes sem ferramenta adicional.
- `src/app.js`: estado da interface, interação por teclado/toque, renderização, persistência local, notificações acessíveis, diálogos e integração com Clipboard/Web Share APIs.
- `tests/game.test.cjs`: testes automatizados das regras centrais com `node:test`.

Não há build step, dependências externas, fonte remota, API ou backend. Os arquivos podem ser servidos como conteúdo estático ou abertos diretamente como `index.html`; os scripts são clássicos, sem módulos ES que dependam de servidor para funcionar em `file:`.

### 2.2 Fluxo de inicialização

1. Carregar os estilos e a API de `src/game.js`.
2. Construir a data civil de hoje no fuso fixo `America/Sao_Paulo`.
3. Selecionar a palavra e o tema pelo índice determinístico da lista de respostas e da data.
4. Ler e validar o estado local; usar uma partida vazia em memória somente quando o estado não puder ser recuperado, informando a pessoa.
5. Desenhar grade, teclado, estado do dia e estatísticas.
6. Ao inserir ou apagar uma letra, atualizar a linha atual.
7. Ao enviar, validar comprimento, repetição e vocabulário antes de consumir uma tentativa; avaliar a resposta somente para uma tentativa válida.
8. Persistir imediatamente o novo estado e anunciar o resultado.
9. Ao ganhar ou perder, registrar o resumo do dia, mostrar a resposta e habilitar o compartilhamento.

## 3. Regras de domínio

### 3.1 Vocabulário e normalização

- Soluções e palpites válidos vêm de listas locais curadas.
- O conjunto inicial de respostas foi revisado para usar vocabulário neutro e familiar, sem conteúdo sexual, violento, discriminatório ou palavrões. Qualquer expansão exige nova revisão editorial antes de ser publicada.
- Cada entrada é uma palavra de exatamente cinco letras após normalização.
- Comparação: remover diacríticos Unicode, converter para maiúsculas (`pt-BR`) e comparar as letras resultantes. Assim, `DANÇA`, `DANCA`, `VÍDEO` e `VIDEO` podem ser comparados sem diferença de acentuação.
- O tabuleiro guarda letras normalizadas; a resposta final conserva a grafia editorial/acentuação definida na lista.
- Entradas são compostas somente de letras; espaços ou pontuação não são aceitos.
- Uma tentativa inválida ou repetida não consome jogada. A mesma palavra não pode ser enviada duas vezes; letras repetidas dentro de uma tentativa são permitidas.

### 3.2 Feedback, inclusive letras duplicadas

`scoreGuess(answer, guess)` opera em duas passagens:

1. Marcar como `correct` cada letra na posição exata e contar as ocorrências restantes da resposta.
2. Percorrer as outras letras da tentativa; marcar `present` somente enquanto houver ocorrência restante, consumindo uma por letra. Marcar as demais como `absent`.

Esse procedimento impede que letras repetidas na tentativa recebam mais pistas positivas do que a resposta permite. Estados possíveis são `correct`, `present` e `absent`; a chave do teclado conserva o estado de maior prioridade (`correct > present > absent`).

### 3.3 Desafio diário

- Formato de data: `YYYY-MM-DD`, calculado de forma explícita no fuso IANA `America/Sao_Paulo`.
- A data é revalidada ao voltar para a aba e periodicamente enquanto ela permanece aberta; ao mudar o dia, a tela carrega o novo desafio e inicia uma nova partida sem reutilizar tentativas antigas.
- Um epoch fixo no código e um ordinal de dia UTC (derivado da data civil, não do horário instantâneo) determinam o índice na lista de respostas. O mesmo conjunto versionado sempre gera a mesma resposta para a mesma data.
- A resposta é comum a todas as instalações com a mesma versão do conjunto e fuso definido.
- Não há seleção aleatória em cada visita, consulta remota ou modo de prática no MVP.
- Como o código e a lista são entregues ao navegador, uma pessoa tecnicamente experiente pode inspecionar as respostas futuras. Não se promete segredo criptográfico.

## 4. Estado e persistência

### 4.1 Chave e formato

Usar `localStorage` sob a chave versionada `palavrada:v1`. A estrutura contém apenas:

```text
{
  version: 1,
  completed: {
    "YYYY-MM-DD": { status: "won" | "lost", attempts: 1..6 }
  },
  current: {
    date: "YYYY-MM-DD",
    guesses: ["PALAVRA", ...]
  }
}
```

O campo `current` guarda apenas a partida do dia corrente e permite retomá-la depois de recarregar. `completed` guarda resumos mínimos de partidas concluídas para estatísticas e sequências. Não armazenar identidade, idade, e-mail, localização, analytics ou resposta secreta.

### 4.2 Validação e falhas

- Validar versão, formato da data, estado terminal, limite de tentativas e forma das palavras antes de usar os dados.
- JSON ilegível, esquema incompatível ou erro de acesso ao armazenamento deve produzir uma mensagem acessível e explícita. A sessão pode continuar em memória, mas o produto não deve anunciar que salvou e deve informar que o progresso não será persistido após fechar ou recarregar.
- Se uma gravação falhar, preservar a sessão atual em memória, mostrar que o progresso não persistirá após fechar/recarregar e não ocultar a falha.
- Não apagar silenciosamente dados inválidos. A pessoa é informada quando o histórico não pode ser recuperado.
- Apagar os dados do site remove o progresso; não existe sincronização entre navegadores ou dispositivos.

### 4.3 Estatísticas

- `partidas`: número de registros em `completed`.
- `vitórias`: quantidade de registros com `status = "won"`.
- `percentual`: `round(vitórias / partidas * 100)`; zero quando ainda não há partidas.
- `sequência atual`: contar vitórias consecutivas em dias civis terminando hoje, se a partida de hoje foi vencida; caso contrário, começar ontem se hoje ainda não foi concluído. Uma derrota hoje zera a sequência.
- `melhor sequência`: maior série de datas consecutivas com status de vitória.
- `distribuição`: opcional no primeiro lançamento; se apresentada, contar tentativas de vitórias registradas, sem inferir partidas não concluídas.

Uma partida em andamento não incrementa contagem nem sequência. Uma derrota é uma partida concluída e interrompe a série.

## 5. Interface e acessibilidade

- Região principal com título, data/desafio, tema, explicação de no máximo duas frases, grade, teclado e mensagem de estado.
- Grade com seis linhas e cinco células. Cada célula apresenta letra e um marcador não cromático de estado; nomes acessíveis descrevem letra e pista.
- Teclas com estado no teclado virtual exibem um símbolo visível além da cor e anunciam o estado em seu nome acessível.
- Legenda visível com texto para posição correta, presença em outra posição e ausência.
- Teclado físico aceita letras, `Backspace` e `Enter` quando a grade focalizável está selecionada; teclado virtual usa botões HTML com nomes acessíveis.
- Uma instrução visível explica a entrada física. A grade focável tem indicador claro de foco e instrução acessível que resume os comandos.
- Atualização da grade não deve retirar foco do controle ativado.
- Mensagens de validação, tentativas aceitas e conclusão são anunciadas por região `role="status"`/`aria-live="polite"`, sem anunciar conteúdo decorativo repetido.
- Diálogo de regras, estatísticas e compartilhamento usa `<dialog>` nativo, título visível, botão fechar e retorno do foco ao acionador.
- `:focus-visible`, link de salto, cabeçalhos hierárquicos, contraste AA, alvos de toque adequados e `prefers-reduced-motion`.
- Não usar cor, animação, som ou temporizador para transmitir informação exclusiva ou bloquear a conclusão.
- Layout de coluna única em telas estreitas, sem rolagem horizontal a 320 CSS px. Grade e teclado mantêm tamanho legível dentro da largura disponível.
- O tema escuro de alto contraste do mockup de acessibilidade é a referência inicial. Mudança de cores deve ser validada contra WCAG 2.2 AA: 4,5:1 texto comum, 3:1 texto grande, estados sem depender só de cor.

## 6. Compartilhamento

- Só oferecer resultado depois da conclusão.
- Texto contém nome do produto, data, resultado de tentativas (`n/6` ou “não resolvida”) e uma grade de símbolos/emoji por tentativa.
- Não incluir resposta, palpites textuais ou informação pessoal.
- Preferir `navigator.share({title, text})`; se indisponível, tentar `navigator.clipboard.writeText`.
- Compartilhar cancelado pela pessoa (`AbortError`) não é erro a reportar. Outras falhas são mostradas de forma explícita.
- Se não houver API de compartilhamento nem de clipboard, exibir o texto sem spoilers em uma área selecionável, com instrução para copiar manualmente. Nunca mostrar confirmação de cópia sem confirmação da API.

## 7. Testes e verificação

### 7.1 Testes automatizados

Executar `node --test tests/game.test.cjs`. Cobrir:

- normalização de acentos, caixa e contagem de letras;
- palavra fora do dicionário e palavra de comprimento incorreto;
- pista normal e casos de duplicata em que a resposta contém menos ocorrências;
- prioridade do teclado ao combinar pistas de palpites diferentes;
- data civil, epoch e seleção determinística nas bordas de dia/ano;
- sequência atual interrompida por derrota/dia ausente e melhor sequência;
- estatísticas sem partidas;
- texto de compartilhamento sem palavra-resposta ou palpites literais.

### 7.2 Verificação manual no navegador

- Abrir `index.html`, iniciar partida, enviar uma palavra inválida, enviar palavra repetida, acertar e perder em seis tentativas.
- Recarregar antes e depois da conclusão; verificar retomada e estatísticas.
- Testar controles físicos e virtuais, foco visível, mensagens com leitor de tela e uso sem ponteiro.
- Testar larguras de 320, 375 e 768 CSS px e viewport desktop; garantir ausência de overflow horizontal.
- Conferir todas as combinações de cor e foco com contraste; inspecionar alvos primários em toque.
- Confirmar que o texto copiado/compartilhado não contém resposta nem palpites.
- Desabilitar/limpar `localStorage` para observar a mensagem de falha e confirmar que o jogo continua apenas na memória.

### 7.3 Restrições de entrega

- Sem dependências, compilação, fontes externas, analytics ou endpoints de terceiros.
- Evitar adicionar serviços ou bibliotecas sem revisar privacidade e necessidade; o público inclui menores.
- A cobertura do protótipo é funcional; a curadoria do vocabulário deve ser revisada antes de ampliar o conjunto de soluções ou publicar o jogo.

## 8. Riscos técnicos conhecidos

- Um jogo exclusivamente cliente não pode ocultar soluções contidas nos seus próprios arquivos.
- `localStorage` pode ser desativado, limpo ou limitado pelo navegador; progresso não é recuperável nesse caso.
- A lista curada inicial é finita; respostas vão se repetir ao completar um ciclo. Aumentar o vocabulário requer curadoria, testes de comprimento/acentuação e atualização deliberada da versão da lista.
- APIs de compartilhamento dependem do navegador e, em alguns contextos, de origem segura; a interface deve manter alternativa manual.
- Datas civis e mudanças de horário devem ser testadas por data no fuso escolhido, não por deslocamento fixo de milissegundos no relógio local.
