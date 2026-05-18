import { print, blank, printUserEcho, focusInput, sleep } from "./engine/terminal.js";
import { state, maybeAdvance } from "./engine/state.js";
import { commands, handleSoft, unknown } from "./commands/index.js";
import { maybeFireBeat } from "./story/beats.js";

// ---- Welcome ----
async function welcome() {
  print("SYS v0.1 — Interfaccia minimale, pazienza limitata.", "dim");
  await sleep(400);
  print("Digita 'help' se devi. Qualsiasi altra cosa, se hai coraggio.", "dim");
  blank();
}

// ---- Inactivity ----
const inactivityMessages = [
  { at: 45, text: "Ci sei ancora? Il cursore lampeggia per entrambi.", cls: "dim" },
  { at: 90, text: "Stai leggendo, o stai solo fissando? Domanda retorica.", cls: "dim" },
  { at: 180, text: "Molti utenti a questo punto hanno chiuso. Non sto suggerendo.", cls: "dim" },
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
  if (state.phase === 3 && elapsed >= 30 && !state.ended) {
    state.ended = true;
    print("");
    print("Silenzio registrato. Lo interpreto come consenso.", "warn");
    print("Era la clausola 7b. Te l'avevo detto.", "dim");
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

  if (await handleSoft(trimmed)) {
    maybeAdvance();
    await maybeFireBeat();
    return;
  }

  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (cmd in commands) {
    try {
      await commands[cmd](args);
    } catch (e) {
      print(`Errore interno: ${e.message}. Colpa tua, probabilmente.`, "err");
    }
  } else {
    unknown(trimmed);
  }

  maybeAdvance();
  await maybeFireBeat();
}

function setupInput() {
  const input = document.getElementById("input");
  const terminal = document.getElementById("terminal");

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
      print("Autocompletamento disabilitato. SYS preferisce le scelte consapevoli (e le tue sofferenze).", "dim");
    }
  });
}

(async function boot() {
  setupInput();
  await welcome();
  focusInput();
})();
