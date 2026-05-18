import { print, printUserEcho, focusInput, sleep } from "./engine/terminal.js";
import { state } from "./engine/state.js";
import { commands, unknown } from "./commands/index.js";
import { intro, handleNarrativeInput } from "./story/narrative.js";

// ---- Inactivity (gentle, never pushy) ----
const inactivityMessages = [
  { at: 60,  text: "(nessuna fretta. Aspetto.)" },
  { at: 180, text: "(ci sei? Basta scrivere qualcosa quando vuoi.)" },
];
let inactivityFired = new Set();

function checkInactivity() {
  if (state.ended) return;
  const elapsed = (Date.now() - state.lastInputAt) / 1000;
  for (const m of inactivityMessages) {
    if (elapsed >= m.at && !inactivityFired.has(m.at)) {
      inactivityFired.add(m.at);
      print(m.text, "dim");
    }
  }
}
setInterval(checkInactivity, 2000);

// ---- Input handling ----
async function handleCommand(raw) {
  state.lastInputAt = Date.now();
  inactivityFired.clear();

  printUserEcho(raw);
  const trimmed = raw.trim();

  if (trimmed) {
    state.history.push(trimmed);
    state.historyIndex = state.history.length;
  }

  // During the narrative (or its lead-in), let the narrative consume input first.
  if (state.mode === "intro" || state.mode === "waiting_start" || state.mode === "narrative") {
    const handled = await handleNarrativeInput(trimmed);
    if (handled) return;
  }

  // Epilogue: try narrative-specific commands first, then fall through.
  if (state.mode === "epilogue") {
    const handled = await handleNarrativeInput(trimmed);
    if (handled) return;
  }

  // Free mode (after narrative, or after escape commands).
  if (!trimmed) return;

  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (cmd in commands) {
    try {
      await commands[cmd](args);
    } catch (e) {
      print(`(qualcosa non ha funzionato: ${e.message})`, "err");
    }
  } else {
    unknown(trimmed);
  }
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
    }
  });
}

(async function boot() {
  setupInput();
  focusInput();
  await intro();
})();
