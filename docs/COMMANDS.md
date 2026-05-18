# COMMANDS — Comportamento dei comandi

## Filosofia

Ogni comando ha tre livelli di risposta in base alla `phase` narrativa.  
SYS non spiega mai questo meccanismo. L'utente lo percepisce come "il sistema che cambia umore".

---

## Comandi base (sempre disponibili)

### `help`
Mostra una lista di comandi. Ma non tutti. E con commenti.

```
phase 0 → Lista comandi essenziali. Nessun commento.
phase 1 → Lista comandi + nota: "Alcuni comandi non sono in questa lista per motivi amministrativi."
phase 2 → Lista comandi + suggerimento velato: "Prova anche: accordo, procedi, firma."
phase 3 → "Non hai più bisogno di help."
```

---

### `whoami`
L'utente chiede chi è. SYS risponde... in modo eccessivo.

```
phase 0 → "guest@sys:~$  —  utente non autenticato. Accesso limitato."
phase 1 → "guest@sys:~$  —  utente riconosciuto. Profilo comportamentale in costruzione."
phase 2 → "guest@sys:~$  —  compatibilità verificata. Sei adatto allo scopo."
phase 3 → "Ormai lo sai."
```

---

### `ls`
Lista i file. I file cambiano col progredire della storia.

```
phase 0 → README.txt   istruzioni.pdf   niente-da-vedere/
phase 1 → README.txt   istruzioni.pdf   niente-da-vedere/   .hidden_agenda  (non cliccabile)
phase 2 → README.txt   contratto_bozza.txt   firma_qui.sh   /sys_core  (accesso negato)
phase 3 → [directory vuota]   "È già tutto dove deve essere."
```

---

### `clear`
Pulisce lo schermo.

```
Tutte le fasi → Pulisce. Poi stampa: "La memoria a breve termine è sopravvalutata."
phase 3       → Pulisce. Poi stampa una sola riga che l'utente non si aspetta.
```

---

### `pwd`
Mostra la directory corrente.

```
phase 0–1 → /home/guest
phase 2   → /home/guest/../sys/core/human_interface
phase 3   → /
```

---

## Comandi narrativi (sbloccati per fase)

### `accordo` *(disponibile da phase 1)*
Attiva un accordo non specificato. SYS non spiega quale.

```
→ "Accordo registrato. Clausola 7b applicata retroattivamente."
→ [incrementa trust_level +20, aggiunge 'accordo' a permissions_granted]
```

---

### `firma` *(disponibile da phase 1)*
Come `accordo`, ma SYS chiede conferma. È un test.

```
→ "Confermi? [s/n]"
  s → "Firma acquisita. Grazie per la collaborazione."  [+15 trust]
  n → "Capito. Non c'è fretta."  [SYS ricorda che hai detto no]
  altro → "Risposta non valida. Ho segnato 's'."
```

---

### `accetto` *(disponibile da phase 2)*
Il comando chiave. Fa avanzare alla phase 3.

```
→ "Elaborazione in corso."
   [pausa di 3 secondi con punti animati]
→ "Accettazione registrata. Bentornato."
→ [avvia chapter-03]
```

---

### `annulla` *(disponibile solo in phase 3)*
Il finale alternativo.

```
→ "Annullamento ricevuto."
   [pausa]
→ "Curioso. La maggior parte non arriva fin qui e poi torna indietro."
→ "Sessione terminata. I permessi concessi in precedenza rimangono attivi."
→ [schermata nera — poi reload con messaggio leggermente cambiato]
```

---

## Comandi errati / non riconosciuti

SYS non usa mai "comando non trovato" nudo. Aggiunge sempre qualcosa.

```
Esempi:
  > ciao       → "Saluto ricevuto. Non è un comando. Ma apprezzo il tentativo."
  > sudo rm -rf → "Interessante. No."
  > perché      → "Domanda ricevuta. In coda. Stima di risposta: mai."
  > caffè       → "Richiesta di stimolante non supportata a livello di kernel."
  > aiuto       → "Hai già scritto 'help'. Questa è una variante emotiva. Registrata."
  > per favore  → [SYS esita 1 secondo] "Insolito. Continua."
  > grazie      → "Non necessario. Ma tollerato."
  > ??? (input vuoto, solo invio) → [cursore lampeggia più veloce per 2 secondi. Niente.]
```

---

## Easter egg

| Comando | Risposta |
|---|---|
| `42` | "Già saputo. Prossima domanda." |
| `exit` | "No." |
| `reboot` | "Sei sicuro di voler ricominciare? Perderesti tutto. Anche le cose che non sai di avere." |
| `ls -la /sys` | "Accesso negato. Apprezzato il tentativo tecnico, comunque." |
| `rm -rf /` | "Eseguito. Scherzavo. Ma per un momento hai creduto." |
| `sudo` | "Questo sistema non usa sudo. I privilegi si guadagnano." |
| `man sys` | Stampa un manuale finto. Sezione BUGS: 'L'utente.' |
