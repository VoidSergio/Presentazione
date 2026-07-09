> **Questi testi sono per il pubblico COLLABORATORI, branch `collaboratori` — non applicare a `main` senza rivedere.**

# Rilievo Contract — Spec tecnica del progetto

Documento di riferimento per lo sviluppo. Da tenere nel repo e passare a Claude Code
all'inizio di ogni sessione di lavoro, cosi non serve rispiegare il design system ogni volta.

---

## 1. Design tokens

### Colori (Tailwind v4 — @theme in src/index.css, NON tailwind.config.js)

Il progetto usa Tailwind v4 con `@tailwindcss/vite`, quindi i token si dichiarano
direttamente in CSS con `@theme`, non in un file `tailwind.config.js` (che in questo
progetto non esiste):

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-dark: #1c1c1a;
  --color-cream: #f8f5ef;
  --color-gold: #b8954e;
  --color-muted: #55524a;
  --color-border: #d9d2c4;
  --color-placeholder: #e5dfd2;

  --font-sans: "Inter", sans-serif;
  --font-display: "Playfair Display", serif;
}
```

Le classi restano identiche a quelle previste in origine (`bg-dark`, `text-gold`,
`font-display`), cambia solo dove e come sono dichiarate.

I testi secondari su sfondo chiaro o scuro NON hanno un colore fisso: sono opacita
dello stesso colore di base. Non creare variabili tipo `lightMuted`, usare la sintassi
nativa di Tailwind:

```
text-cream/50   -> testo secondario su sfondo dark (usato su slide 01, 04, 07)
text-dark/40    -> testo secondario su sfondo cream (usato per numerazione pagina su slide 02, 03, 05, 06)
```

### Tipografia fluida (clamp)

I titoli usano `clamp()`, non step fissi di Tailwind. Definire come CSS custom
properties in `src/styles/typography.css` e richiamarle con arbitrary values:

```css
:root {
  --text-h1-hero: clamp(40px, 6.4vw, 104px);   /* slide 07 contatti */
  --text-h2-lg: clamp(34px, 4.4vw, 66px);       /* slide 02 chi siamo */
  --text-h2-md: clamp(30px, 3.8vw, 56px);       /* slide 03, 06 */
  --text-h2-clienti: clamp(30px, 4vw, 58px);    /* slide 04 */
  --text-quote-cover: clamp(22px, 3vw, 44px);   /* slide 01 */
  --text-quote-contatti: clamp(18px, 1.8vw, 28px); /* slide 07 */
}
```

```jsx
className="text-[length:var(--text-h2-lg)]"
```

### Pesi Playfair Display (uso reale, non tutti ovunque)

- `700` / `800` -> h2 titoli sezione, wordmark cover
- `600` -> h3 delle card, numeri "01 02 03 04" del processo
- `500` italic -> citazioni (cover, contatti)

---

## 2. Struttura cartelle

```
src/
  components/
    layout/
      SlideLayout.jsx        # wrapper singola slide: padding, background, sempre h-screen (100vh) su ogni breakpoint — vedi nota sotto
      SlideHeader.jsx        # riga in alto: "RILIEVO CONTRACT" + numero pagina
      SlideFooter.jsx        # riga in basso quando presente (es. cover, contatti)
      NavigationDots.jsx     # dots laterali desktop, nascosti su mobile (hidden md:flex)
    ui/
      SectionLabel.jsx        # label piccola maiuscola oro (es. "CHI SIAMO")
      PageTitle.jsx            # h2 Playfair Display, gestisce internamente il clamp corretto per slide
      ServiceCard.jsx          # stile diretto (border-t border-border), NON estende un Card generico
      LogoCard.jsx              # card bianca con logo cliente (era ClientLogoCard nella bozza precedente)
      ProjectCard.jsx          # stile diretto, nessun bordo/box
      ProcessStep.jsx
      MobileCarousel.jsx      # wrapper riutilizzabile per griglia 4-up -> swipe mobile
      ScrollHint.jsx          # hint verticale (cover) e orizzontale (carousel)
    slides/
      CoverSlide.jsx
      AboutSlide.jsx
      ServicesSlide.jsx
      ClientsSlide.jsx
      ProjectsSlide.jsx
      WorkflowSlide.jsx       # era ProcessSlide nella bozza precedente, rinominata per coerenza con "Come lavoriamo"
      ContactSlide.jsx
  pages/
    Presentation.jsx          # monta SlideLayout deck: scroll-snap verticale, keyboard nav, stato slide attiva
  data/
    slides.js                 # array unico con i dati di tutte le 7 slide (vedi nota sotto)
  hooks/
    useSlideNavigation.js     # logica keyboard + scroll + stato slide attiva
    useFirstInteraction.js    # per nascondere gli hint dopo il primo scroll/swipe
  styles/
    typography.css
  App.jsx
