# Piano tracciamento e analytics — Rilievo Contract

Decisioni prese, da usare come riferimento per l'implementazione con Claude
Code. Stesso metodo usato per l'email: piano scritto prima, poi
implementazione verificata pezzo per pezzo.

---

## Configurazione property/stream
## Branch collaboratori — decisione tracciamento (2026-07-09)

Il branch `collaboratori` (collaboratori.rilievocontract.it) riusa la stessa
property/stream GA4 di `main` (G-5GDZR18LN8). Nessuna modifica al codice di
tracciamento richiesta: Consent Mode v2, Silktide e i 7 eventi custom restano
identici su entrambi i domini.

Motivazione: basso volume previsto (42 contatti), evitare doppia manutenzione
di consensi/eventi/conversioni, nessun bisogno di accessi GA4 separati per
terzi al momento.

Distinzione tra le due audience in reportistica: dimensione "Hostname"
(presentazione.rilievocontract.it vs collaboratori.rilievocontract.it),
combinata con il parametro ?ref= per il singolo contatto — stesso meccanismo
già in uso su main.

Silktide: nessuna configurazione aggiuntiva richiesta, lo script è iniettato
via HTML/CDN e non ha whitelist di dominio lato pannello.

Rivalutare split in property separata solo se il canale collaboratori scala
oltre l'ordine di centinaia di contatti o richiede accessi GA4 dedicati a terzi.

## Decisioni prese

1. **Si useranno i cookie** — banner di consenso necessario (GDPR/ePrivacy)
2. **Banner**: Silktide Consent Manager (gratuito, supporta nativamente Google
   Consent Mode v2 — confermato dalla loro pagina prodotto), sostituisce la
   scelta iniziale CookieYes/Klaro (quelle avevano soglie a pagamento oltre
   un certo traffico, Silktide si dichiara gratuito senza limiti)
3. **Analytics**: Google Analytics 4, gated dal consenso
4. **Heatmap/registrazioni sessione**: Microsoft Clarity, gated dal consenso
   (categoria "analytics" nel banner)
5. **Tracciamento provenienza email**: parametro opaco nell'URL diretto
   (`?ref=CODICE`), niente redirect/link corto — scelta esplicita per
   restare semplice, il codice non deve essere leggibile/comprensibile dal
   destinatario, ma non serve nascondere che esiste un parametro
6. **Eventi custom**: vedi tabella sotto
7. **Privacy policy**: da aggiornare per menzionare GA4 + Clarity (entrambi
   servizi USA, quindi trasferimento internazionale di dati da segnalare) —
   bozza preparata ma da far rivedere da un legale prima di pubblicarla,
   non è consulenza legale professionale

---

## Eventi custom da tracciare

| Evento | Trigger | Parametri | Priorità |
|---|---|---|---|
| `slide_view` | Cambio slide (già rilevato da `useSlideNavigation`) | `slide_number`, `slide_name` | Alta — drop-off |
| `slide_time_spent` | Uscita da una slide | `slide_number`, `seconds_spent` | Media |
| `contact_click` | Click telefono/email in ContactSlide | `type` (phone/email) | **Massima — segnare come evento chiave/conversione in GA4** |
| `full_presentation_viewed` | Arrivo a ContactSlide (slide 7) | — | **Alta — segnare come evento chiave** |
| `carousel_swipe` | Swipe su carosello mobile (03/05/06) | `slide_number`, `card_index` | Media |
| `nav_dot_click` | Click su dot desktop | `target_slide` | Bassa |
| `scroll_hint_outcome` | Hint sparisce | `variant`, `method` (interazione/timeout) | Bassa |

Automatici via GA4, nessun codice richiesto: `session_start`, `first_visit`,
`page_view`, tempo di sessione, dispositivo, provenienza generale.

### Parametro `ref` (provenienza email)
- Link nelle email: `https://presentazione.rilievocontract.it/?ref=CODICE`
- Codice alfanumerico corto, senza significato apparente (es. `7f3a2`), non
  il nome del cliente in chiaro
