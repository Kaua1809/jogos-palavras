(function startPalavrada() {
  "use strict";

  const game = window.WordGame;
  if (!game) {
    throw new Error("As regras do jogo não foram carregadas.");
  }

  const STORAGE_KEY = "palavrada:v1";
  let today = game.getDateKeyInTimeZone(new Date(), "America/Sao_Paulo");
  let puzzle = game.getPuzzleForDate(today);
  const elements = {
    dateLabel: document.getElementById("date-label"),
    themeName: document.getElementById("theme-name"),
    storageWarning: document.getElementById("storage-warning"),
    gameStatus: document.getElementById("game-status"),
    board: document.getElementById("board"),
    turnCount: document.getElementById("turn-count"),
    keyboard: document.getElementById("keyboard"),
    submitKey: document.getElementById("submit-key"),
    resultPanel: document.getElementById("result-panel"),
    resultTitle: document.getElementById("result-title"),
    resultMessage: document.getElementById("result-message"),
    shareOpenButton: document.getElementById("share-open-button"),
    statsDialog: document.getElementById("stats-dialog"),
    helpDialog: document.getElementById("help-dialog"),
    shareDialog: document.getElementById("share-dialog"),
    shareText: document.getElementById("share-text"),
    shareStatus: document.getElementById("share-status"),
  };

  let storageAvailable = true;
  let input = "";
  let state = {
    version: 1,
    completed: {},
    current: { date: today, guesses: [] },
  };

  function announce(message) {
    elements.gameStatus.textContent = message;
  }

  function showStorageWarning(message, error) {
    elements.storageWarning.textContent = message;
    elements.storageWarning.hidden = false;
    if (error) {
      console.warn("Palavrada: falha no armazenamento local.", error);
    }
  }

  function isDateKey(value) {
    try {
      game.getPuzzleForDate(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function validateSavedState(value) {
    if (
      !isPlainObject(value) ||
      value.version !== 1 ||
      !isPlainObject(value.completed) ||
      !isPlainObject(value.current) ||
      !isDateKey(value.current.date) ||
      !Array.isArray(value.current.guesses) ||
      value.current.guesses.length > game.MAX_GUESSES
    ) {
      throw new Error("O formato do salvamento local não é compatível.");
    }

    const uniqueGuesses = new Set();
    for (const guess of value.current.guesses) {
      const normalized = game.normalizeWord(guess);
      if (!game.isValidGuess(normalized) || uniqueGuesses.has(normalized)) {
        throw new Error("A partida salva contém uma tentativa inválida.");
      }
      uniqueGuesses.add(normalized);
    }

    for (const [date, record] of Object.entries(value.completed)) {
      if (
        !isDateKey(date) ||
        !isPlainObject(record) ||
        (record.status !== "won" && record.status !== "lost") ||
        !Number.isInteger(record.attempts) ||
        record.attempts < 1 ||
        record.attempts > game.MAX_GUESSES
      ) {
        throw new Error("O histórico salvo contém um registro inválido.");
      }
    }

    return {
      version: 1,
      completed: value.completed,
      current: value.current.date === today
        ? { date: today, guesses: value.current.guesses.map(game.normalizeWord) }
        : { date: today, guesses: [] },
    };
  }

  function loadSavedState() {
    try {
      const serialized = window.localStorage.getItem(STORAGE_KEY);
      if (serialized === null) {
        return;
      }
      state = validateSavedState(JSON.parse(serialized));
    } catch (error) {
      storageAvailable = false;
      state = {
        version: 1,
        completed: {},
        current: { date: today, guesses: [] },
      };
      showStorageWarning(
        "Não foi possível recuperar o progresso salvo. O histórico anterior não foi carregado e o progresso desta sessão não ficará salvo após fechar ou recarregar a página.",
        error,
      );
    }
  }

  function persistState() {
    if (!storageAvailable) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      storageAvailable = false;
      showStorageWarning(
        "Seu navegador não conseguiu salvar o progresso. Você pode continuar nesta sessão, mas ele não ficará guardado depois.",
        error,
      );
    }
  }

  function currentResult() {
    return state.completed[today] || null;
  }

  function formatDay(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  function stateDescription(grade) {
    if (grade === "correct") return "posição certa";
    if (grade === "present") return "está na palavra, em outra posição";
    return "não está na palavra";
  }

  function stateSymbol(grade) {
    if (grade === "correct") return "✓";
    if (grade === "present") return "◆";
    return "×";
  }

  function makeTile(letter, grade, index) {
    const tile = document.createElement("div");
    tile.className = grade ? `tile ${grade}` : "tile";
    tile.setAttribute("role", "img");
    if (grade) {
      tile.setAttribute("aria-label", `Letra ${index + 1}: ${letter}, ${stateDescription(grade)}.`);
    } else if (letter) {
      tile.setAttribute("aria-label", `Letra ${index + 1}: ${letter}.`);
    } else {
      tile.setAttribute("aria-label", `Letra ${index + 1}, vazia.`);
    }

    const character = document.createElement("span");
    character.className = "tile-letter";
    character.textContent = letter;
    tile.append(character);

    if (grade) {
      const symbol = document.createElement("span");
      symbol.className = "tile-symbol";
      symbol.setAttribute("aria-hidden", "true");
      symbol.textContent = stateSymbol(grade);
      tile.append(symbol);
    }
    return tile;
  }

  function renderBoard() {
    const guesses = state.current.guesses;
    const finished = currentResult() !== null;
    const board = document.createDocumentFragment();

    for (let rowIndex = 0; rowIndex < game.MAX_GUESSES; rowIndex += 1) {
      const row = document.createElement("div");
      row.className = "board-row";

      if (rowIndex < guesses.length) {
        const guess = guesses[rowIndex];
        const grades = game.scoreGuess(puzzle.word, guess);
        const summary = grades
          .map((grade, index) => `${guess[index]}: ${stateDescription(grade)}`)
          .join("; ");
        row.setAttribute("role", "group");
        row.setAttribute("aria-label", `Tentativa ${rowIndex + 1}. ${summary}.`);
        for (let index = 0; index < game.WORD_LENGTH; index += 1) {
          row.append(makeTile(guess[index], grades[index], index));
        }
      } else if (rowIndex === guesses.length && !finished) {
        row.setAttribute("role", "group");
        row.setAttribute("aria-label", `Tentativa atual, ${guesses.length + 1} de ${game.MAX_GUESSES}.`);
        const letters = Array.from(input);
        for (let index = 0; index < game.WORD_LENGTH; index += 1) {
          row.append(makeTile(letters[index] || "", null, index));
        }
      } else {
        row.setAttribute("aria-hidden", "true");
        for (let index = 0; index < game.WORD_LENGTH; index += 1) {
          row.append(makeTile("", null, index));
        }
      }
      board.append(row);
    }

    elements.board.replaceChildren(board);
    updateTurnCount();
  }

  function updateTurnCount() {
    const result = currentResult();
    if (result) {
      elements.turnCount.textContent = result.status === "won"
        ? `Desafio concluído · ${result.attempts} ${result.attempts === 1 ? "tentativa" : "tentativas"}`
        : "Desafio concluído · 6 de 6 tentativas";
      return;
    }
    elements.turnCount.textContent = `Tentativa ${state.current.guesses.length + 1} de ${game.MAX_GUESSES}`;
  }

  function updateKeyboard() {
    const states = game.getKeyboardStates(state.current.guesses, puzzle.word);
    const finished = currentResult() !== null;
    for (const button of elements.keyboard.querySelectorAll("button[data-key]")) {
      const key = button.dataset.key;
      button.disabled = finished || (key === "ENTER" && input.length !== game.WORD_LENGTH) ||
        (key === "BACKSPACE" && input.length === 0);
      if (/^[A-Z]$/.test(key)) {
        const grade = states[key];
        button.classList.remove("correct", "present", "absent");
        let marker = button.querySelector(".key-marker");
        if (grade) {
          button.classList.add(grade);
          button.setAttribute("aria-label", `Letra ${key}, ${stateDescription(grade)}.`);
          if (!marker) {
            marker = document.createElement("span");
            marker.className = "key-marker";
            marker.setAttribute("aria-hidden", "true");
            button.append(marker);
          }
          marker.textContent = stateSymbol(grade);
        } else {
          button.setAttribute("aria-label", `Letra ${key}.`);
          marker?.remove();
        }
      }
    }
  }

  function updateResult() {
    const result = currentResult();
    elements.resultPanel.hidden = !result;
    if (!result) {
      return;
    }
    if (result.status === "won") {
      elements.resultTitle.textContent = "Mandou bem!";
      elements.resultMessage.textContent =
        `Você encontrou em ${result.attempts} ${result.attempts === 1 ? "tentativa" : "tentativas"}. A resposta era ${puzzle.display}.`;
    } else {
      elements.resultTitle.textContent = "Fim das tentativas.";
      elements.resultMessage.textContent = `A resposta de hoje era ${puzzle.display}. Amanhã tem outro desafio.`;
    }
  }

  function updateStatistics() {
    const stats = game.getStatistics(state.completed, today);
    document.getElementById("stat-played").textContent = String(stats.played);
    document.getElementById("stat-won").textContent = String(stats.won);
    document.getElementById("stat-streak").textContent = `${stats.currentStreak} ${stats.currentStreak === 1 ? "dia" : "dias"}`;
    document.getElementById("stat-best").textContent = `${stats.bestStreak} ${stats.bestStreak === 1 ? "dia" : "dias"}`;
    document.getElementById("detail-played").textContent = String(stats.played);
    document.getElementById("detail-won").textContent = String(stats.won);
    document.getElementById("detail-rate").textContent = `${stats.winRate}%`;
    document.getElementById("detail-streak").textContent = `${stats.currentStreak} ${stats.currentStreak === 1 ? "dia" : "dias"}`;
    document.getElementById("detail-best").textContent = `${stats.bestStreak} ${stats.bestStreak === 1 ? "dia" : "dias"}`;
    document.getElementById("detail-last").textContent = stats.lastSolved ? formatDay(stats.lastSolved) : "Nenhuma";
  }

  function render() {
    elements.dateLabel.textContent = `Desafio de hoje · ${formatDay(today)}`;
    elements.themeName.textContent = puzzle.theme;
    renderBoard();
    updateKeyboard();
    updateResult();
    updateStatistics();
  }

  function refreshDailyChallenge() {
    const currentDate = game.getDateKeyInTimeZone(new Date(), "America/Sao_Paulo");
    if (currentDate === today) {
      return;
    }

    today = currentDate;
    puzzle = game.getPuzzleForDate(today);
    input = "";
    if (state.current.date !== today) {
      state.current = { date: today, guesses: [] };
    }
    persistState();
    render();
    announce(currentResult()
      ? "O desafio de hoje já foi concluído."
      : "Um novo desafio diário está disponível.");
  }

  function addLetter(letter) {
    if (currentResult()) {
      return;
    }
    if (input.length >= game.WORD_LENGTH) {
      announce("A tentativa já tem cinco letras. Envie ou apague uma letra.");
      return;
    }
    input += letter;
    renderBoard();
    updateKeyboard();
    announce(`Letra ${letter} adicionada.`);
  }

  function removeLetter() {
    if (!input.length || currentResult()) {
      return;
    }
    input = Array.from(input).slice(0, -1).join("");
    renderBoard();
    updateKeyboard();
    announce("Última letra apagada.");
  }

  function submitGuess() {
    if (currentResult()) {
      announce("O desafio de hoje já foi concluído.");
      return;
    }
    if (input.length !== game.WORD_LENGTH) {
      announce("Sua tentativa precisa ter cinco letras.");
      return;
    }

    const guess = game.normalizeWord(input);
    if (!game.isValidGuess(guess)) {
      announce("Não encontramos essa palavra na lista do jogo. Tente outra palavra de cinco letras.");
      return;
    }
    if (state.current.guesses.includes(guess)) {
      announce("Você já tentou essa palavra. Escolha outra.");
      return;
    }

    state.current.guesses.push(guess);
    input = "";
    const won = guess === puzzle.word;
    const lost = !won && state.current.guesses.length === game.MAX_GUESSES;

    if (won || lost) {
      state.completed[today] = {
        status: won ? "won" : "lost",
        attempts: state.current.guesses.length,
      };
    }

    persistState();
    render();
    if (won) {
      announce(`Correto! Você encontrou ${puzzle.display} em ${state.current.guesses.length} tentativas.`);
    } else if (lost) {
      announce(`Suas seis tentativas acabaram. A resposta era ${puzzle.display}.`);
    } else {
      announce(`Tentativa ${state.current.guesses.length} registrada. ${game.MAX_GUESSES - state.current.guesses.length} restantes.`);
    }
    if (won || lost) {
      elements.resultTitle.focus();
    }
  }

  function handleVirtualKey(key) {
    if (key === "BACKSPACE") {
      removeLetter();
    } else if (key === "ENTER") {
      submitGuess();
    } else if (/^[A-Z]$/.test(key)) {
      addLetter(key);
    }
  }

  function handlePhysicalKey(event) {
    if (document.querySelector("dialog[open]") || event.target.closest("textarea, input")) {
      return;
    }
    if (event.key === "Enter") {
      if (event.target.closest("button")) {
        return;
      }
      event.preventDefault();
      submitGuess();
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      removeLetter();
      return;
    }
    if (event.key.length === 1 && /^\p{L}$/u.test(event.key)) {
      const letter = game.normalizeWord(event.key);
      if (/^[A-Z]$/.test(letter)) {
        event.preventDefault();
        addLetter(letter);
      }
    }
  }

  function openDialog(dialog) {
    if (!dialog.open) {
      dialog.showModal();
    }
  }

  function prepareShare() {
    const result = currentResult();
    if (!result) {
      announce("Conclua o desafio para compartilhar seu resultado.");
      return;
    }
    elements.shareText.value = game.makeShareText(
      today,
      state.current.guesses,
      puzzle.word,
      result.status,
    );
    elements.shareStatus.textContent = "";
    openDialog(elements.shareDialog);
  }

  async function copyShareText() {
    elements.shareStatus.textContent = "";
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
      elements.shareText.focus();
      elements.shareText.select();
      elements.shareStatus.textContent =
        "A cópia automática não está disponível. O texto está selecionado; copie-o pelo menu do dispositivo.";
      return;
    }
    try {
      await navigator.clipboard.writeText(elements.shareText.value);
      elements.shareStatus.textContent = "Resultado copiado. Ele não inclui a resposta.";
    } catch (error) {
      console.warn("Palavrada: não foi possível copiar o resultado.", error);
      elements.shareText.focus();
      elements.shareText.select();
      elements.shareStatus.textContent =
        "Não foi possível copiar automaticamente. O texto está selecionado para você copiar manualmente.";
    }
  }

  async function shareNatively() {
    if (typeof navigator.share !== "function") {
      await copyShareText();
      return;
    }
    try {
      await navigator.share({
        title: "Meu resultado no Palavrada",
        text: elements.shareText.value,
      });
      elements.shareStatus.textContent = "Resultado compartilhado sem revelar a resposta.";
    } catch (error) {
      if (error && error.name === "AbortError") {
        elements.shareStatus.textContent = "Compartilhamento cancelado.";
        return;
      }
      console.warn("Palavrada: o compartilhamento não foi concluído.", error);
      elements.shareStatus.textContent =
        "Não foi possível compartilhar agora. Tente copiar o resultado.";
    }
  }

  loadSavedState();
  if (state.current.guesses.includes(puzzle.word) && !state.completed[today]) {
    state.completed[today] = { status: "won", attempts: state.current.guesses.length };
  } else if (state.current.guesses.length === game.MAX_GUESSES && !state.completed[today]) {
    state.completed[today] = { status: "lost", attempts: game.MAX_GUESSES };
  }
  render();

  if (!state.current.guesses.length && !currentResult()) {
    announce("Aguardando sua primeira tentativa. Digite cinco letras.");
  } else if (currentResult()) {
    announce("O desafio de hoje já foi concluído.");
  } else {
    announce(`Partida retomada. ${game.MAX_GUESSES - state.current.guesses.length} tentativas restantes.`);
  }

  window.setInterval(refreshDailyChallenge, 30000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshDailyChallenge();
    }
  });
  elements.keyboard.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (button && !button.disabled) {
      handleVirtualKey(button.dataset.key);
    }
  });
  document.addEventListener("keydown", handlePhysicalKey);
  document.getElementById("help-button").addEventListener("click", () => openDialog(elements.helpDialog));
  document.getElementById("stats-button").addEventListener("click", () => openDialog(elements.statsDialog));
  elements.shareOpenButton.addEventListener("click", prepareShare);
  document.getElementById("copy-button").addEventListener("click", copyShareText);
  document.getElementById("native-share-button").addEventListener("click", shareNatively);
})();
