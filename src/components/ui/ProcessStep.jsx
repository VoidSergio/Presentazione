// ProcessStep: card di un singolo step nella slide 06 "Come lavoriamo".
// Componente a se', NON riuso di ServiceCard: il border-top qui e' #1c1c1a
// (token "dark"), diverso da #d9d2c4 (token "border") usato da ServiceCard,
// anche se il pattern a 4 colonne sembra identico (vedi workflow-steps.md).
// Il titolo ha margine sia sopra (dal numero) sia sotto (dalla descrizione),
// a differenza di ServiceCard/ProjectCard che hanno solo margin-bottom.
function ProcessStep({ numero, titolo, descrizione }) {
  return (
    <div className="border-t border-dark pt-[clamp(14px,2vh,20px)]">
      <div className="font-display font-bold text-gold leading-none text-[length:var(--text-process-number)]">
        {numero}
      </div>

      <h3 className="font-display font-semibold text-dark text-[length:var(--text-h3-process)] mt-[clamp(12px,1.8vh,18px)] mb-[6px]">
        {titolo}
      </h3>

      <p className="text-muted text-[13.5px] leading-[1.5]">
        {descrizione}
      </p>
    </div>
  );
}

export default ProcessStep;
