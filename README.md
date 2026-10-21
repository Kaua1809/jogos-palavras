# Palavrada

Jogo diário de adivinhação de palavras em português brasileiro, com seis tentativas, tema “Memes absurdos”, pistas acessíveis e progresso local. Não requer cadastro, servidor de aplicação nem dependências de runtime.

## Jogar

Abra `index.html` em um navegador moderno. O jogo também pode ser servido como arquivos estáticos. A data do desafio usa o fuso `America/Sao_Paulo`; a lista de respostas inicial é finita e se repete ao completar seu ciclo.

O progresso fica no `localStorage` do navegador. Limpar os dados do site ou trocar de dispositivo remove o histórico; não há sincronização nem telemetria.

## Testes

Com Node.js instalado, execute:

```sh
node --test tests/game.test.cjs
```

## Documentação

- [PRD](./docs/plans/2026-10-21-jogo-casual-adivinhacao-palavras.md)
- [Especificação técnica](./SPECS.md)
- [Protótipo UX](./prototypes/01-ux.html)
- [Protótipo acessível](./prototypes/02-accessibility.html)
- [Protótipo visual](./prototypes/03-visual.html)
