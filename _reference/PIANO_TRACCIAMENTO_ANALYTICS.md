# Piano tracciamento e analytics — Rilievo Contract

Decisioni prese, da usare come riferimento per l'implementazione con Claude
Code. Stesso metodo usato per l'email: piano scritto prima, poi
implementazione verificata pezzo per pezzo.

---

## Decisioni prese

1. **Si useranno i cookie** — banner di consenso necessario (GDPR/ePrivacy)
2. **Banner**: CookieYes (piano gratuito, fino a 25.000 pageview/mese —
   ampiamente sufficiente), integrato nativamente con Google Consent Mode v2
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

## Cosa NON fare (promemoria)
- Non salvare il parametro `ref` in localStorage/sessionStorage — resta solo
  in memoria per la sessione corrente, coerente con l'approccio già usato per
  gli hint (nessun identificatore persistente non necessario)
- Non rimuovere il `noindex` sul sito in questa fase — resta una decisione
  separata, da riprendere quando si deciderà di rendere il sito pubblico
- Non pubblicare la nuova privacy policy senza revisione legale
