// SlideHeader: riga fissa in alto a ogni slide, wordmark "RILIEVO CONTRACT"
// a sinistra e numero pagina a destra. Il colore del testo dipende dallo
// sfondo della slide (contrasto opposto, stessa regola del logo). "centro"
// e' opzionale (solo la slide 01 di agenzie lo usa, per l'eyebrow "Proposta
// di partnership"): grid a 3 colonne (1fr auto 1fr) invece di flex, cosi'
// la colonna centrale resta centrata sull'intera riga a prescindere dalla
// larghezza diversa di wordmark/numero pagina a sinistra/destra. Nascosto
// sotto sm perche' un eyebrow lungo affiancato a wordmark+numero non ci
// sta su schermi stretti (vedi max-sm:hidden sul contenuto, non sulla
// colonna: la colonna vuota non occupa spazio se il contenuto e' hidden).
// whitespace-nowrap su wordmark e numero: senza, a esattamente 640px
// (sm, dove "centro" inizia a comparire) la colonna 1fr sinistra si
// schiaccia sotto ai ~135px che "RILIEVO CONTRACT" richiede e il testo va
// a capo, raddoppiando l'altezza dell'header (bug trovato il 17/07/2026).
// "centro" invece puo' andare a capo se serve: e' testo lungo (eyebrow),
// non un wordmark, va a capo bene su piu' righe senza spezzare parole a
// meta'.
function SlideHeader({ numeroSlide, sfondo, centro }) {
  let classeTesto = 'text-dark/40';
  if (sfondo === 'dark') {
    classeTesto = 'text-cream/50';
  }

  return (
    <div className={'grid grid-cols-[1fr_auto_1fr] items-center text-xs tracking-widest uppercase font-sans ' + classeTesto}>
      <span translate="no" className="whitespace-nowrap">Rilievo Contract</span>
      <span className="max-sm:hidden justify-self-center text-gold text-center px-4">{centro}</span>
      <span className="justify-self-end whitespace-nowrap">{numeroSlide}</span>
    </div>
  );
}

export default SlideHeader;
