# Rilievo Contract — Stato del progetto (presentazione + email marketing)

Ultimo aggiornamento: luglio 2026. Documento di riferimento per riprendere il
lavoro in qualunque sessione futura, senza dover ricostruire il contesto da zero.

---

## 1. La presentazione web — cosa è e come è stata fatta

### Origine
Il punto di partenza era un PDF statico (company profile / presentazione
commerciale), generato da Claude Design come export di un documento HTML
interattivo (formato "a slide", scroll-snap verticale, pensato per uso desktop).
Il PDF da solo aveva due limiti: non era responsive (illeggibile/scomodo su
mobile) e non era interattivo (nessuno scroll fluido, nessun caricamento
dinamico, nessuna possibilità di tracciamento).

### Stack tecnico
- **React 18 + Vite** — build tool, dev server, bundling
- **Tailwind CSS v4** — design tokens dichiarati via `@theme` direttamente in
  `index.css` (non più `tailwind.config.js`, cambiato rispetto a Tailwind v3)
- Struttura a componenti modulare: `SlideLayout`, `SlideHeader`, `SlideFooter`,
  `NavigationDots` (layout comune), `SectionLabel`, `PageTitle`, `ServiceCard`,
  `ProjectCard`, `LogoCard`, `ProcessStep`, `MobileCarousel`, `ScrollHint`,
  `LogoMarquee` (componenti UI riutilizzabili), 7 componenti slide dedicati
  (`CoverSlide` → `ContactSlide`)
- Dati (testi, contatti, servizi, progetti, workflow) separati in file puri
  sotto `src/data/`, senza logica — pensati per essere riusati anche fuori dal
  sito (es. contenuti social) senza duplicare testo

### Design tecnico rilevante
- **Scroll-snap verticale** tra le 7 slide (`snap-y snap-mandatory`), navigabile
  con frecce/PageUp/PageDown/Home/End da tastiera, dots di navigazione laterali
  su desktop (nascosti su mobile)
- **Effetto "una slide = uno schermo" mantenuto identico su desktop e mobile**
  (mai sostituito con altezza variabile): dove il contenuto reflowato su mobile
  rischiava di non stare in `100vh` (slide con griglie a 4 colonne), la
  soluzione è un **carosello orizzontale con swipe** (`MobileCarousel`), non
  una sezione che si allunga
- **Hint di scroll** (verticale sulla cover, orizzontale sui caroselli) con
  dismissal condivisa tra slide nella stessa sessione (sessionStorage + evento
  custom), per non ripetere la stessa indicazione più volte inutilmente
- **Slide clienti (04)**: griglia statica 4×3 su desktop, marquee a scorrimento
  automatico continuo su due righe (direzioni opposte, dissolvenza ai bordi,
  filetti oro) su mobile — variante "Vetrina", scelta dopo esplorazione di 3
  alternative con Claude Design, per evitare l'overflow di 12 loghi in `100vh`
  senza sacrificare leggibilità. Rispetta `prefers-reduced-motion`
- **Traduzione automatica browser bloccata su parole specifiche**
  (`translate="no"` su "Rilievo Contract", "Contract", "Sudlegno", blocco
  contatti) — il resto del testo resta traducibile per clienti internazionali
- **Meta tag Open Graph** per anteprime social (WhatsApp, LinkedIn) quando il
  link viene condiviso, con immagine cover dedicata
- **Favicon personalizzata** — simbolo geometrico del brand estratto dalla
  brochure PDF (era grafica vettoriale, ritaglio pulito), non il default Vite

### Vantaggi concreti rispetto al PDF statico
1. **Responsive vero**: si adatta a schermo intero, da telefono a desktop,
   senza le barre di scroll/zoom scomode tipiche di un PDF su mobile
2. **Interattivo**: navigazione fluida, swipe sui contenuti a schede, marquee
   animato — un PDF è statico per definizione
3. **Aggiornabile senza rimandare nulla**: cambiare un testo o una foto richiede
   un nuovo deploy (minuti), non rigenerare e reinviare un file a tutti
4. **Condivisibile con un link**, non un allegato pesante — meno rischio di
   finire in spam, anteprima visiva immediata quando condiviso su chat/social
5. **Tracciabile** (in prospettiva, vedi sezione 4): un PDF aperto localmente
   non dice nulla su chi l'ha guardato o fino a che punto; un sito web sì
6. **Il PDF resta comunque disponibile** come alternativa per chi preferisce
   scaricare un file — non è stato eliminato, è un'opzione in più, non l'unica

---

## 2. Dove è pubblicata

- **URL**: `https://presentazione.rilievocontract.it`
- È un **sottodominio** di rilievocontract.it, separato dal sito principale
  (che gira su Website Builder Hostinger e non è stato toccato in alcun modo)
- Il sottodominio **punta a un progetto ospitato su Netlify**
  (`presentazione-rilievo.netlify.app` è l'hosting reale, il sottodominio è
  solo un puntamento DNS)
- **Configurazione DNS su Hostinger** (motivo: il piano Website Builder non
  espone un File Manager tradizionale, quindi non era possibile caricare la
  build direttamente lì):
  - Record **TXT** per la verifica di proprietà del dominio richiesta da Netlify
  - Record **CNAME** con nome `presentazione`, valore puntato a
    `presentazione-rilievo.netlify.app`
