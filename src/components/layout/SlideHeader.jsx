// SlideHeader: riga fissa in alto a ogni slide, wordmark "RILIEVO CONTRACT"
// a sinistra e numero pagina a destra. Il colore del testo dipende dallo
// sfondo della slide (contrasto opposto, stessa regola del logo).
function SlideHeader({ numeroSlide, sfondo }) {
  let classeTesto = 'text-dark/40';
  if (sfondo === 'dark') {
    classeTesto = 'text-cream/50';
  }

  return (
    <div className={'flex items-center justify-between text-xs tracking-widest uppercase font-sans ' + classeTesto}>
      <span>Rilievo Contract</span>
      <span>{numeroSlide}</span>
    </div>
  );
}

export default SlideHeader;
