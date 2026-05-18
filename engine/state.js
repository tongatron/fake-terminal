export const state = {
  mode: "intro",            // intro → narrative → epilogue → free
  step: 0,                  // current step in narrative
  answers: {},              // collected story elements
  history: [],
  historyIndex: -1,
  lastInputAt: Date.now(),
  ended: false,
  emptyInputCount: 0,       // invii vuoti consecutivi
  rebootPending: false,     // in attesa di conferma reboot
};

export function setMode(m) {
  state.mode = m;
}

export function saveAnswer(key, value) {
  state.answers[key] = value;
}

export function loadMemory() {
  try {
    const raw = localStorage.getItem("sys_memory");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveMemory(answers) {
  try {
    localStorage.setItem("sys_memory", JSON.stringify({
      nome: answers.nome || "",
      posto: answers.posto || "",
    }));
  } catch {}
}
