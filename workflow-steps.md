# Dati precisi — slide 06 "Come lavoriamo"

## Label e titolo
- SectionLabel "Come lavoriamo": margin-bottom clamp(10px, 1.5vh, 16px)
  (leggermente diverso dal default — verificare se SectionLabel accetta un
  override di margin o se va gestito con un wrapper)
- PageTitle "Un solo interlocutore, dall'idea alla consegna.": usa --text-h2-md
  (stesso token di ServicesSlide), margin-bottom clamp(34px, 5vh, 60px),
  max-width 20ch (va a capo naturalmente entro quella larghezza, non serve <br />)

## Griglia
- grid-template-columns: repeat(4, 1fr)
- gap: clamp(20px, 2.4vw, 44px) — diverso dal gap di ServicesSlide
  (clamp(24px,3vw,52px)), non riusare lo stesso valore

## ProcessStep (ogni singolo step)
- border-top: 1px solid #1c1c1a (token "dark", NON "border" — conferma quanto
  già segnalato: diverso da ServiceCard che usa #d9d2c4)
- padding-top: clamp(14px, 2vh, 20px)
- Numero (es. "01"): Playfair Display 700, clamp(30px,3vw,46px) — corrisponde
  a --text-process-number già in typography.css, color oro (#b8954e), line-height 1
- Titolo h3 (es. "Rendering"): Playfair Display 600, clamp(18px,1.4vw,24px) —
  corrisponde a --text-h3-process già in typography.css, margin:
  clamp(12px,1.8vh,18px) 0 6px (margine SOPRA dal numero, non solo sotto)
- Descrizione: 13.5px fisso, line-height 1.5, color muted (#55524a), margin 0
  (identico a ProjectCard, non un nuovo valore)

## I 4 step (numero — titolo — descrizione)
1. **Rendering** — "Vedi lo spazio prima che esista."
2. **Progetto** — "Materiali, misure, budget: tutto definito."
3. **Produzione & selezione** — "Officina propria e i migliori brand, insieme."
4. **Consegna** — "Montaggio e posa. Chiavi in mano."

## Note struttura
- Nessun SlideFooter (come slide 02, 03)
- Su mobile: MobileCarousel colonneDesktop={4}, stesso pattern di ServicesSlide
  ma NON riusare ServiceCard — il border-top ha colore diverso, serve ProcessStep
  come componente a sé
- ScrollHint variant="horizontal" con la stessa chiave sessionStorage condivisa
  di 03/05
