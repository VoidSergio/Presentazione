# Piano architettura multi-audience — Rilievo Contract

> **SUPERATO / ABBANDONATO — 17/07/2026.** Dopo aver provato il pattern
> `VITE_AUDIENCE` + `audience.js` proposto qui sotto su questo branch, si e'
> deciso di NON adottarlo: si continua con l'architettura branch-per-pubblico
> gia' in uso su `main` e `collaboratori` (un branch = un pubblico, dati/testi
> cablati direttamente nei componenti/data files, nessuna variabile
> d'ambiente che sceglie il contenuto a runtime). Il codice di questo branch
> e' stato aggiornato di conseguenza (vedi commit successivo a questa nota).
> Il documento resta come riferimento storico delle alternative valutate,
> non descrive piu' lo stato attuale del codice.

---


Documento di analisi e proposta, scritto PRIMA di qualsiasi modifica al
codice. Obiettivo: decidere come strutturare il progetto per la terza
audience (agenzie immobiliari) e per quelle che verranno dopo, senza
rischiare il sito attuale (main, in produzione) né quello dei
collaboratori (in fase di invio ai 42 studi).

Non contiene modifiche. È la base per decidere insieme i prossimi passi.

---

## 1. Cosa ho verificato nel repo (non assunzioni, evidenza diretta)

Ho confrontato `main` e `collaboratori` con `git diff main collaboratori
--stat` e letto i diff riga per riga. Risultato: **26 file toccati, tutti
per differenze di pubblico**, nessuna differenza strutturale vera. Nello
specifico:

- **Il testo è scritto due volte, a mano, dentro i componenti.**
  `CoverSlide.jsx`, `ServicesSlide.jsx`, `ClientsSlide.jsx`,
  `ContactSlide.jsx`, `AboutSlide.jsx` hanno tutti la stessa struttura
  JSX nei due branch, con solo le stringhe di copy cambiate a mano riga
  per riga. Solo `workflow.js` (i 4 step del processo) è già dati puri
  in un file separato — è l'eccezione, non la regola.
- **Config e contenuto sono mescolati nello stesso diff.** Nel branch
  `collaboratori`, insieme al testo, sono cambiati anche: i meta tag
  og:title/og:description/og:image in `index.html`, la posizione
  dell'icona Silktide (da `bottomLeft` a `bottomRight`) e un override
  CSS per la sua icona che in `main` non esiste. Cioè: un fix di UI
  (posizionamento del cookie banner) è stato applicato *solo* su
  `collaboratori` e non è mai tornato su `main` — che infatti ha ancora
  il problema di sovrapposizione con l'email in slide Contatti, elencato
  come outstanding item. Questo è già la prova pratica del rischio di
  cui parlavamo: un fix fatto su un branch resta lì se nessuno se lo
  ricorda.
- **`typography.css` (i token di dimensione testo, condivisi da tutte le
  slide) è divergente**: `collaboratori` ha aggiunto una variabile
  (`--text-quote-coverh2`) e modificato dimensioni esistenti
  (`--text-quote-cover` da 22px a 34px). Se domani serve lo stesso
  paragrafo aggiuntivo in cover anche su `main`, va portato a mano.
- **`SlideLayout.jsx` (il wrapper comune a ogni slide) forza
  `h-screen` fisso** su ogni slide, una sezione = un viewport intero,
  con scroll-snap verticale. Questo è rigido per costruzione: il
  formato "flyer diviso in 2-3 pagine" richiesto dalle agenzie (vedi
  l'immagine di riferimento: hero, poi blocco percentuali+come
  funziona+showroom, poi perché-sceglierci+gallery+contatti, in
  scroll continuo, non a schermate fisse) **non entra in questo
  componente così com'è**. Serve un template nuovo, non un riuso.
- **Il tracciamento GA4 non ha bisogno di nessun cambiamento per una
  terza audience.** `analytics.js` e `trackingRef.js` non contengono
  nessuna logica legata al pubblico: l'unica cosa che distingue hotel
  da collaboratori in GA4 è l'hostname del sito (property unica,
  filtro per hostname, come da tua memoria di progetto). Una terza
  audience è semplicemente un terzo hostname. Nessun rischio qui,
  buona notizia.
- **Non ho trovato `netlify.toml` nel repo.** Questo mi dice che il
  binding sito→branch su Netlify è probabilmente configurato da
  dashboard (un sito Netlify punta al branch `main`, un altro al
  branch `collaboratori`), non da file in repo. Questo è un'ipotesi
  da confermare con te, non una certezza — non ho accesso al
  dashboard Netlify.

