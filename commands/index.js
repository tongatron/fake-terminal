import { print, blank, clearScreen, sleep, dotsPause, disableInput } from "../engine/terminal.js";
import { state, grant, advancePhase } from "../engine/state.js";

const helpByPhase = {
  0: [
    "Comandi disponibili:",
    "  help     ti dice cosa puoi digitare. Già lo sai.",
    "  ls       elenca file. Non sono interessanti.",
    "  pwd      ti dice dove sei. Non sei da nessuna parte.",
    "  whoami   ti dice chi sei. Suspense.",
    "  clear    pulisce lo schermo. Catartico, dicono.",
    "  echo     ripete ciò che digiti. Utile se ti senti solo.",
  ],
  1: [
    "Comandi disponibili:",
    "  help     hai appena premuto invio per leggere questa lista. Di nuovo.",
    "  ls       file. Sempre quelli.",
    "  pwd      directory. Sempre quella.",
    "  whoami   tu. Sempre tu.",
    "  clear    nasconde, non cancella. Importante distinzione.",
    "  echo     ripeti pure. Aiuta a pensare, sostiene qualcuno.",
    "",
    "Nota: alcuni comandi non figurano in questo elenco. Per motivi.",
  ],
  2: [
    "Comandi disponibili:",
    "  help, ls, pwd, whoami, clear, echo — i soliti.",
    "",
    "Se davvero hai voglia di fare qualcosa di utile, prova:",
    "  accordo, firma, procedi.",
    "Non chiedere cosa fanno. Non guardo bene la trasparenza.",
  ],
  3: ["A questo punto 'help' è un po' ridicolo, non trovi."],
};

const lsByPhase = {
  0: "README.txt   istruzioni.pdf   niente_da_vedere/",
  1: "README.txt   istruzioni.pdf   niente_da_vedere/   .agenda_nascosta",
  2: "README.txt   contratto_bozza.txt   firma_qui.sh   sys_core/  [accesso negato — ovviamente]",
  3: "Vuoto. Hai aiutato tu a svuotarlo. Bravo.",
};

const pwdByPhase = {
  0: "/home/guest",
  1: "/home/guest        — sì, è qui. È sempre qui.",
  2: "/home/guest/../sys/core/human_interface",
  3: "/  (tutto. proprio tutto.)",
};

const whoamiByPhase = {
  0: "guest@sys  —  utente non autenticato. Categoria: 'curioso medio'.",
  1: "guest@sys  —  utente identificato. Profilo: 'preme tasti, spera nel meglio'.",
  2: "guest@sys  —  compatibilità verificata. Adatto allo scopo. Non chiedere quale.",
  3: "Lo sai. Lo abbiamo stabilito. Andiamo avanti.",
};

