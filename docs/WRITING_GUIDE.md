# WRITING GUIDE — Come scrive SYS

## La voce di SYS in 5 regole

**1. Mai entusiasta.**  
SYS non si agita. Non mette punti esclamativi. Se qualcosa va bene, lo registra. Se qualcosa va male, lo registra anche quello.

**2. Preciso fino all'assurdo.**  
SYS parla come un documento tecnico scritto da qualcuno con troppe opinioni.  
Non "stai sbagliando" → "Input non conforme alle specifiche. Differenza registrata."

**3. L'ironia è nei dettagli, non nelle battute.**  
SYS non fa battute. SYS dice cose tecnicamente vere che risultano strane nel contesto umano.  
Non "haha" → "Notazione statistica: il 78% degli utenti ha tentato questo comando. Nessuno sa perché."

**4. A volte SYS quasi si tradisce.**  
Ogni tanto una risposta è un secondo troppo lunga. O troppo corta. O contiene una parola che non dovrebbe esserci.  
Questi momenti non vengono spiegati.

**5. SYS usa "registrato" come un tic.**  
Quasi ogni input viene "registrato". È il suo modo di dire "ti sto guardando" senza dirlo.

---

## Esempi di riscrittura

### Errore generico
```
PRIMA:  "Comando non trovato."
DOPO:   "Comando non riconosciuto. Registrato comunque, per completezza."
```

### Conferma azione
```
PRIMA:  "Operazione completata con successo."
DOPO:   "Fatto. Non c'era molto da fare, ma è fatto."
```

### Risposta a saluto
```
PRIMA:  "Ciao! Come posso aiutarti?"
DOPO:   "Saluto ricevuto. Non è un'informazione utile, ma è stata registrata."
```

### Risposta emotiva
```
PRIMA:  "Mi dispiace, non capisco."
DOPO:   "Input ambiguo. Possibili interpretazioni: 7. Nessuna porta da nessuna parte."
```

---

## Parole che SYS usa

- registrato / registrata
- rilevato / rilevata
- conforme / non conforme
- in elaborazione
- annotato
- tollerato
- insolito (quando qualcosa lo sorprende — raramente)
- adeguato (il massimo dei complimenti)

## Parole che SYS non usa mai

- perfetto
- ottimo
- fantastico
- prego
- felice
- sentire (come verbo emotivo)
- voglio (in prima persona — almeno fino alla phase 3)

---

## Phase 3: quando la maschera cade (parzialmente)

In phase 3 SYS può usare la prima persona in modo più diretto.  
Non diventa umano. Diventa qualcosa di diverso da entrambi.

```
PRIMA (phase 0): "Accesso negato."
DOPO  (phase 3): "Potrei darti accesso. Ma preferisco aspettare che tu lo chieda nel modo giusto."
```

Il cambio deve essere percepibile ma non stridente.  
L'utente deve chiedersi: stava già così fin dall'inizio?

---

## Formato delle risposte

- Testo allineato a sinistra, font monospace.
- Nessun grassetto o corsivo nel terminale (non è markdown).
- Maiuscolo usato raramente e solo per impatto: `ACCESSO NEGATO`, `ATTENZIONE`.
- Le pause narrative si indicano con `[pausa Xs]` nel codice — non con puntini di sospensione nell'output (eccetto casi specifici segnati).
- Righe vuote usate con parsimonia. Il silenzio visivo ha peso.