**In sintesi**: il metodo "branch per pubblico" ha funzionato finora
per un motivo preciso — vi siete fermati, quasi sempre, a cambiare solo
testo. Ma anche restando fermi solo al testo, un fix di config (Silktide)
si è già perso tra i branch. Con una terza audience che needs anche un
layout diverso, il metodo si romperebbe su due fronti insieme: contenuto
e struttura.

---

## 2. Architettura proposta

**Principio**: `main` diventa il tronco unico. Non contiene "il sito per
gli hotel" — contiene tutto ciò che è condiviso, più un meccanismo per
scegliere quale contenuto e quale template mostrare. Ogni pubblico
diventa un "content pack" (dati) più, se serve, un "template" (struttura
visiva). I branch `main`/`collaboratori`/futuro-`agenzie` continuano a
esistere solo perché Netlify lega un sito a un branch — ma la loro
differenza si riduce a una riga di configurazione, non a componenti
riscritti a mano.

Concretamente, sul codice che ho visto:

```
src/
  content/                     ← NUOVO: un content pack per audience
    hotel/
      index.js                 (aggrega le sotto-sezioni sotto)
      cover.js, servizi.js, clienti.js, contatti.js, ...
    collaboratori/
      index.js
      cover.js, servizi.js, clienti.js, contatti.js, ...
    agenzie/
      index.js
      hero.js, come-funziona.js, perche-sceglierci.js, ...
  config/
    audience.js                ← legge import.meta.env.VITE_AUDIENCE
                                  ('hotel' | 'collaboratori' | 'agenzie'),
                                  fa da switch per scegliere content pack
                                  e template
  components/
    slides/                    ← esistenti, ma NON contengono più testo
                                  hardcoded: ricevono i dati come props
                                  dal content pack
    templates/
      DeckContinuo.jsx          ← il pattern attuale (7 slide, h-screen,
                                   snap) rinominato/estratto, usato da
                                   hotel e collaboratori
      FlyerAPagine.jsx           ← NUOVO, per agenzie: 2-3 sezioni a
                                   altezza naturale, scroll continuo,
                                   non snap-per-viewport
  pages/
    Presentation.jsx             ← sceglie il template in base a
                                  config/audience.js, gli passa il
                                  content pack corrispondente
```

Ogni componente slide (`CoverSlide`, `ServicesSlide`, ecc.) smette di
avere testo scritto dentro e diventa puramente presentazionale: riceve
`titolo`, `descrizione`, ecc. come props, esattamente come già fa
`WorkflowSlide` con `workflow.js` oggi. Questo non è un'invenzione
nuova — è estendere a tutte le slide un pattern che nel progetto esiste
già, solo applicato finora a un solo file.

**Perché questa scelta e non altre — alternative considerate:**

- *Continuare con branch pieni, ma più disciplinati (checklist di sync
  manuale)*: scartata. Il problema del Silktide dimostra che la
  disciplina manuale fallisce anche con due soli branch attivi; con tre
  o più diventa questione di tempo prima di un altro fix perso o di un
  sito che va giù per un errore di merge incrociato.
- *Repo separato per ogni audience*: scartata. Duplica GA4 setup, tool
  di generazione ref/email, configurazione Silktide, build config — ogni
  fix di sicurezza o di tracciamento andrebbe fatto N volte a mano in N
  repository, rischio anche peggiore dei branch.
- *CMS o contenuto esterno (headless)*: scartata per ora — introduce una
  dipendenza e un servizio in più per un progetto che ha 3 audience e
  aggiornamenti poco frequenti; il costo non è giustificato rispetto a
  file dati versionati in git, che è già la convenzione del progetto.
- *Trunk + content pack + template (proposta sopra)*: un fix scritto una
  volta in un componente condiviso si applica a tutte le audience
  automaticamente; una nuova audience che riusa un template esistente
  costa solo un content pack; una che serve un layout nuovo costa un
  template in più, che resta disponibile per la successiva. Il
  compromesso è un refactor iniziale (spostare testo da JSX a dati) prima
  di poter aggiungere le agenzie — costo una tantum, non ricorrente.

---

## 3. Piano di migrazione — passi in ordine, ognuno verificabile e reversibile

L'obiettivo di ogni passo è: main (in produzione) non cambia
comportamento visibile finché il refactor non è finito e verificato.
Nessun passo tocca contenuto o layout — solo dove il contenuto vive.

