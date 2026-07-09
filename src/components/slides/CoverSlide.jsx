// CoverSlide: slide 01, prima slide reale del deck. Copy verbatim da
// copy-slides.md sezione "01 — Cover". ScrollHint verticale e' orchestrato
// da Presentation.jsx (stessa logica della task 4), non montato qui.
import SlideLayout from '../layout/SlideLayout';
import SlideFooter from '../layout/SlideFooter';

function CoverSlide({ hintScroll }) {
  const footer = (
    <SlideFooter
      sinistra="ESECUZIONE - ARREDI SU MISURA - FORNITURA CONTRACT"
      sfondo="dark"
    />
  );

  return (
    <SlideLayout numeroSlide="01" indiceSlide={0} sfondo="dark" footer={footer}>
      <div className="flex flex-col items-center text-center gap-6">
        <img src="/images/rilievo-white.png" alt="Rilievo" className="h-32 md:h-40" />

        <span translate="no" className="font-display font-medium uppercase tracking-[0.3em] text-gold text-[length:var(--text-wordmark)]">
          Contract
        </span>

        <div className="w-16 h-px bg-gold" />

        <p className="font-display font-medium italic text-cream text-[length:var(--text-quote-cover)] max-w-3xl">
          Il tuo progetto merita un esecuzione all’altezza della tua firma.
        </p>

        <p className="font-display italic text-cream/80 text-[length:var(--text-quote-coverh2)] max-w-[36ch]">
          Al fianco degli studi di architettura, per trasformare ogni visione in un risultato concreto, elegante e fedele al progetto.
        </p>
      </div>
      {hintScroll}
    </SlideLayout>
  );
}

export default CoverSlide;
