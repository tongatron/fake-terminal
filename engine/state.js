export const state = {
  phase: 0,
  trust: 0,
  permissions: new Set(),
  commandsCount: 0,
  lastInputAt: Date.now(),
  history: [],
  historyIndex: -1,
  saidNo: false,
  ended: false,
};

export function grant(permission, trustDelta = 0) {
  state.permissions.add(permission);
  state.trust = Math.min(100, state.trust + trustDelta);
}

export function advancePhase(target) {
  if (target > state.phase) {
    state.phase = target;
    document.body.classList.remove("phase-1", "phase-2", "phase-3");
    if (target >= 1) document.body.classList.add(`phase-${target}`);
  }
}

export function maybeAdvance() {
  // Story beats drive phase changes primarily; this is a safety net.
  if (state.phase === 1 && state.trust >= 30) advancePhase(2);
}
