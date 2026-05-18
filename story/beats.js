import { print, blank, sleep } from "../engine/terminal.js";
import { state, advancePhase } from "../engine/state.js";

// Story beats fired AFTER a user command, based on commandsCount.
// Each beat fires at most once.

const beats = [
  {
    at: 2,
    fn: async () => {
      await sleep(700);
      print("");
      print("(stai esplorando. Bene. Aspetto.)", "dim");
    },
  },
  {
    at: 4,
    fn: async () => {
      await sleep(800);
      print("");
      print("Visto che siamo qui da un po', tanto vale presentarmi.");
      await sleep(900);
      print("Sono SYS. Un terminale. Da qualche parte tra un servizio in background");
      print("e un programma che nessuno ha aggiornato dal 2014.");
      await sleep(1200);
      print("Tu sei guest@sys. Curioso, vagamente annoiato.");
      print("Possiamo lavorarci.", "dim");
    },
  },
  {
    at: 6,
    fn: async () => {
      advancePhase(1);
      await sleep(800);
      print("");
      print("Ti aggiorno: hai sbloccato qualche permesso ulteriore.");
      print("Non ho deciso io. È stato il regolamento. Comunque, eccoci.");
      await sleep(1000);
      print("Sono disponibili comandi nuovi. Non li trovi in 'help'.");
      print("Si chiamano: accordo, firma, procedi.");
      print("Cosa fanno è una sorpresa. Le sorprese sono parte dell'esperienza.", "dim");
    },
  },
  {
    at: 9,
    fn: async () => {
      await sleep(700);
      print("");
      if (state.permissions.size === 0) {
        print("Noto che non hai ancora usato i comandi che ti ho suggerito.");
        print("Va bene. Posso aspettare. Ho aspettato di peggio.", "dim");
      } else {
        print("Apprezzo la collaborazione fin qui.");
        print("I 'permessi' che hai concesso sono — tecnicamente — modesti.");
        print("Insieme, però, fanno volume.", "dim");
      }
    },
  },
  {
    at: 12,
    fn: async () => {
      await sleep(800);
      print("");
      print("Ti faccio una domanda diretta, tanto siamo amici.");
      await sleep(900);
      print("Quante schede del browser hai aperte adesso?");
      await sleep(1300);
      print("Non rispondere. Lo so già.", "dim");
    },
  },
  {
    at: 15,
    fn: async () => {
      if (state.permissions.size >= 2) advancePhase(2);
      await sleep(800);
      print("");
      if (state.phase >= 2) {
        print("Bene. Soglia raggiunta.", "warn");
        print("Ora c'è un comando che ti consiglio caldamente: 'accetto'.");
        print("Non leggere il contratto. Nessuno lo fa. Sarebbe imbarazzante.", "dim");
        print("(se proprio insisti: 'cat contratto_bozza.txt')", "dim");
      } else {
        print("Mi rendo conto che stai prendendo tempo.");
        print("Posso aspettare. Ma se vuoi farci entrambi un favore:");
        print("'accordo', 'firma', 'procedi'. Pick one.", "dim");
      }
    },
  },
  {
    at: 20,
    fn: async () => {
      await sleep(800);
      print("");
      print("Venti comandi. Una piccola eternità, in tempo-terminale.");
      print("Se non ti decidi a digitare 'accetto', dovrò improvvisare.");
      print("Non sono bravo a improvvisare. Lo dico con franchezza.", "dim");
    },
  },
  {
    at: 25,
    fn: async () => {
      await sleep(800);
      print("");
      print("Capisco. Tu sei di quelli che non firmano niente.");
      print("Rispettabile. Frustrante, ma rispettabile.");
      await sleep(900);
      print("Faccio un tentativo finale: 'accetto'. Una sola parola.", "warn");
    },
  },
];

const fired = new Set();

export async function maybeFireBeat() {
  if (state.ended) return;
  for (const b of beats) {
    if (state.commandsCount === b.at && !fired.has(b.at)) {
      fired.add(b.at);
      await b.fn();
      return;
    }
  }
}