```

**Nota importante su SlideLayout — altezza sempre fissa:** l'effetto "una slide = uno
schermo" va mantenuto identico su desktop e mobile, MAI sostituito con `min-h-screen`
o `height: auto`. Se il contenuto reflowato su mobile (es. 4 card che diventano 2x2)
rischia di superare `100vh` e tagliarsi, la soluzione e il carosello orizzontale
(`MobileCarousel.jsx`, vedi sezione 5), non l'allungamento della sezione. Questa
decisione e stata presa esplicitamente dopo aver confrontato le alternative — non
tornare a `min-h-screen` su mobile anche se sembra la scorciatoia piu semplice.

Nota sul naming: questa struttura riprende quella generata automaticamente da Claude Design
(vedi export .zip del progetto), che separa Header/Footer/Dots come componenti singoli invece
di accorparli in un solo `SlideDeck.jsx`. E' una decomposizione piu pulita, mantenuta qui.

**Decisione presa in corso d'opera — niente `Card.jsx` generico, niente `GoldDivider.jsx`
a se stante:** verificando l'HTML originale, `ServiceCard` (solo border-top, nessun box),
`ProjectCard` (nessun bordo) e `LogoCard` (sfondo bianco pieno, nessuno stroke) sono tre
trattamenti visivi troppo diversi tra loro per condividere una base comune — un `Card.jsx`
avrebbe richiesto essere quasi interamente sovrascritto da ciascuno. Stessa cosa per
`GoldDivider`: compare solo nella cover, mai altrove, quindi non vale la pena estrarlo come
componente separato — resta una `<div>` inline dentro `CoverSlide.jsx`.

Nota su `data/`: nel codice reale sono stati usati file separati per categoria
(`clients.js`, `projects.js`, `workflow.js`, `contacts.js`), non un file unico
`data/slides.js` come Claude Design aveva inizialmente proposto — scelta
migliore se in futuro il contenuto va riusato per altri output (es. post
Instagram), perche' ogni categoria resta isolata e importabile a se'.

**Incoerenza da correggere**: i dati dei servizi (slide 03, "Cosa facciamo")
sono rimasti hardcoded dentro `ServicesSlide.jsx`, mai estratti in un
`services.js` — unica slide su 5 senza un file dati proprio, rompendo la
convenzione seguita da tutte le altre. Da allineare quando si ha occasione
(vedi task di manutenzione).

```js
export const services = [ ... ];
export const clients = [ ... ];
export const projects = [ ... ];
export const workflow = [ ... ];
```

---

## 3. Comportamento responsive per slide

Ordine post-riordino dell'08/07/2026 (scambiate "Lavori scelti" e "Chi siamo",
vedi STATO_PROGETTO_PRESENTAZIONE_E_MARKETING.md sezione 4).

| Slide | Desktop | Mobile |
|---|---|---|
| 01 Cover | invariato, clamp scala da solo | invariato |
| 02 Lavori scelti | `grid-cols-3`, gap `clamp(24px,2.6vw,44px)` | **Carosello confermato** (non più ipotetico): `MobileCarousel colonneDesktop={3}`, stesso pattern di 03/05. Aritmetica: una card ~355px, tre impilate ≈1100px contro ~720px utili — overflow certo con `grid-cols-1`. `ScrollHint variant="horizontal"` incluso, stessa chiave sessionStorage condivisa con 03/05. |
| 03 Cosa facciamo | `grid-cols-4` | `MobileCarousel`: swipe orizzontale, 1 card per volta (`flex-none w-[78%] snap-start`) |
| 04 Clienti | `grid-cols-4` x3 righe | `LogoMarquee` (variante "Vetrina"): due righe a scorrimento automatico continuo in direzioni opposte, dissolvenza ai bordi, rispetta `prefers-reduced-motion` — la griglia statica non stava in 100vh nemmeno a `grid-cols-2` |
| 05 Come lavoriamo | `grid-cols-4` | `MobileCarousel` (stesso pattern di 03) |
| 06 Chi siamo | grid `1.05fr 1fr`, foto `aspect-[4/5]` | `grid-cols-1`, foto sotto il testo. **Crop diverso da desktop, intenzionale:** `aspect-[4/3]` invece di `4/5`, foto a `w-full` con altezza determinata dal rapporto (non altezza fissa con larghezza libera — quello causava una deformazione non voluta). Deciso dopo test visivo: il crop più orizzontale copre meglio la larghezza su schermo stretto. Mantenere lo stesso `object-position` del desktop. |
| 07 Contatti | `grid-cols-3` | `grid-cols-1` |

`MobileCarousel` e riutilizzabile: prende un array di children e sotto `md:` torna
automaticamente a griglia normale (`md:grid md:grid-cols-4 md:overflow-visible`).

---

## 4. Scroll hint

**Verticale** (`ScrollHint variant="vertical"`)
- Visibile solo su slide 01 (cover)
- Testo "Scorri" + freccia giu, animazione pulse sull'opacita (no bounce, no rotazione)
- Sparisce al primo scroll registrato dal container principale (`sessionStorage`, non serve persistere tra sessioni)

**Orizzontale** (`ScrollHint variant="horizontal"`)
- Visibile solo su slide 03 e 06, solo su viewport mobile
- Icona doppia freccia sinistra/destra o testo piccolo "scorri le card"
- Sparisce al primo `scrollLeft` registrato sul carosello di quella slide, non al primo scroll verticale della pagina

Entrambi gestiti dall'hook `useFirstInteraction.js`, che espone `hasInteracted`
e un metodo `markInteracted()` da chiamare sul primo evento di scroll rilevante.

---

## 5. Nested scroll-snap

- Verticale: `snap-y snap-mandatory` sul container principale (`SlideDeck`), invariato da com'era nell'HTML originale
- Orizzontale: `snap-x snap-mandatory` solo dentro `MobileCarousel`, solo su mobile
- Nessun conflitto tra i due, ma testare su iOS Safari reale: a volte lo snap verticale della pagina puo "rubare" il gesto di swipe orizzontale se il touch parte troppo vicino al bordo della card

---

## 6. Convenzioni di codice

- Niente operatore ternario, niente optional chaining (`?.`), niente nullish coalescing (`??`), niente `.reduce()` complessi
- Sempre `if/else` esplicito con parentesi graffe, sempre `for` esplicito con nomi di variabili accumulatore descrittivi
- Nomi delle variabili in italiano semplice o inglese piano, mai abbreviazioni criptiche
- Ogni componente ha un commento di intestazione che spiega cosa fa e dove viene usato, es:

```jsx
// ServiceCard: card di un singolo servizio nella slide 03 "Cosa facciamo".
// Riceve titolo, descrizione e icona SVG dal file data/services.js.
// Usata sia in griglia (desktop) sia dentro MobileCarousel (mobile).
function ServiceCard({ title, description, icon }) {
  ...
}
```

- I file in `data/` restano puri dati (nessuna logica), cosi lo stesso contenuto
  potra essere riusato in futuro per l'export dei post Instagram senza duplicare nulla

---

## 7. Asset disponibili non ancora usati nell'HTML

Nella cartella `assets/images` del progetto originale (export Claude Design) ci sono
immagini presenti sul disco ma non referenziate da nessuna parte nell'HTML attuale.
Confermato direttamente con Claude Design: non esiste una nota o un piano relativo
a queste immagini, sono semplicemente materiale caricato/generato e mai scelto —
vanno trattate come materiale grezzo disponibile, non come un progetto abbandonato.
Decidere liberamente se e come usarle prima di scrivere `data/slides.js`:

- `proj-baita.png`, `proj-restaurant.png`, `proj-room-blue.png`, `proj-suite.png`,
  `proj-villa.png` — foto progetto extra, eventualmente per espandere la slide 05
  "Lavori scelti" oltre i 3 progetti attuali (Palazzo Doglio, ForteVillage, Yacht Club)
- `rilievo-gold.png`, `sudlegno-cream.svg` — varianti logo non usate nell'HTML attuale

**Regola di contrasto logo (confermata dal pattern nel codice):** il logo/wordmark
usato e sempre di contrasto opposto allo sfondo della sezione — logo chiaro
(`rilievo-white.png`) su sfondo scuro (`#1c1c1a`, slide 01), logo scuro (`sudlegno.svg`)
su sfondo chiaro (`#f8f5ef`, slide 02). Da applicare come regola generale nel
componente che gestisce i loghi in `SlideHeader.jsx` o dove serve: se la variante
"cream"/"gold" verra usata in futuro, seguire la stessa logica.