- **Certificato SSL** generato automaticamente da Netlify (Let's Encrypt) dopo
  la verifica DNS
- **Indicizzazione motori di ricerca**: al momento bloccata di proposito
  (`<meta name="robots" content="noindex, nofollow">`), il sito è ancora in
  fase di revisione interna — da rimuovere quando si decide di renderlo
  pubblico e ricercabile
- **Reversibilità**: l'intera configurazione è un solo record DNS — rimuoverla
  non tocca in alcun modo il sito principale rilievocontract.it, nessun rischio

---

## 3. Email marketing

### Come è stata costruita
Invio attuale tramite **Gmail normale** (non un tool di email marketing
dedicato, per ora — vedi sezione 5 sui prossimi passi). Il problema di
partenza: Gmail non permette di costruire un layout email complesso a mano
tramite la sua interfaccia (niente colonne, niente sfondo pieno, niente
bottoni veri) — e uno strumento come Canva non è adatto perché esporta solo
immagini piatte (un solo link possibile su tutta l'immagine, niente testo
vero, rischio spam per email quasi solo-immagine).

**Soluzione adottata**: un file HTML email vero, scritto con le tecniche
standard per la compatibilità email (tabelle invece di flexbox/grid, stili
inline, font fallback web-safe perché Playfair Display/Inter non si vedono
nella maggior parte dei client email — Georgia per i titoli, Arial per il
corpo testo).

### Design dell'email
- Palette **campionata pixel-per-pixel** da una proposta visiva alternativa
  (non i colori ufficiali del sito): sfondo grigio-verde `#686B72`, riga
  divisoria teal `#2E6A74`, bottone champagne `#D8C2AA`
- Layout: logo in alto, riga divisoria, immagine hero cliccabile (foto
  villa/piscina, ritagliata appositamente a 600×370px — il file sorgente era
  quasi quadrato, serviva un ritaglio dedicato per non occupare troppo spazio
  verticale), titolo a due righe, bottone CTA, due paragrafi di testo su fascia
  cream a bordo intero (non box arrotondati: leggibilità garantita — il testo
  scuro diretto sul grigio-verde ha un contrasto sotto la soglia minima
  raccomandata — ma senza l'effetto "riquadro appiccicato"), footer contatti
  con link email ricolorato esplicitamente (di default i client email
  colorano i link di blu automaticamente)
- Copy scritto in prima persona (firmato "Matteo"), con menzione diretta di
  clienti (Palazzo Fiuggi, ForteVillage, Prada Luna Rossa) — approccio da
  outreach di collaborazione diretta, non presentazione generica

### Come si usa (procedura per ogni invio)
1. Aprire il file `.html` del template in un browser
2. Selezionare tutto il contenuto renderizzato (Ctrl+A) e copiarlo (Ctrl+C)
3. Incollarlo (Ctrl+V) dentro il corpo di una nuova email in Gmail — l'incolla
   di contenuto già renderizzato da browser mantiene tabelle, colori di
   sfondo, immagini e link molto meglio di quanto si riuscirebbe scrivendo a
   mano con la barra degli strumenti di Gmail
4. Verificare che i link (immagine hero + bottone) siano cliccabili prima di
   inviare, mandando sempre un test a se stessi prima dell'invio reale

### Salvarla come modello Gmail (da fare, non ancora fatto)
Per averla pronta all'uso senza rifare copia-incolla ogni volta: Gmail ha una
funzione "Modelli" nativa, da attivare in **Impostazioni → Visualizza tutte le
impostazioni → Avanzate → Modelli → Abilita**. Una volta attiva, si scrive
l'email una volta (col procedimento sopra), poi dal menu dei tre puntini nella
finestra di composizione: **Modelli → Salva bozza come modello → Salva come
nuovo modello**. Da quel momento è richiamabile in un click per ogni nuovo
invio, senza ripetere il copia-incolla da file HTML.

### Immagini usate nell'email
Ospitate sullo stesso dominio del sito (`presentazione.rilievocontract.it/images/`),
non allegati né immagini incorporate — stesso principio di affidabilità del
sito stesso.

---

## 4. Prossimi passi da studiare (solo promemoria, piano dettagliato da fare a parte)

Punti discussi ma non ancora pianificati in dettaglio — da riprendere con lo
stesso approccio usato per l'email (piano scritto, poi implementazione):

- **Tracciamento drop-off per slide**: sapere a quale slide gli utenti
  smettono di guardare (infrastruttura già pronta lato codice, manca solo
  l'aggancio a un evento analytics)
- **Microsoft Clarity**: heatmap, movimento del mouse, registrazioni di
  sessione reali — gratuito, un solo script da aggiungere
- **Link personalizzati per destinatario**: per sapere non solo "qualcuno ha
  cliccato" ma "quale azienda/persona specifica" — utile solo per invii
  mirati a pochi contatti, non per liste ampie
- **Considerazioni GDPR**: se si combina tracciamento dettagliato con
  l'identità di persone reali (link personalizzati + heatmap), serve
  attenzione formale (informativa privacy aggiornata)
- **Eventuale passaggio a un tool di email marketing vero** (Brevo o simile)
  se la lista cresce oltre la gestione manuale via Gmail — darebbe
  aperture/click per destinatario nativamente, senza bisogno di link
  personalizzati manuali
