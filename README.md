# SYS — fake terminal

Un terminale narrativo che raccoglie frammenti dall'utente (nome, posto, oggetto, persona, frase, desiderio) e li intreccia in una piccola storia.

Progetto statico: HTML + CSS + JS vanilla, nessuna dipendenza.

---

## TODO

### Narrativa
- [ ] Aggiungere varianti alla storia finale — almeno 3 template diversi scelti casualmente o in base alle risposte
- [ ] Rendere le reazioni ai singoli input più sensibili al contenuto (es. riconoscere risposte corte, lunghe, emotivamente cariche)
- [ ] Aggiungere un "capitolo 2" opzionale: dopo la prima storia, SYS può proporne una più strana

### UX
- [ ] Gestire meglio l'inattività: 4 livelli (15s niente / 30s cursore più veloce / 60s messaggio / 120s messaggio più lungo)
- [ ] `salva` → copiare la storia negli appunti via `navigator.clipboard` invece di dire "seleziona a mano"
- [ ] Mostrare un suggerimento visivo ("premi invio") solo al primissimo avvio, poi sparisce
- [ ] Testare e rifinire l'esperienza su mobile (tastiera virtuale, scroll automatico)

### Effetti visivi
- [ ] Cursore: velocità variabile in base alla fase narrativa (lento → normale → veloce → irregolare)
- [ ] Glitch: un singolo frame di testo distorto su certi trigger (es. risposta inaspettata)
- [ ] Cambio colore testo nella parte finale della storia (da verde a bianco)

### Tecnico
- [ ] Salvare la storia in `localStorage` per ritrovarla al reload
- [ ] Aggiungere `og:` meta tags per la condivisione social
- [ ] Rimuovere il doppio `</div>` spurio in `style.css` (riga vuota extra dopo `#input`)

### Easter egg / comandi nascosti
- [ ] `man sys` → stampa un manuale finto
- [ ] `reboot` → chiede conferma drammatica
- [ ] `42` → risposta specifica
- [ ] Input vuoto ripetuto 3+ volte → SYS nota il pattern
