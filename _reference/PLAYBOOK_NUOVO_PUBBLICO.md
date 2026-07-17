# Playbook: lancio di un nuovo pubblico/branch

Checklist operativa generalizzata, nata dall'esperienza `collaboratori` e pensata per essere riusata pari pari per il prossimo pubblico (es. agenzie immobiliari) e per quelli successivi.

Ogni volta che si lancia un nuovo pubblico si sta facendo, in sostanza, la stessa operazione: un nuovo branch → un nuovo hostname → una nuova scheda di analisi sulla stessa property GA4. Il grosso dell'infrastruttura è già pronto e si riusa; solo una parte va rifatta da zero.

---

## 0. Prima di iniziare

- [ ] Verificare di essere sul branch corretto (`git branch` / `git status`) **prima** di toccare qualsiasi file. Errore ricorrente nel percorso collaboratori: iniziare a lavorare pensando di essere su `main` mentre si era rimasti su `collaboratori` (o viceversa), con conseguenti commit nel branch sbagliato.
- [ ] Decidere subito nome branch e hostname definitivo (es. `agenzie-immobiliari` → `agenzie.rilievocontract.it`), così da poterli riusare identici in ogni step senza disallineamenti tra branch/DNS/GA4/copy.

---

## 1. Cosa si riusa automaticamente (nessun lavoro aggiuntivo)

Questi elementi sono già condivisi a livello di property/infrastruttura e coprono il nuovo pubblico senza bisogno di duplicazione:

- **Property GA4 condivisa** (`G-5GDZR18LN8`): non serve creare un nuovo data stream. Un solo stream, distinzione per hostname.
- **Dimensioni personalizzate**: `ref`, `slide_name`, `slide_number`, `type`, `target_slide`, `card_index` sono già registrate e continuano a funzionare per qualsiasi hostname/branch nuovo, perché l'evento le manda a prescindere dal pubblico.
- **Metrica personalizzata**: `seconds_spent`, idem come sopra.
- **Persistenza `?ref=` via sessionStorage**: la logica che sopravvive al routing SPA è generica, non serve toccarla.
- **Normalizzazione `slide_number`** a formato numerico: già gestita a livello di codice condiviso.
- **Silktide Consent Manager**: iniettato via CDN, nessun whitelisting di dominio richiesto — funziona automaticamente su qualsiasi nuovo hostname.
- **Google Consent Mode v2**: idem, configurazione condivisa.
- **Tooling Python** (`ga4_report_builder.py`): la logica di generazione dei profili per contatto e della pivot anonima è generica; non va riscritta, va solo puntata al nuovo CSV contatti (vedi sotto).
- **Generatore HTML email**: il tool di generazione link `?ref=` personalizzati è riusabile as-is, cambia solo la lista contatti in input.

**In breve: se è a livello di property GA4, dimensioni/metriche, consent management o tooling Python generico → non si tocca.**

---

## 2. Cosa va rifatto ogni volta

- [ ] **Nuovo branch git** dedicato al pubblico (es. `agenzie-immobiliari`), partendo dal branch più simile per contenuti/target come base.
- [ ] **Nuovo deploy Netlify** collegato al nuovo branch, con proprio sito/URL Netlify.
- [ ] **DNS (Hostinger)**: nuovo CNAME per il sottodominio dedicato (es. `agenzie.rilievocontract.it`), puntato al deploy Netlify.
- [ ] **Copy delle slide**: riscrittura mirata al nuovo pubblico (tono, argomentazioni, case study rilevanti). Verificare che `copy-slides.md` (o doc equivalente) resti allineato al codice reale — è già successo un disallineamento in passato.
- [ ] **og:image**: nuova immagine social preview specifica per il branch/hostname, con asset di brand coerenti (font, logo reale, non placeholder).
- [ ] **Nuova scheda Esplora in GA4** con filtro sull'hostname del nuovo branch (le esplorazioni non filtrano da sole, vanno duplicate/configurate ogni volta).
- [ ] **Nuovo CSV contatti** (`lista_ref_completa_XX.csv` o simile), **gitignored**, tenuto come unica fonte di verità in locale — mai committare la mappatura ref→contatto.
- [ ] **Nuovi ref code**: generati random (non derivati da MD5 — vedi errore storico sotto), uno per contatto.
- [ ] **`noindex`** attivo finché il sito è in fase di revisione interna, da rimuovere solo al lancio effettivo.
- [ ] Aggiornare `_reference/BRANCH_E_TARGET.md` (o doc equivalente) con branch, hostname e pubblico del nuovo lancio.

---

## 3. Errori e insidie già incontrati (da non riscoprire)

### Limite 5 dimensioni per riga in Esplora GA4
Le tabelle di Esplorazione GA4 accettano al massimo 5 dimensioni per riga. Se il profilo che si vuole costruire (es. profilo per contatto) richiede più dettaglio, va spezzato su più schede/esplorazioni invece di provare a stipare tutto in una riga sola.

### Bug Segmento/Totali
Attenzione al comportamento delle esplorazioni quando si combinano segmenti e righe "Totali": in passato si è verificato un bug/incoerenza tra il totale mostrato e la somma dei segmenti. Da verificare manualmente ogni volta che si costruisce una nuova scheda, non fidarsi del totale a priori.

### Non-retroattività delle dimensioni personalizzate
Le dimensioni/metriche personalizzate in GA4 **non sono retroattive**: i dati raccolti prima della loro creazione non vengono valorizzati per quelle dimensioni, anche se l'evento veniva già mandato. Implicazione pratica: se si aggiunge una nuova dimensione per il nuovo pubblico, i dati "storici" di test raccolti prima di quel momento saranno incompleti — non è un bug del report, è una caratteristica di GA4.

### Differenza CMD/PowerShell per i comandi Python
Gli stessi comandi Python (es. per lanciare `ga4_report_builder.py`) possono richiedere sintassi leggermente diversa tra CMD e PowerShell su Windows (quoting, escaping, variabili d'ambiente). Verificare quale shell si sta usando prima di copiare comandi da una sessione precedente.

### Attenzione al branch attivo prima di lavorare
Ribadito perché è l'errore più insidioso: essere sicuri del branch attivo **prima** di ogni sessione di lavoro (codice, copy, o anche solo verifica), perché con due branch/hostname paralleli è facile modificare o testare la cosa sbagliata senza accorgersene subito.

### Ref code non deterministici
Documentazione precedente indicava erroneamente ref code derivati da MD5. In realtà i ref code storici (e quelli da generare per i nuovi pubblici) sono random. Non fare assunzioni di derivabilità/riproducibilità del ref a partire dal nome contatto.

---

## 4. Checklist finale pre-lancio (da ripetere per ogni nuovo pubblico)

- [ ] Deploy verificato e raggiungibile sull'hostname definitivo
- [ ] og:image verificato in anteprima social (post-deploy, non solo in locale)
- [ ] Eventuali elementi UI fissi (es. icona cookie Silktide) verificati per non sovrapporsi a contenuti chiave delle slide
- [ ] Un test end-to-end fresco con un nuovo `?ref=` mai usato prima, verificato in GA4 (DebugView o Esplora debug) prima di inviare le email reali
- [ ] Nuova scheda Esplora con filtro hostname pronta e verificata con dati del test end-to-end
- [ ] CSV contatti del nuovo pubblico pronto, gitignored, non committato
- [ ] `noindex` rimosso solo a lancio confermato
