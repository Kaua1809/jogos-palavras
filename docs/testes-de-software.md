# Testes de software — Palavrada

**Data da execução:** 2026-10-28  
**Escopo:** regras do jogo e fluxos principais da interface.

## Tipos de teste aplicáveis

- **Unitários:** validam funções isoladas, como normalização de palavras, pontuação das pistas, escolha do desafio e estatísticas.
- **Integração:** verificam componentes trabalhando juntos, por exemplo interface, regras do jogo e `localStorage`.
- **Ponta a ponta (E2E):** percorrem tarefas completas de quem joga, da digitação ao resultado final.
- **Negativos e de robustez:** cobrem palavras inválidas, palpites repetidos e falhas ou dados inválidos no armazenamento.
- **Responsividade e compatibilidade:** verificam diferentes larguras de tela, navegadores, dispositivos e formas de entrada.
- **Acessibilidade e usabilidade:** avaliam navegação por teclado, leitor de tela, foco, contraste, compreensão das pistas e facilidade de uso.
- **Desempenho:** mede carregamento e resposta da interface em dispositivos e conexões diferentes.
- **Privacidade e segurança:** verifica o conteúdo persistido, o compartilhamento sem spoilers e a ausência de envio desnecessário de dados.

## Resultados executados

### Testes automatizados de regras

Comando executado:

```sh
node --test tests/game.test.cjs
```

**Resultado: 11 testes aprovados, 0 falhas.**

Foram cobertos:

- normalização de maiúsculas e acentos e validação de cinco letras;
- aceitação de palavras do vocabulário e rejeição de palavras inválidas;
- pistas de posição, presença e ausência, incluindo letras repetidas;
- preservação da melhor pista no teclado;
- seleção determinística do desafio e rejeição de data inexistente;
- cálculo da data no fuso `America/Sao_Paulo`;
- validação das respostas do ciclo;
- estatísticas, taxa de acerto e sequências de vitórias;
- compartilhamento sem resposta ou palpites textuais.

### Testes de interface no navegador

Foram feitas 25 verificações automatizadas no navegador integrado, usando a página local do jogo. O progresso anterior do navegador foi restaurado ao final.

**Resultado: todas as verificações passaram.**

| Área | Verificações realizadas |
|---|---|
| Validação de palpites | Palavra inválida e repetida são rejeitadas sem consumir tentativa. |
| Entrada | Digitação pelo teclado físico e pelo teclado virtual; envio de palpite válido. |
| Persistência | Palpite salvo no armazenamento local e partida em andamento retomada após recarregar a página. |
| Vitória | Resultado e estatísticas atualizados; conclusão preservada após recarga. |
| Derrota | Com cinco palpites válidos previamente registrados, a sexta tentativa encerra a partida; a derrota não conta como vitória e persiste após recarga. |
| Compartilhamento | Texto gerado não revela a resposta nem os palpites. |
| Diálogos | Abertura dos diálogos de ajuda e estatísticas. |
| Falha no estado local | JSON inválido produz aviso visível e o jogo continua disponível em memória. |
| Responsividade | Sem rolagem horizontal nas larguras de 320, 375, 768 e 1280 pixels CSS. |

O cenário de derrota foi preparado com cinco palpites válidos no estado local antes de testar a última jogada; não foram jogadas seis partidas do início ao fim.

## Testes recomendados para próximas validações

Estes testes não foram executados nesta rodada:

1. **Acessibilidade com tecnologia assistiva:** percorrer o jogo apenas com teclado e validar anúncios e nomes acessíveis com leitores de tela, como NVDA ou VoiceOver.
2. **Contraste e foco:** medir cores e estados de foco contra WCAG 2.2 AA com ferramenta automatizada e conferir manualmente.
3. **Compatibilidade:** repetir os fluxos em Firefox, Safari, Edge e navegadores móveis; verificar toque e diferentes orientações.
4. **Falha ao gravar:** simular `localStorage` indisponível ou quota excedida e confirmar que o aviso é exibido sem perder a partida em memória.
5. **Casos de datas:** validar a mudança do desafio na virada do dia e em datas limite do fuso configurado.
6. **Compartilhamento real:** testar cópia para a área de transferência e compartilhamento nativo em dispositivos compatíveis.
7. **Desempenho:** medir carregamento, tamanho dos arquivos e resposta em dispositivos de menor capacidade.
8. **Usabilidade:** observar pessoas jogando sem orientação e registrar dúvidas sobre pistas, controles e resultado.

## Como repetir

1. Execute `node --test tests/game.test.cjs` na raiz do projeto.
2. Abra `index.html` em um navegador moderno.
3. Para repetir os cenários de interface com dados limpos, use um perfil de teste ou limpe o armazenamento local do site. Não apague o progresso de um perfil pessoal.

Os testes de interface desta rodada foram exploratórios e não estão configurados como uma suíte E2E permanente. A arquitetura e os requisitos de validação estão descritos em [SPECS.md](../SPECS.md).
