export const state = {
  mode: "intro",            // intro → narrative → epilogue → free
  step: 0,                  // current step in narrative
  answers: {},              // collected story elements
  history: [],
  historyIndex: -1,
  lastInputAt: Date.now(),
  ended: false,
};

export function setMode(m) {
  state.mode = m;
}

export function saveAnswer(key, value) {
  state.answers[key] = value;
}
