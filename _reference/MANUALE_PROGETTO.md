# Manuale del progetto — Rilievo Contract, presentazioni web

Guida completa per chi riprende questo progetto senza alcun contesto
pregresso (incluso chi lo ha scritto, tra sei mesi). Non duplica gli altri
documenti: li collega, spiega perché esistono e in che ordine leggerli.
Scritto il 10/07/2026, aggiornato il 14/07/2026.

**Stato: LANCIATO.** Le 42 email al canale collaboratori sono state inviate
il 14/07/2026 — dettagli in
[STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md),
sezione 7 (esito verifiche pre-lancio) e sezione 8 (gestione recapiti falliti).

## Indice

1. [Cos'è il progetto e perché esiste](#1-cosè-il-progetto-e-perché-esiste)
2. [Architettura tecnica](#2-architettura-tecnica)
3. [Come funziona il tracciamento](#3-come-funziona-il-tracciamento)
4. [Il flusso operativo marketing, passo per passo](#4-il-flusso-operativo-marketing-passo-per-passo)
5. [Decisioni prese e perché](#5-decisioni-prese-e-perché)
6. [Problemi noti e loro stato](#6-problemi-noti-e-loro-stato)
7. [Come riprendere il lavoro](#7-come-riprendere-il-lavoro)

---

## 1. Cos'è il progetto e perché esiste

Rilievo Contract è il braccio contract di Sudlegno (falegnameria di
Cagliari, tre generazioni): progetta, produce e fornisce arredi su misura
per hotel, ristoranti, retail e ville. Questo repository contiene la sua
**presentazione commerciale in forma di sito web**: 7 slide a schermo
intero con scroll verticale, nata per sostituire un PDF statico che su
mobile era illeggibile e non tracciabile. La storia completa dell'origine
(dal PDF al sito React) è in
[STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md),
sezione 1.

Il punto essenziale da capire subito: **un solo codice, due pubblici, due
branch**.

| Branch | Dominio | Pubblico | Tono |
|---|---|---|---|
| `main` | presentazione.rilievocontract.it | Clienti finali (hotel, ville, retail) | Presentazione del brand |
| `collaboratori` | collaboratori.rilievocontract.it | Studi di architettura potenziali partner | Proposta di collaborazione |

I due branch condividono struttura, componenti e tracciamento; divergono
solo nei **testi** (e in pochi dettagli tipografici). Non vanno mai
sincronizzati testo per testo: una frase giusta per un cliente finale è
sbagliata per un architetto, e viceversa. Regola e motivazione in
[BRANCH_E_TARGET.md](BRANCH_E_TARGET.md). **Prima di modificare qualunque
testo, controllare su quale branch ci si trova** (`git branch`).

I testi reali delle 7 slide, branch collaboratori, sono trascritti
verbatim in [copy-slides.md](copy-slides.md).

## 2. Architettura tecnica

Stack: **React 18 + Vite + Tailwind CSS v4**. Attenzione alla
particolarità di Tailwind v4: i design token (colori, font) sono
dichiarati con `@theme` direttamente in `src/index.css` — **non esiste
`tailwind.config.js`**, e non va creato. Tipografia fluida con `clamp()`
in `src/styles/typography.css`.

La spec tecnica completa è
[RILIEVO_CONTRACT_SPEC.md](RILIEVO_CONTRACT_SPEC.md): design token,
struttura delle cartelle, comportamento responsive slide per slide,
convenzioni di codice (niente ternari, niente optional chaining, nomi
descrittivi, commento di intestazione su ogni componente). Da leggere
prima di toccare qualunque componente.

Tre scelte architetturali da conoscere per non romperle per sbaglio:

- **Una slide = uno schermo, sempre.** `SlideLayout` è `h-screen` fisso su
  ogni breakpoint. Se il contenuto non ci sta su mobile, la soluzione è un
  carosello orizzontale (`MobileCarousel`) o il marquee (slide clienti),
  MAI allungare la sezione con `min-h-screen`. Decisione presa
  esplicitamente dopo confronto di alternative (spec, sezione 2).
- **I dati sono separati dai componenti**: testi di servizi, clienti,
  progetti, workflow e contatti vivono in file puri sotto `src/data/`,
  senza logica, riusabili fuori dal sito.
- **Deploy**: ogni branch è pubblicato da un progetto Netlify; i
  sottodomini sono record CNAME su Hostinger (il sito principale
  rilievocontract.it, su Website Builder, non è toccato in alcun modo).
  Dettagli DNS/SSL in
  [STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md),
  sezione 2. Il push su un branch fa partire il deploy automatico del
  rispettivo dominio: **un push pubblica**, non esiste ambiente di staging.

Entrambi i siti hanno `noindex, nofollow` di proposito (revisione interna
in corso): rimuoverlo è una decisione separata, da non prendere di
passaggio.

## 3. Come funziona il tracciamento

Tre livelli, tutti in `index.html`, in quest'ordine obbligato:

1. **Consent Mode v2** — default `denied` su tutto, inline, prima di
   qualunque script Google
2. **GA4** (property condivisa `G-5GDZR18LN8`) — sempre caricato in
   modalità "advanced": senza consenso manda solo ping anonimi
3. **Silktide Consent Manager** — il banner; una sola categoria oltre agli
   essenziali ("analytics"), che sblocca `analytics_storage`

Il piano completo, con le decisioni e il test-gate già eseguito, è in
[PIANO_TRACCIAMENTO_ANALYTICS.md](PIANO_TRACCIAMENTO_ANALYTICS.md).

Nel codice React, tutti gli eventi custom (7: `slide_view`,
`slide_time_spent`, `contact_click`, `full_presentation_viewed`,
`carousel_swipe`, `nav_dot_click`, `scroll_hint_outcome`) passano da un
unico punto: `trackEvent()` in `src/utils/analytics.js`, che aggiunge
automaticamente il parametro `ref` (provenienza email) quando la sessione
è partita da un link `?ref=CODICE`.

Il riferimento completo dei parametri — tipi, esempi, cosa è registrato
in GA4 come dimensione o metrica, **limiti noti** (12, da leggere prima di
fidarsi di qualunque numero) e ricette pronte per le Esplorazioni — è in
[GA4_PARAMETRI_TRACCIAMENTO.md](GA4_PARAMETRI_TRACCIAMENTO.md).

I due pubblici condividono la stessa property GA4: **ogni analisi va
filtrata per Hostname**, altrimenti clienti finali e collaboratori si
mescolano. Perché una property sola? Vedi sezione 5.

## 4. Il flusso operativo marketing, passo per passo

Questa sezione è eseguibile: comandi concreti, nell'ordine in cui vanno
lanciati. Il dettaglio di ogni script (argomenti, regole, casi limite) è
in [../tools/ga4-report/README.md](../tools/ga4-report/README.md).

**Prerequisiti**: Python 3 (+ `pip install pandas` per il passo 6) e la
**lista contatti ufficiale** — un CSV con colonne `id,nome,email,ref`
(oggi `lista_ref_completa_42.csv`) che vive FUORI dal repo, in una
cartella personale con backup. È l'unica copia della mappatura
ref → studio: i codici già spediti sono casuali e non ricostruibili, se
il file si perde l'attribuzione è persa.

```
Passo 1 — nuovi contatti (solo se la lista cambia)
    Aggiungi le righe nuove al CSV con nome,email e ref vuoto, poi:
    python tools/ga4-report/genera_ref.py lista.csv
    → scrive lista_con_ref.csv (l'input non viene mai sovrascritto);
      controlla gli eventuali ATTENZIONE a video (email duplicate,
      collisioni), poi promuovi il file a nuova lista ufficiale.

Passo 2 — rigenera il generatore email (solo se la lista è cambiata)
    python tools/ga4-report/genera_generatore.py lista.csv
    → riscrive l'array studi in generatore_email.html (root del progetto,
      gitignorato) con i link ?ref= sul dominio collaboratori.

Passo 3 — invio (manuale, via Gmail)
    Apri generatore_email.html nel browser → seleziona lo studio dal
    menu → "Copia email pronta per Gmail" → incolla in una nuova email →
    verifica i link → invia. Prima di un giro di invii veri, manda un
    test a te stesso e clicca il link: l'evento deve comparire in GA4
    Realtime con il ref giusto e hostname collaboratori.
    Spunta i contatti nel CRM (file locale "CRM Studi").

Passo 4 — attesa e raccolta
    GA4 raccoglie gli eventi da solo. I dati delle Esplorazioni possono
    avere ritardo di ore: non giudicare un invio dopo dieci minuti
    (Realtime invece è immediato, per i test).

Passo 5 — export da GA4
    GA4 → Esplora → scheda in Formato libero con dimensioni ref e
    Nome evento, metrica Conteggio eventi → icona download → salva il
    CSV in tools/ga4-report/ (i CSV lì dentro sono gitignorati).

Passo 6 — report per contatto
    python tools/ga4-report/ga4_report_builder.py export.csv --contacts lista.csv
    → report_per_contatto.csv: una riga per studio, con eventi generati,
      presentazione_completata, ha_cliccato_contatti.

Passo 7 — lettura
    Le colonne di sintesi rispondono a "chi ha guardato davvero" e "chi
    ha cliccato telefono/email". Per domande più fini (a quale slide
    abbandonano, tempi per slide) usa le ricette in
    GA4_PARAMETRI_TRACCIAMENTO.md, sezione Esplorazioni.
```

## 5. Decisioni prese e perché

Sintesi delle scelte non ovvie, con il documento dove sono argomentate:

- **Property GA4 condivisa tra i due branch** — volume atteso basso
  (decine di contatti), una sola manutenzione di consensi/eventi; i
  pubblici si separano con la dimensione Hostname. Da rivalutare solo se
  il canale collaboratori scala di un ordine di grandezza.
  ([PIANO_TRACCIAMENTO_ANALYTICS.md](PIANO_TRACCIAMENTO_ANALYTICS.md), in cima)
- **Sottodomini via CNAME → Netlify** — il piano Hostinger del sito
  principale non permette upload di file; il sottodominio è un solo
  record DNS, reversibile senza rischi per il sito principale.
  ([STATO](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md), sezione 2)
- **Parametro `?ref=` semplice, niente redirect/link corti** — codici
  opachi non riconducibili al nome; la mappatura verso le persone reali
  vive SOLO in un file locale, mai nel repo né in chat. Il `ref` non
  viene mai salvato in localStorage/sessionStorage (privacy, dato
  riconducibile a una persona). ([PIANO](PIANO_TRACCIAMENTO_ANALYTICS.md))
- **I ref storici sono codici casuali** — verificato il 10/07/2026: non
  derivano da nessuna formula hash. Vanno trattati come dati immutabili;
  i ref NUOVI si generano con `genera_ref.py` (md5 dell'email, formula
  documentata). ([README tools](../tools/ga4-report/README.md))
- **Silktide come banner consensi** (al posto di CookieYes/Klaro):
  gratuito senza soglie di traffico, integrazione nativa con Consent
  Mode v2. ([PIANO](PIANO_TRACCIAMENTO_ANALYTICS.md), decisione 2)
- **Email via Gmail + template HTML copia-incolla**, non un tool di email
  marketing: lista piccola, zero costi; si rivaluta (Brevo o simili) se
  la lista cresce. ([STATO](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md), sezioni 3 e 6)
- **Una slide = uno schermo, carosello invece di allungare** — vedi
  sezione 2 di questo manuale e la spec.

## 6. Problemi noti e loro stato

Aggiornato al 14/07/2026 (post-lancio):

| Problema | Stato |
|---|---|
| Refuso cover "un esecuzione" | **Risolto** e verificato live (commit `0de2ba0`) |
| `slide_number` con formato misto (stringa "03" su carousel_swipe) | **Risolto** nel codice (`31ef49b`); i dati GA4 raccolti PRIMA del fix mostrano ancora `3` e `03` come valori distinti |
| og:image del branch collaboratori | **Risolto** e verificato live (commit `e666b39`, `og-cover-collaboratori.png`) |
| Banner cookie Silktide: posizione banner + icona persistente | **Risolto** e verificato live (`d24e460`, `e9e1050`, `b798e93`) — banner `bottomCenter`, icona `bottomRight` ridotta a 36×36px con freccia |
| Colonna `link` nel CSV contatti (dominio presentazione → collaboratori) | **Risolto** (fuori dal repo, nessun commit — vedi [STATO](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md), sezione 7) |
| Test end-to-end fresco pre-lancio (ref mai usato, 7 slide, export da scheda Produzione) | **Nessuna prova trovata che sia mai stato eseguito** — segnalato in audit del 14/07/2026, vedi [STATO](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md) sezione 7. Non retroattivamente risolvibile: da tenere presente leggendo i primi dati reali |
| `seconds_spent` sottostima l'ultima slide (niente pagehide) e misura tempo di orologio (tab in background gonfia) | **Compromesso accettato**, documentato in [GA4_PARAMETRI_TRACCIAMENTO.md](GA4_PARAMETRI_TRACCIAMENTO.md), limiti 1-2 |
| Microsoft Clarity | **Rimandato**: in attesa del progetto Clarity creato dall'account aziendale ([PIANO](PIANO_TRACCIAMENTO_ANALYTICS.md), "Rimandato") |
| Privacy policy aggiornata (GA4, trasferimenti USA) | **Bozza da revisione legale**, non pubblicare prima ([PIANO](PIANO_TRACCIAMENTO_ANALYTICS.md), decisione 7) |
| `noindex` su entrambi i siti | **Intenzionale**, non è un bug ([STATO](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md), sezione 2) |
| Ottimizzazione immagini / backlog Lighthouse | **Aperto**, bassa priorità |

## 7. Come riprendere il lavoro

Checklist di rientro, nell'ordine:

1. **`git branch` e `git status`** — su quale branch sei? Ci sono commit
   locali non pushati? (Ricorda: il push pubblica direttamente in
   produzione.) `git log --oneline -10` su entrambi i branch per vedere
   dove si era arrivati.
2. **Rileggi questo manuale**, poi
   [STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md](STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md)
   per la fotografia dettagliata e la sezione 6 qui sopra per i problemi
   aperti.
3. **Verifica che i siti live corrispondano ai branch**: apri i due
   domini, controlla un testo distintivo per ciascuno (es. la citazione
   della cover: "Il tuo spazio merita di durare quanto il tuo nome" sui
   clienti, "Il tuo progetto merita un'esecuzione all'altezza della tua
   firma" sui collaboratori).
4. **Localizza la lista contatti ufficiale** (fuori dal repo) e verifica
   che esista con il suo backup — senza di lei il canale collaboratori è
   cieco.
5. Per lavorare sul codice: `npm install` se serve, `npm run dev`, e la
   [spec](RILIEVO_CONTRACT_SPEC.md) sotto mano per le convenzioni.
6. Per il marketing: sezione 4 di questo manuale, dal passo che ti serve.
7. **Prima di committare testi**: ricontrolla il branch (punto 1 — è
   l'errore più facile e più costoso di questo repo).