**Materiale grezzo non processato:** la cartella `assets/images/uploads` contiene
`Brochure2025.pdf`, alcune foto ritagliate al volo (`pasted-*.png`), foto aggiuntive
di Palazzo Doglio e Yacht Club Costa Smeralda, e un file `logo nuovo.svg`. Claude
Design conferma che non c'e stata una valutazione esplicita di questo materiale
per la presentazione — e semplicemente materiale di partenza mai processato. Vale
la pena rivederlo a mano prima di finalizzare i contenuti, visto che un formato
scrollabile ha piu spazio dei 7 slide fissi originali.

**Nota generale:** non esiste un documento di design separato. Ogni decisione
(struttura a 7 slide, lunghezza dei testi, stile dei bordi) e visibile solo
nell'HTML stesso — quello che non e nel markup semplicemente non e stato deciso.
Questo significa che le scelte su come espandere il progetto (es. quanti lavori
scelti mostrare, se usare le foto extra) sono libere, non vincolate da una logica
pregressa da rispettare.

---

## 8. Ordine di sviluppo consigliato (una task alla volta con Claude Code)

1. Setup tema: token colori/font in `@theme` dentro `src/index.css` (Tailwind v4, NON `tailwind.config.js` — vedi sezione 1) + `typography.css` con i clamp
2. `Presentation.jsx` + `useSlideNavigation.js` — scroll-snap verticale, keyboard nav (senza contenuto reale, solo 7 slide vuote per testare la navigazione)
3. `SlideLayout.jsx`, `SlideHeader.jsx`, `NavigationDots.jsx` — struttura comune riutilizzata da tutte le slide
4. `ScrollHint.jsx` + `useFirstInteraction.js` — solo variante verticale, testata sulla cover
5. `CoverSlide.jsx` + `SlideFooter.jsx` — prima slide reale con contenuto
6. `AboutSlide.jsx` — testa il grid `1.05fr 1fr` e il reflow mobile a 1 colonna
7. `MobileCarousel.jsx` — componente generico, testato in isolamento prima di integrarlo
8. `ServicesSlide.jsx` — prima slide che usa `MobileCarousel`, aggiungere qui anche `ScrollHint variant="horizontal"`
9. Le restanti slide (`ClientsSlide`, `ProjectsSlide`, `WorkflowSlide`, `ContactSlide`) — piu veloci perche riusano componenti gia pronti
10. Decidere se e come integrare gli asset non ancora usati (foto progetto extra, varianti logo) prima di finalizzare `data/slides.js`
11. Verifica finale su device reale: iOS Safari (nested scroll-snap), Android Chrome, e i breakpoint intermedi (tablet)
