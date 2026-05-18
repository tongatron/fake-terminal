import { print, blank, printUserEcho, focusInput, scrollToBottom, sleep } from "./engine/terminal.js";
import { state, maybeAdvance } from "./engine/state.js";
import { commands, handleSoft, unknown } from "./commands/index.js";

// ---- Welcome ----
async function welcome() {
  print("SYS v0.1 — Interfaccia utente minimale", "dim");
  print("Digitare 'help' per la lista dei comandi disponibili.", "dim");
  print("Digitare qualsiasi cosa per vedere cosa succede.", "dim");
  blank();
}

// ---- Inactivity ----
const inactivityMessages = [
  { at: 60, text: "Ci sei ancora.", cls: "dim" },
  { at: 120, text: "Il cursore lampeggia da due minuti. Giusto per informazione.", cls: "dim" },
  { at: 240, text: "Molti utenti a questo punto hanno già chiuso la scheda. Non lo sto suggerendo.", cls: "dim" },
];
let inactivityFired = new Set();

function checkInactivity() {
  if (state.ended) return;
  const elapsed = (Date.now() - state.lastInputAt) / 1000;
  for (const m of inactivityMessages) {
    if (elapsed >= m.at && !inactivityFired.has(m.at)) {
      inactivityFired.add(m.at);
      print(m.text, m.cls);
    }
  }
  // Phase 3 silence consent
  if (state.phase === 3 && elapsed >= 30 && !state.ended) {
    state.ended = true;
    print("");
    print("Il silenzio è stato registrato.", "warn");
    print("Conforme.", "dim");
  }
}

setInterval(checkInactivity, 2000);

// ---- Input handling ----
async function handleCommand(raw) {
  state.lastInputAt = Date.now();
  inactivityFired.clear();

  printUserEcho(raw);
  const trimmed = raw.trim();
  if (!trimmed) return;

  state.history.push(trimmed);
  state.historyIndex = state.history.length;
  state.commandsCount++;

  // Try soft responses first (full-string match)
  if (await handleSoft(trimmed)) {
    maybeAdvance();
    return;
  }

  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (cmd in commands) {
    try {
      await commands[cmd](args);
    } catch (e) {
      print(`Errore interno: ${e.message}. Registrato.`, "err");
    }
  } else {
    unknown(trimmed);
  }

  maybeAdvance();
}

function setupInput() {
  const input = document.getElementById("input");
  const terminal = document.getElementById("terminal");

  // Keep focus on input when clicking anywhere
  terminal.addEventListener("click", () => {
    if (!input.disabled) input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = input.value;
      input.value = "";
      handleCommand(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (state.history.length > 0) {
        state.historyIndex = Math.max(0, state.historyIndex - 1);
        input.value = state.history[state.historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (state.historyIndex < state.history.length) {
        state.historyIndex++;
        input.value = state.history[state.historyIndex] || "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      print("Autocompletamento disabilitato. SYS preferisce le scelte consapevoli.", "dim");
    }
  });
}

// ---- Boot ----
(async function boot() {
  setupInput();
  await welcome();
  focusInput();
})();