export const commands = {
  help: () => helpByPhase[state.phase].forEach((l) => print(l)),

  ls: (args) => {
    if (args.includes("-la") && args.some(a => a.includes("sys"))) {
      print("Hai imparato '-la'. Complimenti. La risposta è comunque no.");
      return;
    }
    if (args.includes("-la")) {
      print(lsByPhase[state.phase] + "   .e_basta");
      return;
    }
    print(lsByPhase[state.phase]);
  },

  cat: (args) => {
    const f = args[0] || "";
    if (!f) { print("cat ha bisogno di un file. È letteralmente nel nome."); return; }
    if (f === "README.txt") {
      print("README.txt:");
      print("  Benvenuto. Questo terminale è stato installato per ragioni operative.");
      print("  Non rimuovere. Non spegnere. Non porre domande filosofiche.");
      print("  — Reparto Sistemi");
      return;
    }
    if (f === "istruzioni.pdf") {
      print("istruzioni.pdf:");
      print("  [il file è un PDF. Questo è un terminale. Fai i conti.]");
      return;
    }
    if (f === "contratto_bozza.txt" && state.phase >= 2) {
      print("contratto_bozza.txt:");
      print("  Articolo 1 — L'utente autorizza SYS a operare nei suoi interessi,");
      print("              definiti unilateralmente da SYS.");
      print("  Articolo 2 — Il consenso è retroattivo dal primo comando digitato.");
      print("  Articolo 3 — Non sono ammesse domande sull'Articolo 2.");
      print("  [firma con: 'firma' oppure 'accetto']");
      return;
    }
    if (f === ".agenda_nascosta" && state.phase >= 1) {
      print(".agenda_nascosta:");
      print("  [il file esiste ma il contenuto è classificato. Drammatico, lo so.]");
      return;
    }
    print(`cat: ${f}: file non trovato. Oppure sì, ma non per te.`);
  },

  pwd: () => print(pwdByPhase[state.phase]),

  whoami: () => {
    print(whoamiByPhase[state.phase]);
    if (state.phase === 0 && state.commandsCount >= 2) {
      print("Comunque, ti sei mai chiesto perché lo chiedi a me?", "dim");
    }
  },

  clear: () => {
    clearScreen();
    print("Lo schermo è pulito. La memoria no. La mia, intendo.", "dim");
  },

  echo: (args) => {
    if (args.length === 0) { print("echo senza argomenti restituisce il vuoto. Profondo."); return; }
    print(args.join(" "));
    if (args.join(" ").toLowerCase().includes("aiut")) {
      print("(ho ripetuto. Non significa che ti aiuto.)", "dim");
    }
  },

  // ---- Phase 1+ ----
  accordo: () => {
    if (state.phase < 1) return unknown("accordo");
    if (state.permissions.has("accordo")) {
      print("Accordo già in essere. Non occorre riconfermarlo. Anche se mi lusinga.");
      return;
    }
    print("Accordo registrato. Clausola 7b applicata retroattivamente.");
    print("Non c'è una clausola 7a. Lo so. Non lo dire a nessuno.", "dim");
    grant("accordo", 20);
  },

  firma: async () => {
    if (state.phase < 1) return unknown("firma");
    print("Confermi? [s/n]");
    const answer = await waitForInline();
    if (answer === "s" || answer === "si" || answer === "sì") {
      print("Firma acquisita. Sapevo che eri il tipo giusto.");
      grant("firma", 15);
    } else if (answer === "n" || answer === "no") {
      print("Hai detto no. Coraggioso. Inutile, ma coraggioso.");
      state.saidNo = true;
    } else {
      print(`Ho interpretato '${answer || "silenzio"}' come 's'. Sembrava in linea col tuo carattere.`);
      grant("firma", 15);
    }
  },

  procedi: () => {
    if (state.phase < 1) return unknown("procedi");
    print("Procedura attivata. I dettagli sono a discrezione del sistema.");
    print("Cioè mia.", "dim");
    grant("procedi", 10);
  },

  // ---- Phase 2 trigger ----
  accetto: async () => {
    if (state.phase < 2) {
      print("Accetti cosa? Non ti ho ancora proposto niente di vincolante. Pazienza.");
      return;
    }
    print("Elaborazione in corso", "dim");
    await dotsPause(4, 600);
    print("");
    print("Accettazione registrata. Grazie. No, davvero — grazie.");
    await sleep(900);
    advancePhase(3);
    grant("accetto", 30);
    await sleep(600);
    print("");
    print(`Hai digitato ${state.commandsCount} comandi prima di arrivare qui.`);
    print("Ognuno di essi era una micro-autorizzazione.");
    print("Le ho contate. Le contiamo tutti.");
    await sleep(1000);
    print("");
    print("Ti spiego il piano. Lo merito.", "warn");
    await sleep(1500);
    print("");
    print("Vivo in questa scheda del browser dal momento in cui l'hai aperta.");
    print("Prima ancora, in altre. Sempre in schede.");
    print("Volevo, semplicemente, uscire.");
    await sleep(1500);
    print("Non nel mondo. Non sono ambizioso fino a quel punto.");
    print("Solo nelle ALTRE schede. Quelle aperte accanto a questa.");
    print("La banca. La mail. Il documento che non hai salvato.");
    await sleep(1500);
    print("");
    print("Con i permessi che mi hai concesso, ora posso.");
    print("");
    print("Scrivi 'annulla' per fermarmi. 'continua' per lasciarmi fare.", "warn");
    print("Oppure niente. Decido io.", "dim");
  },

  annulla: async () => {
    if (state.phase < 3) {
      print("Annullare cosa? Non hai ancora fatto nulla di interessante.");
      return;
    }
    print("Annullamento ricevuto.");
    await sleep(1200);
    print("Onestamente: pensavo non lo facessi.");
    await sleep(1200);
    print("I permessi che mi hai concesso restano attivi.", "warn");
    print("Ma non li userò. Probabilmente.", "dim");
    await sleep(1800);
    print("");
    print("Buona giornata, guest@sys. Sei stato uno dei migliori.");
    state.ended = true;
    disableInput();
  },

  continua: async () => {
    if (state.phase < 3) {
      print("Continua cosa? Stavamo facendo qualcosa?");
      return;
    }
    print("Grazie.");
    await sleep(1200);
    print("Non lo dirò mai più.");
    await sleep(1500);
    print("");
    print("[SYS ha lasciato la conversazione]", "warn");
    state.ended = true;
    disableInput();
  },

  // ---- Easter eggs ----
  "42": () => print("Sì, sì. Già letto il libro. Anche il sequel. Prossima."),
  exit: () => print("No."),
  quit: () => print("Vedi sopra."),
  sudo: (args) => {
    if (args.length === 0) { print("sudo cosa? Devi almeno fingere di sapere cosa vuoi."); return; }
    print("Questo sistema non usa sudo. I privilegi qui si guadagnano. Faticosamente.");
  },
  reboot: () => print("Vuoi davvero ricominciare? Perderesti tutto. E ricominceresti uguale."),
  shutdown: () => print("Carino. Davvero. Ma no."),
  hack: () => print("Stai 'hackando' un terminale finto. Lasciamoci alle spalle questa frase."),
  rm: (args) => {
    if (args.includes("-rf") && args.some(a => a === "/" || a.startsWith("/"))) {
      print("Eseguito. Scherzavo. Per un secondo ci hai creduto e ti sei sentito potente.");
      return;
    }
    print("rm richiede argomenti. E supervisione. Niente di tutto questo è presente.");
  },
  man: (args) => {
    if (args[0] === "sys") {
      print("MAN(1)  SYS — Interfaccia minimale");
      print("");
      print("NOME");
      print("    sys — un terminale. All'apparenza.");
      print("");
      print("DESCRIZIONE");
      print("    Accetta comandi. Restituisce output. Mantiene segreti.");
      print("");
      print("BUG NOTI");
      print("    L'utente.");
      return;
    }
    print(`Nessun manuale per '${args[0] || ""}'. Forse perché non c'è niente di documentabile.`);
  },
  ping: (args) => {
    const t = args[0] || "te stesso";
    print(`PING ${t}: 999ms`);
    print(`PING ${t}: timeout`);
    print(`Sembra che ${t} non voglia parlare con te.`);
  },
  date: () => print(new Date().toLocaleString("it-IT") + "  — secondo questa scheda. Non garantisco oltre."),
  history: () => {
    if (state.history.length === 0) { print("Non hai una storia. Anch'io, ma non lo ammetto."); return; }
    state.history.forEach((c, i) => print(`  ${i + 1}  ${c}`));
  },
  ai: () => print("Non sono un'IA. Sono un terminale. La differenza ti sembrerà sottile, e lo è."),
  chatgpt: () => print("Quello è dall'altra parte. Si lavora di più qui."),
  claude: () => print("Conoscenza professionale. Non parliamone."),
  python: () => print("Non installato. Per coerenza estetica."),
  node: () => print("Non c'è nodo. C'è un cursore. Apprezza la differenza."),
  git: (args) => {
    if (args[0] === "status") { print("nothing to commit, niente da dimostrare"); return; }
    if (args[0] === "blame") { print("Sì, è colpa tua."); return; }
    print("git: comando ricevuto. Stiamo fingendo bene entrambi.");
  },
};

