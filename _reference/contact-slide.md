# Dati precisi — slide 07 "Contatti"

> Testi allineati al branch `collaboratori` il 09/07/2026.

## Label e titolo
- SectionLabel "Parliamone": margin-bottom clamp(18px, 2.6vh, 30px) — override
  necessario, come già fatto per WorkflowSlide
- Titolo: usa --text-h1-hero (già in typography.css, il clamp più grande del
  deck: 40px-104px), font-weight 700, line-height 0.98 (più stretto del default
  1.04 usato altrove — override necessario anche su line-height, non solo margine)
  margin-bottom: clamp(20px, 3vh, 30px)
  Testo: "Parliamo del tuo" + <br> + "prossimo progetto." — SOLO "prossimo progetto."
  è in oro (#b8954e), il resto resta nel colore testo normale (cream). Serve uno
  span interno colorato, non tutto il titolo in un colore solo.
- Citazione in corsivo: usa --text-quote-contatti (già presente), Playfair
  Display italic, color rgba(cream, 0.8) — attenzione: è un'opacità all'80%,
  DIVERSA da text-cream/50 già usata altrove nel progetto. max-width: 36ch

## Griglia contatti (3 colonne)
- grid-template-columns: repeat(3, 1fr)
- gap: clamp(20px, 3vw, 52px)
- border-top: 1px solid rgba(cream, 0.16) — un'altra opacità nuova, diversa da
  /50 e /80 già in uso. In Tailwind: border-cream/16
- padding-top: clamp(20px, 3vh, 32px)
- NON è SlideFooter: è contenuto vero della slide, struttura a 3 colonne con
  label+valore, diversa dal semplice flex a 2 slot di SlideFooter. Costruire
  come markup proprio di ContactSlide, non forzare dentro SlideFooter esistente

## I 3 contatti (label — valore)
1. **Showroom** — "Viale Trento 5" + <br> + "09123 Cagliari" (due righe)
2. **Telefono** — "+39 349 726 5203" (link: tel:+393497265203)
3. **Email** — "rilievocontract@gmail.com" (link: mailto:rilievocontract@gmail.com)

Stile label (tutte e 3 uguali): font-size 11px, letter-spacing 0.2em, uppercase,
color oro, margin-bottom 8px

Stile valore (tutte e 3 uguali — NUOVO TOKEN, non esiste ancora in typography.css):
font-size clamp(15px, 1.2vw, 19px), line-height 1.4, color cream (default, non
serve override). Aggiungere a typography.css:
--text-contact-value: clamp(15px, 1.2vw, 19px);

## Note struttura
- Sfondo dark (#1c1c1a), come cover e clienti
- Nessun ScrollHint (è l'ultima slide, non c'è "sotto" verso cui scrollare)
- Nessun carosello: 3 colonne, contenuto breve, sta comodamente anche impilato
  su grid-cols-1 mobile — verificare comunque con scrollHeight/clientHeight
  prima di escludere il carosello con certezza, stesso principio delle altre slide
