// SectionLabel: piccola label maiuscola in oro, primo elemento di ogni slide
// dopo l'header. Usata in tutte le slide da 01 a 07 (vedi copy-slides.md).
function SectionLabel({ testo }) {
  return (
    <div className="text-xs tracking-[0.26em] font-medium text-gold uppercase mb-5">
      {testo}
    </div>
  );
}

export default SectionLabel;
