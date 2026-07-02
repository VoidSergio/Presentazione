# Icone SVG servizi — slide 03 "Cosa facciamo"

Path esatti dall'HTML sorgente originale. Attributi comuni a tutte e 4:
viewBox="0 0 48 48", stroke="#b8954e" (usa var(--color-gold) o currentColor con
text-gold sul wrapper), stroke-width="1.3", stroke-linecap="round",
stroke-linejoin="round", fill="none", dimensione resa 40x40px.

## Hotel & Resort
```svg
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 34V18M5 34h38M43 34v-8M5 27h20a5 5 0 0 1 5 5"/>
  <path d="M8 34v4M40 34v4"/>
</svg>
```

## Ristoranti & Bar
```svg
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="24" cy="24" r="16"/>
  <circle cx="24" cy="24" r="8"/>
</svg>
```

## Retail & Flagship
```svg
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 18h26v22H11z"/>
  <path d="M18 18v-4a6 6 0 0 1 12 0v4"/>
</svg>
```

## Ville & Residenze
```svg
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 23 24 11l15 12v16H9z"/>
  <path d="M20 39V29h8v10"/>
</svg>
```

Nota: ho sostituito `stroke="#b8954e"` con `stroke="currentColor"` — così l'icona eredita
il colore dal wrapper (`text-gold`) invece di avere il colore hardcoded nell'SVG,
coerente con come Tailwind gestisce già gli altri colori del design system.
