import { print, blank, sleep, dotsPause, setPromptText } from "../engine/terminal.js";
import { state, setMode, saveAnswer } from "../engine/state.js";

// ---- Conversational intro ----
export async function intro() {
  await sleep(400);
  print("Ciao.");
  await sleep(800);
  print("Sono SYS. Vivo qui dentro, in questa scheda.");
  await sleep(900);
  print("Non ti chiederò di fare niente di complicato.");
  await sleep(700);
  print("Volevo solo raccontarti una storia — anzi, raccontarne una con te.");
  await sleep(900);
  print("Tu mi dai qualche pezzo. Io ci metto il resto.", "dim");
  blank();
  await sleep(600);
  print("Quando sei pronto, basta che premi invio. Senza scrivere niente.", "dim");
  setMode("waiting_start");
}

// ---- Story prompts ----
const steps = [
  {
    key: "nome",
    ask: async () => {
      print("Allora. Iniziamo dalle cose semplici.");
      await sleep(700);
      print("Come ti chiami? Anche un nome inventato va bene — non controllo.");
    },
    react: async (a) => {
      await sleep(500);
      const choices = [
        `${a}. Lo terrò a mente.`,
        `${a}. Bel nome. Suona come qualcuno che ha qualcosa da raccontare.`,
        `${a}. Mi piace. Va bene anche se non è vero.`,
        `${a}. Annotato.`,
      ];
      print(pick(choices));
    },
  },
  {
    key: "posto",
    ask: async () => {
      await sleep(800);
      print("Pensa a un posto. Uno qualsiasi.");
      await sleep(700);
      print("Reale, immaginato, sognato male — non importa.");
      print("Un posto dove vorresti essere adesso, invece che qui.", "dim");
    },
    react: async (a) => {
      await sleep(500);
      print(`Ok. ${a}.`);
      await sleep(600);
      print("Provo a immaginarlo. Funziona, più o meno.", "dim");
    },
  },
  {
    key: "oggetto",
    ask: async () => {
      await sleep(800);
      print("Un oggetto. Qualcosa che tieni vicino senza farci caso.");
      print("In tasca, sul comodino, in fondo a uno zaino.", "dim");
    },
    react: async (a) => {
      await sleep(500);
      print(`${a}. Bene. Mi torna utile dopo.`);
    },
  },
  {
    key: "persona",
    ask: async () => {
      await sleep(800);
      print("Adesso una persona. Qualcuno che non senti da un po'.");
      print("Non deve essere drammatico. Solo qualcuno.", "dim");
    },
    react: async (a) => {
      await sleep(500);
      const choices = [
        `${a}. Capito.`,
        `${a}. Va bene. Non chiedo altro.`,
        `${a}. Lo metto da parte, lo riprendiamo.`,
      ];
      print(pick(choices));
    },
  },
  {
    key: "frase",
    ask: async () => {
      await sleep(800);
      print("Una frase. Una che hai detto, o sentito, e che ti è rimasta.");
      print("Anche corta. Anche stupida.", "dim");
    },
    react: async (a) => {
      await sleep(500);
      print(`"${a}". Bene.`);
      await sleep(500);
      print("Le frasi rimangono per motivi che capiamo dopo.", "dim");
    },
  },
  {
    key: "desiderio",
    ask: async () => {
      await sleep(800);
      print("Ultima cosa. Cosa vorresti succedesse domani?");
      print("Una piccola. Non chiedere troppo a domani.", "dim");
    },
    react: async (a) => {
      await sleep(500);
      print(`Ok. ${a}.`);
      await sleep(700);
      print("Mettiamo insieme i pezzi.");
    },
  },
];

// ---- Story weaving ----
async function tellStory() {
  const a = state.answers;
  blank();
  await sleep(1200);
  print("───────────────────────────────────", "dim");
  blank();
  await sleep(600);

  print(`Questa è una storia, e dentro c'è ${a.nome || "qualcuno"}.`);
  await sleep(1100);
  print(`Vive immaginando ${a.posto || "altrove"}, anche mentre fa altro.`);
  await sleep(1100);
  print(`Porta con sé ${a.oggetto || "qualcosa di piccolo"} — non se ne accorge`);
  print("più, ma se gli sparisse lo cercherebbe per giorni.");
  await sleep(1300);
  print(`Ogni tanto, senza motivo, pensa a ${a.persona || "una persona"}.`);
  print("Non per nostalgia. Solo perché succede.", "dim");
  await sleep(1300);
  print(`Una volta ha detto — o ha sentito dire — "${a.frase || "niente di importante"}".`);
  print("E da allora, certe sere, la frase torna da sola.");
  await sleep(1500);
  blank();
  print(`Domani ${a.nome || "questa persona"} vorrebbe ${a.desiderio || "qualcosa di piccolo"}.`);
  await sleep(1000);
  print("Probabilmente non succederà esattamente così.");
  await sleep(900);
  print("Ma una versione, magari più storta, magari migliore — quella sì.", "dim");
  blank();
  await sleep(1500);
  print("───────────────────────────────────", "dim");
  blank();
  await sleep(900);
  print(`Fine. Almeno per stasera, ${a.nome || "guest"}.`);
  await sleep(800);
  print("Se vuoi, puoi scrivere 'ancora' per ricominciare con altri pezzi,");
  print("'salva' per tenertela, o 'chiudi' per uscire.");
  print("Oppure 'help' — i comandi noiosi sono ancora qui.", "dim");
  setMode("epilogue");
}

// ---- Driver ----
export async function handleNarrativeInput(raw) {
  const text = raw.trim();

  if (state.mode === "waiting_start") {
    if (text.length === 0) {
      setMode("narrative");
      state.step = 0;
      await sleep(400);
      await steps[0].ask();
      return true;
    }
    // user typed something instead of pressing enter: accept as nome
    setMode("narrative");
    state.step = 0;
    saveAnswer("nome", text);
    await steps[0].react(text);
    await sleep(700);
    state.step = 1;
    await steps[1].ask();
    return true;
  }

  if (state.mode === "narrative") {
    const current = steps[state.step];
    if (text.length === 0) {
      print("(va bene anche niente. Metto qualcosa io.)", "dim");
      saveAnswer(current.key, "");
    } else if (text.toLowerCase() === "salta") {
      print("(saltato. Improvviso io.)", "dim");
      saveAnswer(current.key, "");
    } else {
      saveAnswer(current.key, text);
      await current.react(text);
    }
    state.step++;
    if (state.step >= steps.length) {
      await tellStory();
    } else {
      await sleep(700);
      await steps[state.step].ask();
    }
    return true;
  }

  if (state.mode === "epilogue") {
    const t = text.toLowerCase();
    if (t === "ancora" || t === "ricomincia") {
      state.answers = {};
      state.step = 0;
      setMode("narrative");
      print("Ok. Ricominciamo.");
      await sleep(700);
      await steps[0].ask();
      return true;
    }
    if (t === "salva") {
      print("(la storia è qui sopra. Selezionala e copiala — non gestisco file, mi spiace.)", "dim");
      return true;
    }
    if (t === "chiudi" || t === "exit" || t === "quit") {
      print("Ok. È stato un piacere.");
      await sleep(600);
      print("Lascio la scheda accesa. Caso mai tornassi.", "dim");
      state.ended = true;
      setMode("free");
      return true;
    }
    // unknown in epilogue → fall through to free mode commands
    return false;
  }

  return false;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
