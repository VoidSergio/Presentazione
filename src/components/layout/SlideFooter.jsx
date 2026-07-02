// SlideFooter: riga fissa in basso, presente quando la slide ha contenuto di
// chiusura (es. cover, contatti). Lato sinistro testuale, lato destro uno
// slot opzionale (sulla cover resta vuoto: quel ruolo e' gia' coperto da
// ScrollHint, non va duplicato con altro testo di scroll).
function SlideFooter({ sinistra, destra, sfondo }) {
  let classeTesto = 'text-dark/40';
  if (sfondo === 'dark') {
    classeTesto = 'text-cream/50';
  }

  return (
    <div className={'flex items-end justify-between text-xs tracking-widest uppercase font-sans ' + classeTesto}>
      <span>{sinistra}</span>
      <span>{destra}</span>
    </div>
  );
}

export default SlideFooter;
