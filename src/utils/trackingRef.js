// trackingRef.js: legge il parametro ?ref= dall'URL una sola volta al
// caricamento della pagina (provenienza email, vedi PIANO_TRACCIAMENTO_
// ANALYTICS.md). Tenuto in una variabile di modulo, MAI in localStorage/
// sessionStorage: e' un dato potenzialmente collegabile a un destinatario
// specifico, non deve sopravvivere oltre la sessione del tab corrente.
const parametriUrl = new URLSearchParams(window.location.search);
const refCorrente = parametriUrl.get('ref');

export function getRef() {
  return refCorrente;
}
