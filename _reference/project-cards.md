# Dati precisi — slide 05 "Lavori scelti"

## Eyebrow (es. "Hotel 5★ · Cagliari")
- font-size: 11px
- letter-spacing: 0.16em
- text-transform: uppercase
- color: #b8954e (oro — stesso token di SectionLabel, NON muted)
- margin-bottom: 6px

## Titolo h3 (es. "Palazzo Doglio")
- font-family: Playfair Display
- font-weight: 600
- font-size: clamp(20px, 1.6vw, 28px) — corrisponde a --text-h3-project, già presente in typography.css
- margin: 0 0 8px (solo margin-bottom 8px)

## Descrizione
- font-size: 13.5px (valore letterale, non un clamp — unica card senza scaling fluido)
- line-height: 1.5
- color: #55524a (muted)
- margin: 0

## Contenitore immagine
- aspect-ratio: 4/3
- margin-bottom: clamp(14px, 2vh, 20px)
- background: #e5dfd2 (token placeholder, visibile durante il caricamento immagine)
- overflow: hidden
- img: width 100%, height 100%, object-fit cover, NESSUN object-position custom
  (a differenza di officina.png nella slide 02, qui le 3 foto usano il default
  centrato — non serve calibrare)

## Griglia desktop
- grid-template-columns: repeat(3, 1fr)
- gap: clamp(24px, 2.6vw, 44px)
