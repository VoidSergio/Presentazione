// ScrollHint: indicazione visiva per l'utente su come si naviga.
// variant="vertical" -> "Scorri" + freccia giu, solo sulla cover (slide 01).
// variant="horizontal" -> hint per lo swipe nei caroselli mobile (slide 03, 06),
// non ancora collegato a nulla: MobileCarousel arriva nella task 7/8.
// Componente puramente presentazionale: la logica di visibilita' (hasInteracted)
// e la persistenza restano in useFirstInteraction, gestito da chi lo monta.
function ScrollHint({ variant, visibile }) {
  if (visibile === false) {
    return null;
  }

  if (variant === 'vertical') {
    return (
      <div className="absolute bottom-6 md:bottom-10 right-8 md:right-16 flex items-center gap-2 animate-pulse">
        <span className="text-xs tracking-widest uppercase font-sans text-cream/50">Scorri</span>
        <span aria-hidden="true" className="text-cream/50">&darr;</span>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <span aria-hidden="true">&larr;</span>
        <span className="text-xs tracking-widest uppercase font-sans">Scorri le card</span>
        <span aria-hidden="true">&rarr;</span>
      </div>
    );
  }

  return null;
}

export default ScrollHint;
