// ServiceCard: card di un singolo servizio nella slide 03 "Cosa facciamo".
// Riceve titolo, descrizione e icona SVG (path da service-icons.md) dal
// componente genitore. Nell'HTML originale non e' un box: solo una linea
// di separazione sopra il contenuto (border-top), niente bordo laterale,
// niente radius. Usata sia in griglia (desktop) sia dentro MobileCarousel.
function ServiceCard({ titolo, descrizione, icona }) {
  return (
    <div className="border-t border-border pt-[clamp(16px,2.2vh,24px)]">
      <div className="text-gold w-10 h-10 mb-5">
        {icona}
      </div>

      <h3 className="font-display font-semibold text-dark text-[length:var(--text-h3-card)] mb-3">
        {titolo}
      </h3>

      <p className="text-muted text-sm leading-relaxed">
        {descrizione}
      </p>
    </div>
  );
}

export default ServiceCard;
