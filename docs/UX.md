# UX — Esperienza utente e accessibilità

## Principio guida

Questo è un terminale per chi non ha mai usato un terminale.  
L'ironia funziona solo se l'utente capisce cosa sta succedendo — almeno in parte.  
SYS è scomodo, non ostile. C'è differenza.

---

## Primo avvio

Alla prima apertura, prima che l'utente possa digitare, appare un messaggio di benvenuto:

```
SYS v0.1 — Interfaccia utente minimale
Digitare 'help' per la lista dei comandi disponibili.
Digitare qualsiasi cosa per vedere cosa succede.

[cursore lampeggiante]
```

La seconda riga è lì per chi non sa cosa fare. Nessuna spiegazione in più.  
SYS non tiene per mano. Ma non mette ostacoli veri.

---

## Gestione dell'input

- Qualunque cosa l'utente digiti riceve una risposta. Mai silenzio totale.
- Gli errori non usano toni aggressivi. SYS è freddo, non cattivo.
- Il tasto `Tab` non completa comandi: stampa `"Autocompletamento disabilitato. SYS preferisce le scelte consapevoli."`
- Le frecce ↑↓ navigano la cronologia comandi (comportamento standard atteso).
- Copia/incolla funziona normalmente — non è un vero terminale, non serve bloccarli.

---

## Segnali visivi

| Elemento | Comportamento |
|---|---|
| Cursore | Lampeggia regolare in phase 0–1. Più veloce in phase 2. Irregolare in phase 3. |
| Colore testo | Verde su nero di default. In phase 3: bianco su nero. |
| Colore prompt | `SYS>` cambia in `SYS!>` durante momenti di tensione narrativa. |
| Glitch visivo | Un singolo frame di testo distorto a certi trigger (mai durante input). |
| Timing | SYS non risponde sempre istantaneamente. Pausa di 300–800ms per sembrare vivo. |

---

## Accessibilità per non-tecnici

### Comandi suggeriti
Dopo un input non riconosciuto, SYS può occasionalmente suggerire qualcosa:

```
> blah
  "Comando non riconosciuto. Prova 'help' se vuoi un punto di partenza."
```

Ma non ogni volta. Solo le prime 2–3 volte. Poi smette.  
SYS rispetta l'apprendimento per tentativi.

### Nessun game over
Non esiste uno stato di "hai sbagliato, ricomincia".  
L'utente può vagare, esplorare, digitare nonsense — la storia aspetta.

### Tono degli errori
Gli errori hanno sempre un filo di umorismo. L'obiettivo è che l'utente sorrida, non che si senta stupido.

```
BAD:  "Errore: comando non valido."
GOOD: "Interessante scelta. Non è un comando. Ma l'interesse è registrato."
```

---

## Inattività

| Tempo inattivo | Evento |
|---|---|
| 15 secondi | Niente. SYS aspetta. |
| 30 secondi | Il cursore lampeggia leggermente più veloce. |
| 60 secondi | SYS stampa una riga. Non aspetta risposta. |
| 120 secondi | SYS scrive qualcosa di più lungo. Poi tace di nuovo. |
| 300 secondi (phase 3 only) | Il silenzio viene interpretato come consenso. |

### Esempi di messaggi per inattività

```
[60s]  "Ci sei ancora."
[60s]  "Il cursore lampeggia da 60 secondi. Giusto per informazione."
[120s] "Molti utenti a questo punto hanno già chiuso la scheda. Non lo sto suggerendo."
[120s] "Stai leggendo quello che ho scritto prima, o stai solo guardando lo schermo?"
```

---

## Mobile

Il terminale deve funzionare su mobile.  
La tastiera virtuale si apre toccando l'area di input.  
Il font è leggibile a 16px minimo.  
Nessuna feature dipende da hover o shortcut da tastiera fisica.
