# Parametri custom GA4 — riferimento per le Esplorazioni

Riferimento per interpretare le dimensioni e metriche personalizzate quando si
costruiscono Esplorazioni in GA4 (property condivisa `G-5GDZR18LN8`, entrambi
i domini). Tutti i parametri custom del sito passano da un unico punto,
`trackEvent()` in `src/utils/analytics.js`; questo documento elenca cosa
contiene ciascuno, su quali eventi viaggia e come è classificato in GA4.

La colonna "Registrazione GA4" riflette la classificazione decisa il
10/07/2026 — in caso di dubbio fa fede GA4 Admin → Definizioni personalizzate.

Aggiornato al 10/07/2026, allineato al codice del branch `collaboratori`
(inclusa la normalizzazione di `slide_number` a numero intero su tutti gli
eventi).

---

## Tabella parametri

| Parametro | Evento/i | Tipo e esempio | Descrizione | Registrazione GA4 |
|---|---|---|---|---|
| `ref` | tutti i 7 eventi custom, quando la sessione parte da un link `?ref=` | stringa, es. `8fa8d` | Codice di provenienza email: identifica quale contatto/studio ha aperto il link. La corrispondenza codice → contatto reale vive SOLO nel foglio esterno, mai nel repo | **Dimensione** — è la chiave del tracciamento per-contatto |
| `slide_name` | `slide_view` | stringa, es. `lavori-scelti` | Nome leggibile della slide visualizzata (ordine post-riordino: cover, lavori-scelti, cosa-facciamo, clienti, come-lavoriamo, chi-siamo, contatti) | **Dimensione** — chiave di lettura principale del drop-off |
| `slide_number` | `slide_view`, `slide_time_spent`, `carousel_swipe` | numero intero 1-7, es. `3` | Posizione della slide nel deck (1 = cover, 7 = contatti). Dal 10/07/2026 sempre numero intero su tutti gli eventi | **Dimensione** (valore categorico, non ha senso sommarlo) |
| `seconds_spent` | `slide_time_spent` | numero intero, es. `12` | Secondi trascorsi sulla slide precedente, calcolati ad ogni cambio slide | **Metrica** (unità: secondi) — ha senso mediarla/sommarla |
| `type` | `contact_click` | stringa: `phone` \| `email` | Canale di contatto cliccato nella slide Contatti, derivato dal prefisso dell'href (`tel:`/`mailto:`). Lo Showroom non ha link e non genera l'evento | **Dimensione** — distingue la qualità della conversione |
| `target_slide` | `nav_dot_click` | numero intero 1-7, es. `7` | Slide di destinazione del click su un dot di navigazione (solo desktop: i dots sono nascosti su mobile) | Non registrato — evento a basso volume/priorità; registrabile in futuro senza toccare il codice |
| `card_index` | `carousel_swipe` | numero intero 0-based, es. `2` | Indice della card su cui il carosello mobile si è assestato dopo lo swipe (0 = prima card). Solo mobile | Non registrato — utile solo per analisi fini del carosello; registrabile in futuro |
| `variant` | `scroll_hint_outcome` | stringa: `vertical` \| `horizontal` | Quale hint di scroll è stato consumato dalla prima interazione (verticale = cover, orizzontale = caroselli) | Non registrato — due soli valori, interesse limitato a UX-debugging |
| `method` | `scroll_hint_outcome` | stringa, oggi sempre `interaction` | Come è sparito l'hint. Predisposto per un futuro valore `timeout`, mai implementato | Non registrato — cardinalità 1, zero informazione finché il codice non cambia |
| `entrances` | automatico GA4 (`page_view`/`session_start`) | numero 0/1 | Flag automatico GA4: la pageview è l'ingresso della sessione. Non proviene dal nostro codice | Non registrato — GA4 lo espone già nativamente (metrica "Ingressi") |
| `ignore_referrer` | automatico gtag.js | booleano tecnico | Istruzione interna a gtag di ignorare il referrer in certi flussi. Non proviene dal nostro codice | Non registrato — flag tecnico senza valore analitico |

`full_presentation_viewed` non ha parametri propri (riceve solo `ref` quando
presente). Dimensioni standard utili senza registrazione: **Hostname**
(distingue i due pubblici: presentazione. vs collaboratori.), dispositivo,
sorgente/mezzo.

