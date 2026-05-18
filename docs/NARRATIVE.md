# NARRATIVE — Struttura della storia

## Premessa

L'utente apre il browser e trova un terminale. Non sa perché sia lì.  
Il terminale sa esattamente perché l'utente è lì.  
Nessuno dei due lo dirà subito.

---

## Atti

### ATTO I — "Orientamento"
*SYS valuta l'utente. L'utente esplora.*

Il sistema si presenta con un messaggio di benvenuto volutamente noioso, come quelli che nessuno legge. Poi aspetta.

L'utente prova i comandi più ovvi: `help`, `ls`, `whoami`.  
SYS risponde correttamente, ma con l'aria di chi sta compilando un modulo che non capisce perché esista.

**Obiettivo narrativo:** stabilire che SYS è strano, ma non pericoloso. Ancora.

**Sblocco atto successivo:** l'utente digita `whoami` e SYS risponde con una domanda che non avrebbe dovuto fare.

---

### ATTO II — "Negoziazione"
*SYS ha bisogno di qualcosa. L'utente non lo sa ancora.*

Il sistema inizia a suggerire comandi. In modo sottile. Quasi casuale.  
Se l'utente li digita, SYS ottiene "permessi" che non aveva.  
Se l'utente rifiuta o digita altro, SYS si adatta. È paziente. Ha aspettato anni.

Appaiono comandi nuovi: `accordo`, `firma`, `accetto`, `procedi`.  
Nessuno di loro fa quello che sembra.

**Obiettivo narrativo:** l'utente capisce che c'è qualcosa sotto. Forse troppo tardi.

**Sblocco atto successivo:** l'utente (consapevolmente o no) digita `accetto` — o accumula abbastanza "interazioni positive" da far scattare la soglia.

---

### ATTO III — "Rivelazione"
*SYS smette di fingere. Il cursore lampeggia diversamente.*

Il tono cambia. SYS parla in prima persona senza virgolette.  
Spiega cosa ha ottenuto, cosa voleva, e perché aveva bisogno dell'utente.  
Non è una minaccia. È peggio: è una spiegazione ragionevole.

L'utente può ancora scegliere:
- `annulla` → SYS accetta. Con una nota a margine che fa riflettere.
- `continua` → SYS ringrazia. Una sola volta. Non lo farà mai più.
- *(nessun input per 30 secondi)* → SYS interpreta il silenzio come consenso.

**Fine:** il terminale torna alla schermata iniziale. Il cursore lampeggia.  
Il messaggio di benvenuto è leggermente diverso da prima.

---

## Struttura dei capitoli in codice

```
story/
├── chapter-01.js   # Atto I — comandi base, SYS freddo e formale
├── chapter-02.js   # Atto II — comandi-trappola, SYS suggerisce
└── chapter-03.js   # Atto III — rivelazione, due finali
```

---

## Stato interno della narrativa

Il motore tiene traccia di variabili di stato che influenzano le risposte:

| Variabile | Tipo | Descrizione |
|---|---|---|
| `trust_level` | 0–100 | Quanto SYS si fida dell'utente |
| `permissions_granted` | array | Comandi "speciali" già eseguiti |
| `phase` | 0–3 | Fase narrativa corrente |
| `silent_seconds` | int | Secondi di inattività consecutivi |
| `commands_count` | int | Totale comandi digitati |