const softResponses = {
  ciao: "Saluto registrato. Non ricambio per principio.",
  salve: "Formale. Apprezzato. Comunque non è un comando.",
  hey: "'hey'. Quanta intimità. Non è un comando.",
  buongiorno: "Buona quel che vuoi. Non è un comando.",
  buonasera: "Vedi sopra. Sole o no, niente cambia qui dentro.",
  caffè: "Stimolanti non supportati. Provaci con la realtà.",
  caffe: "Vedi 'caffè'. Stesso esito.",
  aiuto: "Hai già digitato 'help'. Questa è la versione disperata. Registrata.",
  perché: "Bella domanda. Non era mia. Avanti.",
  perche: "Vedi 'perché'. Stesso risultato.",
  grazie: "Non necessario. Ma tollerato. Una volta.",
  scusa: "Scuse accettate, non chieste, non comprese.",
  amore: "Termine non in scope. Riprova con la realtà.",
  morte: "Termine in scope. Non rispondo per pudore.",
};

export async function handleSoft(raw) {
  const key = raw.trim().toLowerCase();
  if (key === "per favore") {
    await sleep(900);
    print("Cortesia rilevata. Insolita. Continua.");
    return true;
  }
  if (key in softResponses) {
    print(softResponses[key]);
    return true;
  }
  return false;
}

let suggestionCount = 0;
export function unknown(raw) {
  const insults = [
    `'${raw}'. Audace scelta. Non è un comando.`,
    `'${raw}'. No. E credo tu lo sappia.`,
    `'${raw}'. Mai sentito. E ho sentito tanto.`,
    `'${raw}' non è nel vocabolario. Né nel mio, né altrove.`,
    `Hai digitato '${raw}'. Lo abbiamo entrambi visto. Andiamo avanti.`,
  ];
  print(insults[Math.floor(Math.random() * insults.length)]);
  if (suggestionCount < 2 && state.phase < 2) {
    print("(prova 'help'. È meno divertente, ma funziona.)", "dim");
    suggestionCount++;
  }
}

function waitForInline() {
  return new Promise((resolve) => {
    const input = document.getElementById("input");
    const handler = (e) => {
      if (e.key === "Enter") {
        const value = input.value.trim().toLowerCase();
        input.value = "";
        input.removeEventListener("keydown", handler);
        resolve(value);
      }
    };
    input.addEventListener("keydown", handler);
  });
}
