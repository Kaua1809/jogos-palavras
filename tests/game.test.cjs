"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const game = require("../src/game.js");

test("normaliza caixa e acentos sem alterar a quantidade de letras", () => {
  assert.equal(game.normalizeWord("dança"), "DANCA");
  assert.equal(game.normalizeWord("víDeo"), "VIDEO");
  assert.equal(game.isFiveLetters("DANÇA"), true);
  assert.equal(game.isFiveLetters("sol"), false);
});

test("aceita somente palavras curadas com cinco letras", () => {
  assert.equal(game.isValidGuess("vídeo"), true);
  assert.equal(game.isValidGuess("PATOS"), true);
  assert.equal(game.isValidGuess("naïve"), false);
  assert.equal(game.isValidGuess("LIVROOO"), false);
});

test("avalia posição certa, presença em outra posição e ausência", () => {
  assert.deepEqual(
    game.scoreGuess("GATOS", "PODAS"),
    ["absent", "present", "absent", "present", "correct"],
  );
});

test("limita as pistas de letras repetidas à quantidade presente na resposta", () => {
  assert.deepEqual(
    game.scoreGuess("GATOS", "GAAAS"),
    ["correct", "correct", "absent", "absent", "correct"],
  );
});

test("preserva a melhor pista de cada tecla entre tentativas", () => {
  const states = game.getKeyboardStates(["PATOS", "GATOS"], "GATOS");
  assert.equal(states.P, "absent");
  assert.equal(states.A, "correct");
  assert.equal(states.T, "correct");
  assert.equal(states.O, "correct");
  assert.equal(states.S, "correct");
  assert.equal(states.G, "correct");
});

test("escolhe o mesmo desafio para a mesma data e avança de forma determinística", () => {
  assert.equal(game.getPuzzleForDate("2026-10-21").word, "GATOS");
  assert.equal(game.getPuzzleForDate("2026-10-21").word, game.getPuzzleForDate("2026-10-21").word);
  assert.equal(game.getPuzzleForDate("2026-10-22").word, "HUMOR");
  assert.equal(game.getPuzzleForDate("2026-10-21").theme, "Memes absurdos");
  assert.throws(() => game.getPuzzleForDate("2026-02-30"), RangeError);
});

test("calcula a data civil do desafio no fuso escolhido", () => {
  assert.equal(
    game.getDateKeyInTimeZone(new Date("2026-10-21T02:59:00Z"), "America/Sao_Paulo"),
    "2026-10-20",
  );
  assert.equal(
    game.getDateKeyInTimeZone(new Date("2026-10-21T03:00:00Z"), "America/Sao_Paulo"),
    "2026-10-21",
  );
});

test("todas as respostas do ciclo têm cinco letras e grafia coerente", () => {
  const firstDay = Date.UTC(2026, 9, 21);
  for (let offset = 0; offset < 120; offset += 1) {
    const date = new Date(firstDay + offset * 86400000).toISOString().slice(0, 10);
    const puzzle = game.getPuzzleForDate(date);
    assert.equal(game.isFiveLetters(puzzle.word), true, date);
    assert.equal(game.normalizeWord(puzzle.display), puzzle.word, date);
    assert.equal(game.isValidGuess(puzzle.word), true, date);
  }
});

test("calcula totais, taxa e sequências sem confundir derrota com vitória", () => {
  const records = {
    "2026-10-18": { status: "won", attempts: 4 },
    "2026-10-19": { status: "won", attempts: 2 },
    "2026-10-20": { status: "lost", attempts: 6 },
  };
  assert.deepEqual(game.getStatistics(records, "2026-10-21"), {
    played: 3,
    won: 2,
    winRate: 67,
    currentStreak: 0,
    bestStreak: 2,
    lastSolved: "2026-10-19",
  });
  assert.equal(game.getStatistics({}, "2026-10-21").winRate, 0);
});

test("considera a vitória de hoje e as vitórias consecutivas anteriores", () => {
  const records = {
    "2026-10-19": { status: "won", attempts: 3 },
    "2026-10-20": { status: "won", attempts: 4 },
    "2026-10-21": { status: "won", attempts: 1 },
  };
  assert.equal(game.getStatistics(records, "2026-10-21").currentStreak, 3);
});

test("compartilha apenas resultado e pistas, nunca resposta ou palpites", () => {
  const share = game.makeShareText("2026-10-21", ["PODAS"], "GATOS", "won");
  assert.match(share, /1\/6/);
  assert.match(share, /⬛🟨⬛🟨🟩/);
  assert.doesNotMatch(share, /GATOS|PODAS/);
});
