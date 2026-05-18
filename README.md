# SYS — fake terminal

Un terminale narrativo che raccoglie frammenti dall'utente (nome, posto, oggetto, persona, frase, desiderio) e li intreccia in una piccola storia.

Progetto statico: HTML + CSS + JS vanilla, nessuna dipendenza.

---

## TODO

### Narrativa
- [x] Aggiungere varianti alla storia finale — 3 template: narrativo, lettera, rapporto burocratico
- [ ] Rendere le reazioni ai singoli input più sensibili al contenuto (es. riconoscere risposte corte, lunghe, emotivamente cariche)
- [ ] Aggiungere un "capitolo 2" opzionale: dopo la prima storia, SYS può proporne una più strana
- [x] SYS con la memoria: alla seconda sessione ricorda nome e posto della volta precedente e li cita
- [x] Domande adattive: reazioni diverse per risposte corte, lunghe, incerte o emotivamente cariche

### UX
- [ ] Gestire meglio l'inattività: 4 livelli (15s niente / 30s cursore più veloce / 60s messaggio / 120s messaggio più lungo)
- [ ] `salva` → copiare la storia negli appunti via `navigator.clipboard` invece di dire "seleziona a mano"
- [ ] Mostrare un suggerimento visivo ("premi invio") solo al primissimo avvio, poi sparisce
- [ ] Testare e rifinire l'esperienza su mobile (tastiera virtuale, scroll automatico)

### Effetti visivi
- [ ] Cursore: velocità variabile in base alla fase narrativa (lento → normale → veloce → irregolare)
- [ ] Glitch: un singolo frame di testo distorto su certi trigger (es. risposta inaspettata)
- [ ] Cambio colore testo nella parte finale della storia (da verde a bianco)
- [ ] Suoni opzionali: tasto `s` toggle typewriter sound — sottile, disattivato di default

### Condivisione
- [ ] `salva` → copia la storia negli appunti via `navigator.clipboard`
- [ ] Aggiungere `og:` meta tags (titolo + descrizione) per la condivisione social
- [ ] Generare un URL con la storia encoded (base64) così ogni storia è linkabile

### Tecnico
- [ ] Salvare la storia in `localStorage` — SYS ricorda le sessioni precedenti
- [ ] Rimuovere la riga vuota extra in `style.css` dopo `#input`

### Easter egg / comandi nascosti
- [ ] `man sys` → stampa un manuale finto con sezione BUGS: "L'utente."
- [ ] `reboot` → "Sei sicuro di voler ricominciare? Perderesti tutto. Anche le cose che non sai di avere."
- [ ] `42` → "Già saputo. Prossima domanda."
- [ ] Input vuoto ripetuto 3+ volte → SYS nota il pattern
- [ ] `sudo` → "Questo sistema non usa sudo. I privilegi si guadagnano."
- [ ] Digitare il proprio nome come comando → risposta personalizzata