- **La corrispondenza codice → destinatario reale va tenuta SOLO in un foglio
  separato di Se, MAI nel codice sorgente o nel repository** (è dato
  potenzialmente sensibile legato a una persona/azienda specifica)
- Letto via `URLSearchParams` al caricamento pagina, allegato come parametro
  custom a tutti gli eventi GA4 della sessione

---

## Architettura tecnica

### Ordine di caricamento script (index.html)
1. `gtag.js` base — SEMPRE caricato, con **Consent Mode v2** impostato su
   `denied` di default per analytics/ads prima di qualunque interazione utente
2. Script CookieYes — gestisce il banner, aggiorna il consenso via
   `gtag('consent', 'update', {...})` quando l'utente sceglie
3. Script Microsoft Clarity — condizionato allo stesso consenso (categoria
   analytics), non deve partire se l'utente rifiuta

### Dove vive la logica nel codice React
- `useSlideNavigation.js`: già rileva `slideAttiva` — aggiungere qui la
  chiamata `gtag('event', 'slide_view', {...})` ad ogni cambio, e il calcolo
  di `seconds_spent` per `slide_time_spent`
- `ContactSlide.jsx`: aggiungere `onClick` sui link telefono/email per
  `contact_click`
- `useSlideNavigation.js` (o `Presentation.jsx`): quando `slideAttiva === 6`
  (ultima slide, indice 0-based), scatenare `full_presentation_viewed` una
  sola volta per sessione
- `MobileCarousel.jsx`: aggiungere l'evento `carousel_swipe` nello stesso
  punto dove già gira `markInteracted` per l'hint orizzontale
- `NavigationDots.jsx`: evento `nav_dot_click` nel click handler esistente
- `useFirstInteraction.js`: evento `scroll_hint_outcome` dentro
  `markInteracted`
- Un nuovo file, es. `src/utils/trackingRef.js`: legge `?ref=` dall'URL al
  primo caricamento, lo tiene in una variabile di modulo (in memoria, non
  in storage), esposto a tutti gli eventi sopra

---

## Rimandato a più avanti (deciso consapevolmente)

**1. Link con redirect + parametri offuscati** — attualmente i link email hanno
solo `?ref=CODICE` visibile nella barra indirizzi. Idea valutata ma rimandata:
un redirect lato Netlify (`presentazione.rilievocontract.it/r/CODICE` →
`/?ref=CODICE&utm_source=gmail&utm_medium=email&utm_campaign=CODICE_CAMPAGNA`)
con pulizia dell'URL visibile via `history.replaceState` dopo il caricamento.
Motivo del rimando: nessuna urgenza, il tracciamento attuale con solo `ref`
funziona già bene, questo è un miglioramento estetico/di discrezione, non
funzionale. Se implementato in futuro: verificare con un test esplicito che
`history.replaceState` non generi un secondo `page_view` spurio in GA4 (la
Misurazione avanzata attiva potrebbe in teoria reagire al cambio di URL anche
se il path resta identico e cambiano solo i parametri — da confermare con un
test, non assumere).

**2. Microsoft Clarity** — heatmap e registrazioni di sessione, per capire
non solo *cosa* fanno i visitatori (già coperto da GA4) ma *come* interagiscono
visivamente (dove esitano, dove si bloccano). Da agganciare al consenso
Silktide (categoria "analytics", stessa già usata per GA4) con un test-gate
identico a quello già fatto per GA4 (denied di default, si attiva solo dopo
accettazione). Bloccato in attesa che il capo crei il progetto Clarity con
l'account `rilievocontract@gmail.com` e inviti Se come collaboratore (stesso
schema già usato per l'accesso a GA4) — nessuna fretta.

## Cosa NON fare (promemoria)
- Non salvare il parametro `ref` in localStorage/sessionStorage — resta solo
  in memoria per la sessione corrente, coerente con l'approccio già usato per
  gli hint (nessun identificatore persistente non necessario)
- Non rimuovere il `noindex` sul sito in questa fase — resta una decisione
  separata, da riprendere quando si deciderà di rendere il sito pubblico
- Non pubblicare la nuova privacy policy senza revisione legale
