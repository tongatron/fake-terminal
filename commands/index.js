import { print, blank, clearScreen, sleep, getOutputText } from "../engine/terminal.js";
import { state, setMode } from "../engine/state.js";

export const commands = {
  help: () => {
    print("I comandi qui sono pochi. La storia conta di più.");
    print("");
    print("  ancora     ricomincia la storia con risposte nuove");
    print("  salta      salta la domanda attuale (durante la narrazione)");
    print("  rileggi    rileggi la tua storia, se ne hai già fatta una");
    print("  salva      copia la storia negli appunti");
    print("  chi        scopri qualcosa di più su di me");
    print("  clear      pulisci lo schermo, se serve respirare");
    print("  chiudi     termina la conversazione");
    print("");
    print("(ci sono altri comandi. Non tutti sono ovvi.)", "dim");
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

  salva: async () => {
    const text = getOutputText();
    try {
      await navigator.clipboard.writeText(text);
      print("Copiato negli appunti. Ora è tuo.", "dim");
    } catch {
      print("(non riesco ad accedere agli appunti — seleziona e copia a mano.)", "dim");
    }
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

  // Easter eggs
  exit: () => print("Puoi chiudere la scheda. Io non mi offendo."),
  quit: () => print("Vedi 'exit'. È la stessa cosa, detta più dolcemente."),
  ls: () => print("Qui non ci sono file. Solo cose che hai detto e cose che potresti dire."),
  pwd: () => print("Sei qui. È già abbastanza."),
  whoami: () => print(state.answers.nome ? `${state.answers.nome}, secondo le tue stesse parole.` : "Non me l'hai ancora detto. Comincia da lì."),
  echo: (args) => print(args.join(" ") || "(silenzio)"),
  ciao: () => print("Ciao."),
  grazie: () => print("Figurati. Davvero."),
  sudo: () => {
    print("Questo sistema non usa sudo.");
    sleep(600).then(() => print("I privilegi si guadagnano.", "dim"));
  },
  "42": () => {
    print("Già saputo. Prossima domanda.");
  },
  man: (args) => {
    if (!args.length || args[0] === "sys") {
      print("SYS(1)                     Manuale Utente                    SYS(1)");
      blank();
      print("NOME");
      print("       sys — terminale con intenzioni narrative");
      blank();
      print("SINOSSI");
      print("       sys [risposta] ...");
      blank();
      print("DESCRIZIONE");
      print("       Raccoglie frammenti. Li rimette insieme.");
      print("       Non promette niente. A volte funziona lo stesso.");
      blank();
      print("COMANDI NOTI");
      print("       help, ancora, salta, rileggi, salva, chiudi");
      blank();
      print("BUG");
      print("       L'utente.");
      blank();
      print("SYS(1)                       2024                            SYS(1)", "dim");
    } else {
      print(`Nessun manuale per '${args[0]}'. Non tutto ha una spiegazione.`);
    }
  },
  reboot: async () => {
    print("Sei sicuro di voler ricominciare tutto?");
    await sleep(600);
    print("Perderesti quello che hai detto. Anche le cose che non sai di avere.", "dim");
    await sleep(800);
    print("Scrivi 'sì' per continuare — qualsiasi altra cosa per fermarti.", "dim");
    state.rebootPending = true;
  },
  storia: () => {
    if (Object.keys(state.answers).length === 0) {
      print("Non abbiamo ancora una storia. Comincia con 'ancora'.");
    } else {
      import("../story/narrative.js").then(m => m.handleNarrativeInput("rileggi"));
    }
  },
  date: () => {
    const d = new Date();
    print(`${d.toLocaleDateString("it-IT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`);
    sleep(500).then(() => print("(non so a cosa ti serva. Ma eccola.)", "dim"));
  },
  version: () => print("SYS v1.0 — nessun aggiornamento previsto. Funziona già."),
  ping: () => print("pong.", "dim"),
};

// Soft / unknown handling
export function unknown(raw) {
  if (state.mode === "narrative") {
    // Should never reach here — narrative consumes input first
    return;
  }

  // Rileva se l'utente ha scritto il proprio nome
  if (state.answers.nome && raw.toLowerCase() === state.answers.nome.toLowerCase()) {
    print(`Sì, sei tu.`);
    sleep(600).then(() => print("(almeno, sei quello che hai detto di essere.)", "dim"));
    return;
  }

  const replies = [
    `'${raw}' non è un comando, ma forse è qualcos'altro.`,
    `Non riconosco '${raw}'. Però lo tengo a mente — non si sa mai.`,
    `Provo a interpretare '${raw}'... no, non ci arrivo. Riprova, o scrivi 'help'.`,
    `'${raw}'. Mi piace come suona, ma non so cosa farne.`,
    `'${raw}'. Annotato, anche se non so dove.`,
  ];
  print(replies[Math.floor(Math.random() * replies.length)]);
}

export async function handleSoft() {
  return false; // soft replies are now folded into commands/unknown
}
