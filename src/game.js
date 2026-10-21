(function attachWordGame(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.WordGame = api;
  }
})(typeof globalThis === "undefined" ? this : globalThis, function createWordGame() {
  "use strict";

  const WORD_LENGTH = 5;
  const MAX_GUESSES = 6;
  const PUZZLE_THEME = "Memes absurdos";
  const EPOCH_DATE = "2026-10-21";

  const answers = [
    { word: "GATOS", display: "GATOS" },
    { word: "HUMOR", display: "HUMOR" },
    { word: "VIDEO", display: "VÍDEO" },
    { word: "DANCA", display: "DANÇA" },
    { word: "RISOS", display: "RISOS" },
    { word: "VIRAL", display: "VIRAL" },
    { word: "PIXEL", display: "PIXEL" },
    { word: "POSTA", display: "POSTA" },
    { word: "MEMES", display: "MEMES" },
    { word: "PUDIM", display: "PUDIM" },
    { word: "PATOS", display: "PATOS" },
    { word: "FOTOS", display: "FOTOS" },
    { word: "JOGOS", display: "JOGOS" },
    { word: "CLIPE", display: "CLIPE" },
    { word: "VLOGS", display: "VLOGS" },
    { word: "GIFES", display: "GIFES" },
    { word: "LIVES", display: "LIVES" },
    { word: "TREND", display: "TREND" },
    { word: "BICHO", display: "BICHO" },
    { word: "ROBOS", display: "ROBÔS" },
    { word: "CORES", display: "CORES" },
    { word: "BOLAS", display: "BOLAS" },
    { word: "FADAS", display: "FADAS" },
    { word: "BRISA", display: "BRISA" },
    { word: "PINGO", display: "PINGO" },
    { word: "MANGA", display: "MANGÁ" },
    { word: "PIZZA", display: "PIZZA" },
    { word: "BOLOS", display: "BOLOS" },
    { word: "MUNDO", display: "MUNDO" },
    { word: "LENTE", display: "LENTE" },
    { word: "CLICA", display: "CLICA" },
    { word: "FALAS", display: "FALAS" },
    { word: "AMIGO", display: "AMIGO" },
    { word: "BANDA", display: "BANDA" },
    { word: "FOLIA", display: "FOLIA" },
    { word: "PISTA", display: "PISTA" },
    { word: "PULOS", display: "PULOS" },
    { word: "GLOBO", display: "GLOBO" },
    { word: "NINJA", display: "NINJA" },
    { word: "PLACA", display: "PLACA" },
    { word: "NUVEM", display: "NUVEM" },
    { word: "SALTO", display: "SALTO" },
    { word: "SORTE", display: "SORTE" },
    { word: "CANTO", display: "CANTO" },
    { word: "GINGA", display: "GINGA" },
    { word: "DICAS", display: "DICAS" },
    { word: "CHAVE", display: "CHAVE" },
    { word: "FERAS", display: "FERAS" },
    { word: "METAS", display: "METAS" },
    { word: "VENTO", display: "VENTO" },
    { word: "SUPER", display: "SUPER" },
    { word: "SONHO", display: "SONHO" },
    { word: "MAGIA", display: "MAGIA" },
    { word: "FELIZ", display: "FELIZ" },
    { word: "PIPAS", display: "PIPAS" },
    { word: "BRAVO", display: "BRAVO" },
    { word: "TRUPE", display: "TRUPE" },
    { word: "CABOS", display: "CABOS" },
    { word: "LIVRO", display: "LIVRO" },
  ];

  const extraGuesses = [
    "ALUNO", "ALUNA", "ALTOS", "AMORA", "APOIO", "ARROZ", "BAILE", "BANCO",
    "BARCO", "BARRO", "BATOM", "BEBER", "BELOS", "BOATE", "BRASA", "BROTO",
    "CAMPO", "CANAL", "CARTA", "CASAS", "CENAS", "CERTO", "CINCO", "CLARO",
    "COBRA", "CONTO", "CORPO", "CRAVO", "CURSO", "DADOS", "DEDOS", "DORES",
    "DUPLA", "FALTA", "FAROL", "FESTA", "FILME", "FINAL", "FOLHA", "FORMA",
    "FRASE", "FREIO", "FRUTA", "GALHO", "GANSO", "GENTE", "GRAMA", "GRUPO",
    "IDEIA", "LARVA", "LIMAO", "LINHA", "LOUSA", "LUGAR", "MEIAS", "MENTE",
    "MESAS", "MEXER", "MINHA", "MOLHO", "MONTE", "MORAL", "MOTOR", "MOUSE",
    "NOITE", "OLHAR", "OUVIR", "PAPEL", "PARTE", "PASTA", "PEDRA", "PEIXE",
    "PERTO", "PIANO", "PILHA", "PLANO", "PONTE", "PONTO", "PRATO", "PRAZO",
    "PRETO", "PRIMO", "PROVA", "QUASE", "QUILO", "RAIVA", "RASGO", "RATOS",
    "RISCO", "ROLHA", "ROUPA", "RUMOR", "SABER", "SACOS", "SAIDA", "SANTO",
    "SENHA", "SINAL", "SOLTA", "SUAVE", "TARDE", "TECLA", "TEMPO", "TERRA",
    "TIGRE", "TOQUE", "TRAMA", "TREVO", "TROCA", "TURMA", "VAGAS", "VALOR",
    "VAPOR", "VASTO", "VERDE", "VIRAR", "VISTA", "VIVER", "VOVOS", "ZEBRA",
    "PODAS",
  ];

  function normalizeWord(value) {
    if (typeof value !== "string") {
      return "";
    }
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase("pt-BR")
      .trim();
  }

  function isFiveLetters(value) {
    const normalized = normalizeWord(value);
    return /^[A-Z]{5}$/.test(normalized) && Array.from(normalized).length === WORD_LENGTH;
  }

  const validWords = new Set(
    answers.map((entry) => entry.word).concat(extraGuesses.map(normalizeWord)),
  );

  function isValidGuess(value) {
    const normalized = normalizeWord(value);
    return isFiveLetters(normalized) && validWords.has(normalized);
  }

  function dateOrdinal(dateKey) {
    if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      throw new TypeError("A data deve usar o formato YYYY-MM-DD.");
    }
    const [year, month, day] = dateKey.split("-").map(Number);
    const timestamp = Date.UTC(year, month - 1, day);
    const date = new Date(timestamp);
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new RangeError("A data informada não existe.");
    }
    return Math.floor(timestamp / 86400000);
  }

  function getDateKeyInTimeZone(date, timeZone) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new TypeError("É necessária uma data válida.");
    }
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map((part) => [part.type, part.value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function getPuzzleForDate(dateKey) {
    const offset = dateOrdinal(dateKey) - dateOrdinal(EPOCH_DATE);
    const index = ((offset % answers.length) + answers.length) % answers.length;
    const selected = answers[index];
    return {
      date: dateKey,
      word: selected.word,
      display: selected.display,
      theme: PUZZLE_THEME,
    };
  }

  function scoreGuess(answer, guess) {
    const answerLetters = Array.from(normalizeWord(answer));
    const guessLetters = Array.from(normalizeWord(guess));
    if (answerLetters.length !== WORD_LENGTH || guessLetters.length !== WORD_LENGTH) {
      throw new RangeError("A resposta e a tentativa precisam ter cinco letras.");
    }

    const result = Array(WORD_LENGTH).fill("absent");
    const remaining = new Map();

    for (let index = 0; index < WORD_LENGTH; index += 1) {
      if (guessLetters[index] === answerLetters[index]) {
        result[index] = "correct";
      } else {
        const letter = answerLetters[index];
        remaining.set(letter, (remaining.get(letter) || 0) + 1);
      }
    }

    for (let index = 0; index < WORD_LENGTH; index += 1) {
      if (result[index] === "correct") {
        continue;
      }
      const letter = guessLetters[index];
      const count = remaining.get(letter) || 0;
      if (count > 0) {
        result[index] = "present";
        remaining.set(letter, count - 1);
      }
    }

    return result;
  }

  function getKeyboardStates(guesses, answer) {
    const priority = { absent: 1, present: 2, correct: 3 };
    const states = {};
    for (const guess of guesses) {
      const letters = Array.from(normalizeWord(guess));
      const grades = scoreGuess(answer, guess);
      for (let index = 0; index < letters.length; index += 1) {
        const letter = letters[index];
        const next = grades[index];
        if (!states[letter] || priority[next] > priority[states[letter]]) {
          states[letter] = next;
        }
      }
    }
    return states;
  }

  function addDays(dateKey, days) {
    return new Date((dateOrdinal(dateKey) + days) * 86400000)
      .toISOString()
      .slice(0, 10);
  }

  function getStatistics(completed, today) {
    if (!completed || typeof completed !== "object" || Array.isArray(completed)) {
      throw new TypeError("O histórico de partidas precisa ser um objeto.");
    }
    dateOrdinal(today);
    const records = Object.entries(completed)
      .filter(([, record]) => record && (record.status === "won" || record.status === "lost"))
      .sort(([first], [second]) => first.localeCompare(second));
    const wins = records.filter(([, record]) => record.status === "won");
    const total = records.length;
    const winDays = new Set(wins.map(([date]) => date));
    const todayRecord = completed[today];
    let streakDate;
    if (todayRecord && todayRecord.status === "won") {
      streakDate = today;
    } else if (!todayRecord) {
      const yesterday = addDays(today, -1);
      if (winDays.has(yesterday)) {
        streakDate = yesterday;
      }
    }

    let currentStreak = 0;
    while (streakDate && winDays.has(streakDate)) {
      currentStreak += 1;
      streakDate = addDays(streakDate, -1);
    }

    let bestStreak = 0;
    let run = 0;
    let previousWinDate = null;
    for (const [date] of wins) {
      run = previousWinDate && dateOrdinal(date) - dateOrdinal(previousWinDate) === 1
        ? run + 1
        : 1;
      bestStreak = Math.max(bestStreak, run);
      previousWinDate = date;
    }

    return {
      played: total,
      won: wins.length,
      winRate: total === 0 ? 0 : Math.round((wins.length / total) * 100),
      currentStreak,
      bestStreak,
      lastSolved: wins.length ? wins[wins.length - 1][0] : null,
    };
  }

  function makeShareText(dateKey, guesses, answer, status) {
    const result = status === "won" ? `${guesses.length}/${MAX_GUESSES}` : "não resolvida";
    const symbols = { correct: "🟩", present: "🟨", absent: "⬛" };
    const rows = guesses.map((guess) =>
      scoreGuess(answer, guess).map((grade) => symbols[grade]).join(""),
    );
    return [
      `Palavrada ${dateKey} · ${result}`,
      ...rows,
      "Desafio diário de palavras",
    ].join("\n");
  }

  return Object.freeze({
    WORD_LENGTH,
    MAX_GUESSES,
    PUZZLE_THEME,
    normalizeWord,
    isFiveLetters,
    isValidGuess,
    getDateKeyInTimeZone,
    getPuzzleForDate,
    scoreGuess,
    getKeyboardStates,
    getStatistics,
    makeShareText,
  });
});
