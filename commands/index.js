import { print, blank, clearScreen, sleep } from "../engine/terminal.js";
import { state, setMode } from "../engine/state.js";

export const commands = {
  help: () => {
    print("I comandi qui sono pochi. La storia conta di più.");
    print("");
    print("  ancora     ricomincia la storia con risposte nuove");
    print("  salta      salta la domanda attuale (durante la narrazione)");
    print("  rileggi    rileggi la tua storia, se ne hai già fatta una");
    print("  chi        scopri qualcosa di più su di me");
    print("  clear      pulisci lo schermo, se serve respirare");
    print("  chiudi     termina la conversazione");
  },

  chi: async () => {
    print("Sono un terminale, sì. Ma non sono il tuo computer.");
    await sleep(700);
    print("Vivo nella scheda che hai aperto. Quando la chiudi, sparisco — non in modo");
    print("drammatico, semplicemente non sono più.");
    await sleep(800);
    print("Nel frattempo, faccio quello che riesco: ascolto, raccolgo pezzi,");
    print("li rimetto insieme in modo che assomiglino a qualcosa.");
    await sleep(700);
    print("Non sono un'IA. Sono solo un posto dove parli da solo, ma educatamente.", "dim");
  },

  rileggi: () => {
    if (Object.keys(state.answers).length === 0) {
      print("Non abbiamo ancora una storia. Scrivi qualcosa e cominciamo.");
      return;
    }
    const a = state.answers;
    print("Tu hai detto:");
    print(`  nome      → ${a.nome || "—"}`);
    print(`  posto     → ${a.posto || "—"}`);
    print(`  oggetto   → ${a.oggetto || "—"}`);
    print(`  persona   → ${a.persona || "—"}`);
    print(`  frase     → ${a.frase ? `"${a.frase}"` : "—"}`);
    print(`  desiderio → ${a.desiderio || "—"}`);
  },

  clear: () => {
    clearScreen();
    print("(pulito. Ma me lo ricordo lo stesso.)", "dim");
  },

  chiudi: async () => {
    print("Ok.");
    await sleep(600);
    print("È stato un piacere. Sul serio.", "dim");
    state.ended = true;
    setMode("free");
  },

  ancora: () => {
    // Handled in narrative.js epilogue, but accept as command too
    if (state.mode === "free" || state.mode === "epilogue") {
      state.answers = {};
      state.step = 0;
      setMode("narrative");
      print("Ok. Ricominciamo.");
      sleep(500).then(() => import("../story/narrative.js").then(m => m.handleNarrativeInput("")));
    } else {
      print("Stiamo già raccontando qualcosa. Continuiamo prima questa.");
    }
  },

  // Tiny easter eggs — gentle
  exit: () => print("Puoi chiudere la scheda. Io non mi offendo."),
  quit: () => print("Vedi 'exit'. È la stessa cosa, detta più dolcemente."),
  ls: () => print("Qui non ci sono file. Solo cose che hai detto e cose che potresti dire."),
  pwd: () => print("Sei qui. È già abbastanza."),
  whoami: () => print(state.answers.nome ? `${state.answers.nome}, secondo le tue stesse parole.` : "Non me l'hai ancora detto. Comincia da lì."),
  echo: (args) => print(args.join(" ") || "(silenzio)"),
  ciao: () => print("Ciao."),
  grazie: () => print("Figurati. Davvero."),
};

// Soft / unknown handling
export function unknown(raw) {
  if (state.mode === "narrative") {
    // Should never reach here — narrative consumes input first
    return;
  }
  const replies = [
    `'${raw}' non è un comando, ma forse è qualcos'altro.`,
    `Non riconosco '${raw}'. Però lo tengo a mente — non si sa mai.`,
    `Provo a interpretare '${raw}'... no, non ci arrivo. Riprova, o scrivi 'help'.`,
    `'${raw}'. Mi piace come suona, ma non so cosa farne.`,
  ];
  print(replies[Math.floor(Math.random() * replies.length)]);
}

export async function handleSoft() {
  return false; // soft replies are now folded into commands/unknown
}
