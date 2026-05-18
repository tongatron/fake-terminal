import { print, blank, sleep, dotsPause, setPromptText } from "../engine/terminal.js";
import { state, setMode, saveAnswer, loadMemory, saveMemory } from "../engine/state.js";

// ---- Conversational intro ----
export async function intro() {
  const mem = loadMemory();

  await sleep(400);
  print("Ciao.");
  await sleep(800);

  if (mem && mem.nome) {
    print(`Sei già stato qui, ${mem.nome}.`);
    await sleep(900);
    if (mem.posto) {
      print(`L'ultima volta stavi pensando a ${mem.posto}.`);
      await sleep(800);
    }
    print("Questa volta racconto qualcosa di diverso.", "dim");
    await sleep(900);
  } else {
    print("Sono SYS. Vivo qui dentro, in questa scheda.");
    await sleep(900);
    print("Non ti chiederò di fare niente di complicato.");
    await sleep(700);
    print("Volevo solo raccontarti una storia — anzi, raccontarne una con te.");
    await sleep(900);
    print("Tu mi dai qualche pezzo. Io ci metto il resto.", "dim");
  }

  blank();
  await sleep(600);
  print("Quando sei pronto, scrivi qualcosa qui sotto e premi invio — o premi invio e basta.", "dim");
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
      if (a.length <= 3) {
        print(`${a}. Corto. Va benissimo.`);
      } else if (a.length > 30) {
        print(`${a}.`);
        await sleep(500);
        print("Hai pensato a come ti chiami. Interessante.", "dim");
      } else {
        const choices = [
          `${a}. Lo terrò a mente.`,
          `${a}. Bel nome. Suona come qualcuno che ha qualcosa da raccontare.`,
          `${a}. Mi piace. Va bene anche se non è vero.`,
          `${a}. Annotato.`,
        ];
        print(pick(choices));
      }
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
      const uncertain = ["boh", "non so", "non lo so", "ovunque", "da nessuna parte", "qui"];
      if (uncertain.some(w => a.toLowerCase().includes(w))) {
        print(`${a}.`);
        await sleep(700);
        print("Capito. È già una risposta, in realtà.", "dim");
      } else if (a.length <= 4) {
        print(`${a}.`);
        await sleep(600);
        print("Vicino o lontano?", "dim");
        await sleep(900);
        print("Non rispondere — me lo segno così.", "dim");
      } else {
        print(`Ok. ${a}.`);
        await sleep(600);
        print("Provo a immaginarlo. Funziona, più o meno.", "dim");
      }
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
      const noOne = ["nessuno", "non lo so", "boh", "non saprei"];
      if (noOne.some(w => a.toLowerCase().includes(w))) {
        print("Ok.");
        await sleep(600);
        print("Anche questo è una risposta.", "dim");
      } else if (a.length > 40) {
        print(`${a}.`);
        await sleep(700);
        print("Hai detto più di quanto chiedessi. Annotato.", "dim");
      } else {
        const choices = [
          `${a}. Capito.`,
          `${a}. Va bene. Non chiedo altro.`,
          `${a}. Lo metto da parte, lo riprendiamo.`,
        ];
        print(pick(choices));
      }
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

// ---- Templates ----

async function templateNarrativo(a) {
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
}

async function templateLettera(a) {
  print(`${a.nome || "tu"},`);
  await sleep(900);
  blank();
  print("non so se leggerai questo.");
  await sleep(800);
  print(`Però so che ogni tanto pensi a ${a.posto || "un posto"}.`);
  print("Anche quando non dovresti. Anche quando stai facendo altro.", "dim");
  await sleep(1300);
  blank();
  print(`Hai ${a.oggetto || "qualcosa"} — lo tieni vicino senza farci caso.`);
  await sleep(900);
  print(`E ogni tanto, per motivi che non sai spiegare, pensi a ${a.persona || "qualcuno"}.`);
  await sleep(1300);
  blank();
  print(`Quella frase — "${a.frase || "niente di importante"}" —`);
  await sleep(700);
  print("la sai a memoria, ormai.");
  print("Non hai deciso di impararla. È successo.", "dim");
  await sleep(1500);
  blank();
  print(`Domani vorresti ${a.desiderio || "qualcosa di piccolo"}.`);
  await sleep(900);
  print("Non chiedermi se succederà.");
  await sleep(700);
  print("Ma ci sono storie più strane di questa che sono andate a posto.", "dim");
  await sleep(1000);
  blank();
  print("SYS", "dim");
}

async function templateRapporto(a) {
  print(`SOGGETTO:    ${a.nome || "non specificato"}`);
  await sleep(700);
  print(`ULTIMA NOTA: desidera essere a ${a.posto || "altrove"}`);
  await sleep(1100);
  blank();
  print(`Oggetto personale identificato: ${a.oggetto || "non classificato"}.`);
  print("Conservato senza ragione apparente. Probabilmente essenziale.", "dim");
  await sleep(1300);
  blank();
  print(`Connessione emotiva non risolta con: ${a.persona || "persona non identificata"}.`);
  print("Classificazione: normale. Comune. Umana.", "dim");
  await sleep(1300);
  blank();
  print(`Frase in memoria a lungo termine: "${a.frase || "niente di importante"}".`);
  print("Origine sconosciuta. Rimozione non consigliata.", "dim");
  await sleep(1500);
  blank();
  print(`Previsione per domani: ${a.nome || "il soggetto"} vorrebbe ${a.desiderio || "qualcosa di piccolo"}.`);
  await sleep(900);
  print("Probabilità di riuscita esatta: bassa.");
  await sleep(700);
  print("Probabilità di qualcosa di adeguato: più alta di quanto sembri.", "dim");
  await sleep(1200);
  blank();
  print("Fine rapporto.", "dim");
  await sleep(600);
  print("(non era un rapporto. Era una storia. A volte funzionano meglio così.)", "dim");
}

async function templateFavola(a) {
  print(`C'era una volta ${a.nome || "qualcuno"}.`);
  await sleep(1100);
  print(`Viveva pensando a ${a.posto || "un posto lontano"}, anche mentre faceva altro.`);
  await sleep(1100);
  print(`Portava sempre con sé ${a.oggetto || "qualcosa di piccolo"} —`);
  print("come si fa con le cose importanti, senza sapere bene perché.");
  await sleep(1300);
  print(`Ogni tanto pensava a ${a.persona || "qualcuno"}.`);
  print("Le favole non spiegano questi pensieri. Li mettono dentro e basta.", "dim");
  await sleep(1300);
  print(`Una voce aveva detto, una volta: "${a.frase || "niente di importante"}".`);
  await sleep(800);
  print(`E ${a.nome || "questa persona"} non l'aveva dimenticato.`);
  await sleep(1500);
  blank();
  print(`Il giorno dopo, la storia voleva ${a.desiderio || "qualcosa di piccolo"}.`);
  await sleep(1000);
  print("Le favole non promettono niente.");
  await sleep(800);
  print("Ma le cose più piccole, a volte, succedono davvero.", "dim");
}

async function templateTu(a) {
  print(`Sei ${a.nome || "tu"}, anche se forse non te lo ricordi spesso.`);
  await sleep(1100);
  print(`Stai pensando a ${a.posto || "un posto"}.`);
  print("Anche adesso, mentre leggi questo.", "dim");
  await sleep(1300);
  print(`Hai ${a.oggetto || "qualcosa"} da qualche parte vicino — non ci fai più caso, ma è lì.`);
  await sleep(1100);
  print(`Ogni tanto, senza motivo, pensi a ${a.persona || "qualcuno"}.`);
  print("Non cercare un motivo. Non ce n'è uno buono.", "dim");
  await sleep(1300);
  print(`Quella frase — "${a.frase || "niente di importante"}" — la sai.`);
  await sleep(1500);
  blank();
  print(`Domani vorresti ${a.desiderio || "qualcosa di piccolo"}.`);
  await sleep(900);
  print("Forse succede.");
  await sleep(700);
  blank();
  print(`Sei ancora ${a.nome || "tu"}.`, "dim");
}

async function templateTelegramma(a) {
  print(`DESTINATARIO: ${(a.nome || "sconosciuto").toUpperCase()} STOP`);
  await sleep(800);
  print(`ULTIMA POSIZIONE NOTA: ${(a.posto || "non specificata").toUpperCase()} STOP`);
  await sleep(800);
  print(`OGGETTO IN POSSESSO: ${(a.oggetto || "non classificato").toUpperCase()} STOP`);
  await sleep(800);
  print(`CONNESSIONE IRRISOLTA: ${(a.persona || "nessuna").toUpperCase()} STOP`);
  await sleep(800);
  print(`MESSAGGIO IN MEMORIA: "${a.frase || "niente di importante"}" STOP`);
  await sleep(1000);
  print(`RICHIESTA PER DOMANI: ${(a.desiderio || "non specificato").toUpperCase()} STOP`);
  await sleep(1200);
  blank();
  print("NOTA: storia ricevuta. STOP", "dim");
  await sleep(700);
  print("NOTA: era bella. STOP", "dim");
  await sleep(700);
  print("FINE TRASMISSIONE STOP", "dim");
}

// ---- Template selection ----

const templateMap = {
  "1": templateNarrativo, racconto: templateNarrativo,
  "2": templateLettera,   lettera: templateLettera,
  "3": templateRapporto,  rapporto: templateRapporto,
  "4": templateFavola,    favola: templateFavola,
  "5": templateTu,        tu: templateTu, seconda: templateTu,
  "6": templateTelegramma, telegramma: templateTelegramma,
};

const allTemplates = [
  templateNarrativo, templateLettera, templateRapporto,
  templateFavola, templateTu, templateTelegramma,
];

async function askTemplate() {
  blank();
  await sleep(900);
  print("Con questi pezzi posso raccontarla in modi diversi.");
  await sleep(700);
  blank();
  print("  1  racconto     terza persona, tono riflessivo");
  print("  2  lettera      SYS scrive direttamente a te");
  print("  3  rapporto     formato tecnico, quasi");
  print("  4  favola       c'era una volta");
  print("  5  tu           seconda persona, tempo presente");
  print("  6  telegramma   ultra-breve, stile STOP");
  blank();
  print("(scrivi il numero o il nome — o premi invio per una scelta casuale)", "dim");
  setMode("choosing_template");
}

async function tellStory(templateFn) {
  const a = state.answers;
  blank();
  await sleep(1200);
  print("───────────────────────────────────", "dim");
  blank();
  await sleep(600);

  await templateFn(a);

  blank();
  await sleep(1500);
  print("───────────────────────────────────", "dim");
  blank();
  await sleep(900);
  print(`Fine. Almeno per stasera, ${a.nome || "guest"}.`);
  await sleep(800);
  print("Scrivi 'ancora' per ricominciare con altri pezzi.");
  print("Scrivi 'chiudi' per finire qui.");
  print("(o scrivi 'help' se vuoi esplorare altro)", "dim");
  saveMemory(a);
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
      await askTemplate();
    } else {
      await sleep(700);
      await steps[state.step].ask();
    }
    return true;
  }

  if (state.mode === "choosing_template") {
    const key = text.toLowerCase();
    const templateFn = key === ""
      ? allTemplates[Math.floor(Math.random() * allTemplates.length)]
      : templateMap[key];

    if (!templateFn) {
      print(`"${text}" non corrisponde a nessuno stile. Scrivi un numero da 1 a 6 o il nome.`, "dim");
      return true;
    }
    await tellStory(templateFn);
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
    return false;
  }

  return false;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