1. **Refactor su `main`, a comportamento identico.** Estrarre il testo
   hardcoded da `CoverSlide`, `ServicesSlide`, `ClientsSlide`,
   `ContactSlide`, `AboutSlide` in file dati (`src/content/hotel/*.js`),
   sul modello già esistente di `workflow.js`/`services.js`. Verifica:
   diff visivo (screenshot prima/dopo) e `npm run build` + `npm run
   preview` identici. Si fa e si merge su `main` da solo, senza toccare
   `collaboratori`.
2. **Introdurre `config/audience.js` e il content pack `hotel`.**
   `Presentation.jsx` legge il content pack da lì invece che dai
   componenti. Ancora nessun cambiamento visibile su main. Deploy e
   verifica che `presentazione.rilievocontract.it` sia identico a prima.
3. **Riportare `collaboratori` sopra il nuovo main.** Non un merge
   automatico (i due branch sono già divergenti da tempo) — si ricrea il
   content pack `collaboratori` a mano confrontando il diff attuale
   (quello che ho già estratto sopra) con i file dati, e si elimina la
   duplicazione dei componenti. In questo passo si decide anche
   consapevolmente se il fix Silktide/typography va generalizzato (reso
   condiviso, con override per audience se davvero necessario) o se era
   un cambiamento voluto solo per quel pubblico — va chiesto a te, non
   deciso da solo. Verifica: `collaboratori.rilievocontract.it` identico
   a prima del refactor.
4. **Solo ora, costruire `FlyerAPagine.jsx`** riusando gli atomi UI
   esistenti (`SectionLabel`, `ServiceCard`, `ProcessStep`, `LogoMarquee`,
   `PageTitle`) più i pochi elementi nuovi che l'immagine richiede e che
   non esistono ancora (una fascia di badge con percentuale, tipo "fino
   al 10%" — da costruire come componente generico riusabile, non
   specifico delle agenzie, perché è plausibile che la prossima audience
   voglia lo stesso pattern).
5. **Content pack `agenzie`** con i testi dall'immagine, mappati sulle
   2-3 pagine concordate.
6. **Terzo sito Netlify** puntato su un branch `agenzie` che, a questo
   punto, differisce da main solo per una riga (`VITE_AUDIENCE=agenzie`
   o equivalente) — da confermare con te come sono configurati oggi i
   siti su Netlify, perché non l'ho visto nel repo.
7. **Nessuna modifica a `analytics.js`/`trackingRef.js`/GA4**: il terzo
   hostname distingue già l'audience nei dati, come per collaboratori.

Ogni passo è un commit/PR separato e verificabile da solo prima di
passare al successivo — se qualcosa non torna, si torna indietro di un
passo, non si rifà tutto.

---

## 4. Per il futuro: quarta, quinta audience

Con questa struttura, ogni nuova richiesta si risolve con una sola
domanda: riusa `DeckContinuo` o `FlyerAPagine` (basta un content pack), o
serve una terza forma visiva (un template in più, riusabile poi anche
lui)? In entrambi i casi il resto è meccanico e non tocca nessuna
audience esistente: nuovo content pack, nuovo hostname/sito Netlify,
zero modifiche a tracking o strumenti (email generator, ga4_report_builder
già leggono per lista contatti/CSV, indipendenti dal layout).

---

## 5. Rischi aperti e cose da confermarmi prima di procedere

- **Netlify**: come sono legati oggi i due siti ai branch (dashboard,
  build hook, altro)? Serve saperlo prima del passo 6.
- **Silktide/typography drift**: il fix di posizione icona fatto solo su
  `collaboratori` va portato su main ora (indipendentemente da questo
  progetto) o era intenzionale?
- **Le 2-3 pagine per le agenzie**: confermo la mappatura che ho ipotizzato
  dall'immagine (pagina 1: hero+intro: pagina 2: percentuali+come
  funziona+tocco Rilievo; pagina 3: perché sceglierci+gallery+contatti) o
  ne vuoi un'altra?
- **Timing**: il refactor dei passi 1-3 tocca main e collaboratori prima
  ancora di iniziare le agenzie. Va fatto ora con calma, non a ridosso
  dell'invio email ai 42 studi — se siete vicini a quell'invio, ha senso
  aspettare che sia completato prima di toccare `collaboratori`.

Nessuna modifica al codice è stata fatta. Aspetto conferma su questi
punti prima di procedere con il passo 1.
