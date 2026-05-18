const outputEl = () => document.getElementById("output");
const inputEl = () => document.getElementById("input");
const promptEl = () => document.getElementById("prompt");
const terminalEl = () => document.getElementById("terminal");

export function print(text, cls = "sys") {
  const line = document.createElement("span");
  line.className = `line ${cls}`;
  line.textContent = text;
  outputEl().appendChild(line);
  scrollToBottom();
}

export function printRaw(text) {
  print(text, "dim");
}

export function printUserEcho(cmd) {
  const line = document.createElement("span");
  line.className = "line user";
  line.textContent = `SYS> ${cmd}`;
  outputEl().appendChild(line);
  scrollToBottom();
}

export function blank() {
  const br = document.createElement("span");
  br.className = "line";
  br.textContent = " ";
  outputEl().appendChild(br);
  scrollToBottom();
}

export function clearScreen() {
  outputEl().innerHTML = "";
}

export function scrollToBottom() {
  const t = terminalEl();
  t.scrollTop = t.scrollHeight;
}

export function setPromptText(txt) {
  promptEl().textContent = txt;
}

export function focusInput() {
  inputEl().focus();
}

export function getInput() {
  return inputEl();
}

export function disableInput() {
  inputEl().disabled = true;
}

export function enableInput() {
  inputEl().disabled = false;
  focusInput();
}

export function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function typeLine(text, cls = "sys", delay = 0) {
  if (delay > 0) await sleep(delay);
  print(text, cls);
}

export async function dotsPause(count = 3, intervalMs = 500) {
  const line = document.createElement("span");
  line.className = "line dim";
  outputEl().appendChild(line);
  for (let i = 0; i < count; i++) {
    line.textContent += ".";
    scrollToBottom();
    await sleep(intervalMs);
  }
}
