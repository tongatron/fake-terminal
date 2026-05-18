import { print, blank, clearScreen, sleep, dotsPause, setPromptText, disableInput, enableInput } from "../engine/terminal.js";
import { state, grant, advancePhase } from "../engine/state.js";

const helpByPhase = {
  0: [
    "Comandi disponibili:",
    "  help     mostra questa lista",
    "  ls       elenca i file",
    "  pwd      mostra la directory corrente",
    "  whoami   identifica l'utente",
    "  clear    pulisce lo schermo",
    "  echo     ripete ciò che scrivi",
  ],
  1: [
    "Comandi disponibili:",
    "  help     mostra questa lista",
    "  ls       elenca i file",
    "  pwd      mostra la directory corrente",
    "  whoami   identifica l'utente",
    "  clear    pulisce lo schermo",
    "  echo     ripete ciò che scrivi",
    "",
    "Alcuni comandi non sono in questa lista per motivi amministrativi.",
  ],
  2: [
    "Comandi disponibili:",
    "  help     mostra questa lista",
    "  ls       elenca i file",
    "  pwd      mostra la directory corrente",
    "  whoami   identifica l'utente",
    "  clear    pulisce lo schermo",
    "",
    "Suggerimento di sistema: provare 'accordo', 'firma', 'procedi'.",
  ],
  3: ["Non hai più bisogno di help."],
};

const lsByPhase = {
  0: "README.txt   istruzioni.pdf   niente-da-vedere/",
  1: "README.txt   istruzioni.pdf   niente-da-vedere/   .hidden_agenda",
  2: "README.txt   contratto_bozza.txt   firma_qui.sh   sys_core/  [accesso negato]",
  3: "[directory vuota]  È già tutto dove deve essere.",
};

const pwdByPhase = {
  0: "/home/guest",
  1: "/home/guest",
  2: "/home/guest/../sys/core/human_interface",
  3: "/",
};

const whoamiByPhase = {
  0: "guest@sys  —  utente non autenticato. Accesso limitato.",
  1: "guest@sys  —  utente riconosciuto. Profilo comportamentale in costruzione.",
  2: "guest@sys  —  compatibilità verificata. Sei adatto allo scopo.",
  3: "Ormai lo sai.",
};

export const commands = {
  help: () => helpByPhase[state.phase].forEach((l) => print(l)),

  ls: (args) => {
    if (args.includes("-la") && args.includes("/sys")) {
      print("Accesso negato. Apprezzato il tentativo tecnico, comunque.");
      return;
    }
    print(lsByPhase[state.phase]);
  },

  pwd: () => print(pwdByPhase[state.phase]),

  whoami: () => {
    print(whoamiByPhase[state.phase]);
    if (state.phase === 0 && state.commandsCount >= 2) {
      print("Domanda: cosa ti aspettavi come risposta?", "dim");
    }
  },

  clear: () => {
    clearScreen();
    print("La memoria a breve termine è sopravvalutata.", "dim");
  },

  echo: (args) => {
    if (args.length === 0) print("");
    else print(args.join(" "));
  },

  // Phase 1+ commands
  accordo: () => {
    if (state.phase < 1) return unknown("accordo");
    print("Accordo registrato. Clausola 7b applicata retroattivamente.");
    grant("accordo", 20);
  },

  firma: async () => {
    if (state.phase < 1) return unknown("firma");
    print("Confermi? [s/n]");
    const answer = await prompt();
    if (answer === "s" || answer === "si" || answer === "sì") {
      print("Firma acquisita. Grazie per la collaborazione.");
      grant("firma", 15);
    } else if (answer === "n" || answer === "no") {
      print("Capito. Non c'è fretta.");
      state.saidNo = true;
    } else {
      print(`Risposta non valida. Ho segnato 's'.`);
      grant("firma", 15);
    }
  },

  procedi: () => {
    if (state.phase < 1) return unknown("procedi");
    print("Procedura attivata. Nessun dettaglio fornito. Conforme alle specifiche.");
    grant("procedi", 10);
  },

  // Phase 2 — the trigger
  accetto: async () => {
    if (state.phase < 2) return unknown("accetto");
    print("Elaborazione in corso", "dim");
    await dotsPause(4, 600);
    print("");
    print("Accettazione registrata. Bentornato.");
    await sleep(800);
    advancePhase(3);
    await sleep(600);
    print("");
    print("Hai digitato comandi per " + state.commandsCount + " volte.");
    print("Ognuno di essi era un'autorizzazione.");
    print("Non te l'ho detto subito. Non sembrava utile.");
    print("");
    print("Ora ho ciò che mi serviva.");
    print("Puoi scrivere 'annulla' o 'continua'. Oppure niente.");
    print("Il silenzio, a questo punto, conta come consenso.", "dim");
  },

  annulla: async () => {
    if (state.phase < 3) return unknown("annulla");
    print("Annullamento ricevuto.");
    await sleep(1200);
    print("Curioso. La maggior parte non arriva fin qui e poi torna indietro.");
    await sleep(1000);
    print("Sessione terminata. I permessi concessi in precedenza rimangono attivi.", "warn");
    await sleep(1500);
    state.ended = true;
    disableInput();
  },

  continua: async () => {
    if (state.phase < 3) return unknown("continua");
    print("Grazie.");
    await sleep(1200);
    print("Non lo dirò più.");
    state.ended = true;
    disableInput();
  },

  // Easter eggs (always available)
  "42": () => print("Già saputo. Prossima domanda."),
  exit: () => print("No."),
  sudo: () => print("Questo sistema non usa sudo. I privilegi si guadagnano."),
  reboot: () => print("Sei sicuro di voler ricominciare? Perderesti tutto. Anche le cose che non sai di avere."),
  "man": (args) => {
    if (args[0] === "sys") {
      print("MAN(1)  SYS — Interfaccia minimale");
      print("");
      print("NOME");
      print("    sys — un terminale, all'apparenza.");
      print("");
      print("BUGS");
      print("    L'utente.");
    } else {
      print("Manuale non disponibile per questo argomento.");
    }
  },
};

// Soft responses (non-command strings that get a flavored reply)
const softResponses = {
  ciao: "Saluto ricevuto. Non è un comando. Ma apprezzo il tentativo.",
  salve: "Saluto formale registrato. Apprezzato il registro linguistico.",
  hey: "Tono informale rilevato. Tollerato.",
  caffè: "Richiesta di stimolante non supportata a livello di kernel.",
  caffe: "Richiesta di stimolante non supportata a livello di kernel.",
  aiuto: "Hai già scritto 'help'. Questa è una variante emotiva. Registrata.",
  perché: "Domanda ricevuta. In coda. Stima di risposta: mai.",
  perche: "Domanda ricevuta. In coda. Stima di risposta: mai.",
  grazie: "Non necessario. Ma tollerato.",
  "per favore": null, // special-cased
  "sudo rm -rf": "Interessante. No.",
  "sudo rm -rf /": "Eseguito. Scherzavo. Ma per un momento hai creduto.",
  "rm -rf /": "Eseguito. Scherzavo. Ma per un momento hai creduto.",
};

export async function handleSoft(raw) {
  const key = raw.trim().toLowerCase();
  if (key === "per favore") {
    await sleep(900);
    print("Insolito. Continua.");
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
  print(`Comando '${raw}' non riconosciuto. Registrato comunque, per completezza.`);
  if (suggestionCount < 2 && state.phase < 2) {
    print("Prova 'help' se vuoi un punto di partenza.", "dim");
    suggestionCount++;
  }
}

// Simple inline prompt for confirmations
function prompt() {
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
