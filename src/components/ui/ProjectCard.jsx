// ProjectCard: card di un singolo progetto nella slide 05 "Lavori scelti".
// Nessun bordo/box (stessa decisione di ServiceCard: niente Card generico):
// solo immagine 4/3 + eyebrow oro + titolo + descrizione impilati. Valori
// esatti da project-cards.md; la descrizione e' 13.5px fisso, unica card
// senza scaling fluido. Usata in griglia (desktop) e dentro MobileCarousel.
function ProjectCard({ eyebrow, titolo, descrizione, file }) {
  return (
    <div>
      <div className="aspect-[4/3] mb-[clamp(14px,2vh,20px)] bg-placeholder overflow-hidden">
        <img
          src={'/images/' + file}
          alt={titolo}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-[11px] tracking-[0.16em] uppercase text-gold mb-[6px]">
        {eyebrow}
      </div>

      <h3 className="font-display font-semibold text-dark text-[length:var(--text-h3-project)] mb-2">
        {titolo}
      </h3>

      <p className="text-muted text-[13.5px] leading-[1.5]">
        {descrizione}
      </p>
    </div>
  );
}

export default ProjectCard;