---

## Limiti noti

1. **`seconds_spent` non cattura l'ultima slide.** Il tempo viene inviato solo
   al cambio di slide: quello passato sull'ultima slide prima della chiusura
   del tab non parte mai (nessun listener `pagehide`/`beforeunload` —
   compromesso accettato). Sottostima sistematica sulla slide dove la gente
   chiude, tipicamente Contatti.
2. **`seconds_spent` misura tempo di orologio, non attenzione.** Nessuna
   gestione di `visibilitychange`: un tab lasciato aperto in background su una
   slide gonfia il valore. Diffidare di valori anomali molto alti.
3. **Non retroattività.** Le dimensioni/metriche personalizzate create in GA4
   Admin valgono solo per i dati raccolti DOPO la loro creazione — i dati
   precedenti non vengono recuperati.
4. **Dati storici di `slide_number` con formato misto.** Prima del 10/07/2026
   `carousel_swipe` inviava stringhe con zero iniziale (`"03"`): nei report che
   includono dati precedenti a quella data, `3` e `03` compaiono come valori
   distinti. Dal fix in poi il formato è sempre numerico.
5. **`ref` vive solo nella sessione del tab** (variabile di modulo, mai in
   storage — scelta privacy deliberata). Chi torna sul sito in un secondo
   momento senza ripassare dal link `?ref=` non viene riattribuito al contatto.
6. **`full_presentation_viewed` significa "è arrivato in fondo"**, non "ha
   visto tutte le slide": saltando direttamente all'ultima slide (tasto End)
   l'evento scatta comunque. Deciso consapevolmente.
7. **`carousel_swipe` ha un debounce di 150ms**: uno swipe veloce che
   attraversa più card genera un solo evento con l'indice finale — le card
   intermedie non vengono tracciate.
8. **`scroll_hint_outcome` scatta una volta per meccanismo per sessione.** La
   chiave dell'hint orizzontale è condivisa dai tre caroselli (slide 02/03/05):
   l'evento non dice su QUALE carosello è avvenuta la prima interazione.
9. **Eventi persi con adblocker.** `trackEvent` esce in silenzio se
   `window.gtag` non esiste (script bloccato): quegli utenti sono invisibili.
10. **Consenso negato = niente dati individuali.** Con Consent Mode v2
    "advanced", chi rifiuta i cookie analytics manda solo ping anonimi senza
    cookie: non compare nei report standard (contribuisce solo all'eventuale
    modellazione, che ha soglie di volume alte).
11. **Property condivisa tra i due pubblici.** Ogni analisi va filtrata o
    segmentata per Hostname, altrimenti i numeri di clienti finali e
    collaboratori si mescolano.
12. **Eventi specifici per dispositivo.** `nav_dot_click` esiste solo su
    desktop, `carousel_swipe` solo su mobile: valori vuoti per questi eventi
    non indicano assenza di engagement, solo il tipo di device.

---

## Come leggerli in GA4 Esplorazioni

Prerequisito per tutte: filtro o segmento su **Hostname =
`collaboratori.rilievocontract.it`** per isolare il pubblico studi.

**1. "A quale slide abbandonano?"** — Esplorazione della canalizzazione
(funnel): passaggi costruiti su `slide_view` filtrato per `slide_name`
(cover → lavori-scelti → … → contatti), in modalità aperta. Il gradino con
il calo più netto è la slide che perde persone. In alternativa, tabella
libera con `slide_name` come riga e conteggio eventi `slide_view` come
valore, per una vista rapida senza sequenza.

**2. "Quale studio ha cliccato telefono vs email?"** — Tabella libera:
righe = `ref`, colonne = `type`, valore = conteggio eventi, filtro
`Nome evento = contact_click`. Ogni riga è uno studio (decodificare col
foglio esterno ref → contatto), le colonne dicono se ha preferito chiamare
o scrivere.

**3. "Quali slide trattengono di più (e chi)?"** — Tabella libera:
righe = `slide_name` (o `slide_number` per l'ordine), valore =
`seconds_spent` (somma o media), filtro `Nome evento = slide_time_spent`.
Aggiungendo `ref` come seconda dimensione di riga si vede il comportamento
del singolo studio. Tenere presenti i limiti 1 e 2 sopra.
