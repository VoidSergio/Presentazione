// CoverSlide: slide 01, prima slide reale del deck. Copy verbatim da
// copy-slides.md sezione "01 — Cover". ScrollHint verticale e' orchestrato
// da Presentation.jsx (stessa logica della task 4), non montato qui.
import SlideLayout from '../layout/SlideLayout';
import SlideFooter from '../layout/SlideFooter';
import SectionLabel from '../ui/SectionLabel';

function CoverSlide({ hintScroll }) {
  const footer = (
    <SlideFooter
      sinistra="Design & fornitura contract · Cagliari, Sardegna"
      sfondo="dark"
    />
  );

  return (
    <SlideLayout numeroSlide="01" indiceSlide={0} sfondo="dark" footer={footer}>
      <div className="flex flex-col items-center text-center gap-6">
        <SectionLabel testo="Un brand Sudlegno · tre generazioni sul legno" />

        <img src="/images/rilievo-white.png" alt="Rilievo" className="h-16 md:h-20" />

        <span translate="no" className="font-display font-medium uppercase tracking-[0.3em] text-gold text-[length:var(--text-wordmark)]">
          Contract
        </span>

        <div className="w-16 h-px bg-gold" />

        <p className="font-display font-medium italic text-cream text-[length:var(--text-quote-cover)] max-w-3xl">
          Il tuo spazio merita di durare quanto il tuo nome.
        </p>
      </div>
      {hintScroll}
    </SlideLayout>
  );
}

export default CoverSlide;
