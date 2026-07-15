// audience.js: unico punto che decide quale pubblico costruire in questa
// build. Legge VITE_AUDIENCE dalle variabili d'ambiente (impostata a
// livello di sito Netlify, non nel repo): 'hotel' | 'collaboratori' |
// 'agenzie'. Default 'hotel' quando la variabile non e' impostata, cosi'
// il comportamento resta identico a main finche' nessun sito la imposta
// esplicitamente (vedi _reference/PIANO_ARCHITETTURA_MULTI_AUDIENCE.md).
export const AUDIENCE_CORRENTE = import.meta.env.VITE_AUDIENCE || 'hotel';
