// SectionLabel: piccola label maiuscola in oro, primo elemento di ogni slide
// dopo l'header. Usata in tutte le slide da 01 a 07 (vedi copy-slides.md).
// margine e' opzionale (default mb-5): quando passato sostituisce
// interamente la classe di default invece di concatenarsi, per evitare che
// due utility Tailwind con la stessa specificita' (es. mb-5 e
// mb-[clamp(...)]) finiscano a competere in base all'ordine non
// deterministico con cui Tailwind le scansiona in build, anziche' all'ordine
// scritto nel JSX (vedi WorkflowSlide, slide 06, che passa un margine fluido).
function SectionLabel({ testo, margine }) {
  let classeMargine = 'mb-5';
  if (margine) {
    classeMargine = margine;
  }

  return (
    <div className={'text-xs tracking-[0.26em] font-medium text-gold uppercase ' + classeMargine}>
      {testo}
    </div>
  );
}

export default SectionLabel;
