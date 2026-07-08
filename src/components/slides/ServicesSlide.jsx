// ServicesSlide: slide 03 "Cosa facciamo". Copy verbatim da copy-slides.md
// sezione "03 — Cosa facciamo", dati puri (titolo/descrizione/chiave icona)
// da data/services.js. Il markup SVG resta qui (non in data/): le icone sono
// JSX, non dati puri, stesso motivo per cui contacts.js non contiene <br/>.
// Orchestra internamente useFirstInteraction per l'hint orizzontale: il
// carosello vive qui, quindi la responsabilita' della dismissal resta qui,
// non risale a Presentation.jsx. Stesso pattern si applichera' a
// WorkflowSlide (task 9), stessa chiave sessionStorage condivisa.
import useFirstInteraction from '../../hooks/useFirstInteraction';
import SlideLayout from '../layout/SlideLayout';
import SectionLabel from '../ui/SectionLabel';
import PageTitle from '../ui/PageTitle';
import MobileCarousel from '../ui/MobileCarousel';
import ServiceCard from '../ui/ServiceCard';
import ScrollHint from '../ui/ScrollHint';
import { services } from '../../data/services';

const ICONA_HOTEL = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 34V18M5 34h38M43 34v-8M5 27h20a5 5 0 0 1 5 5" />
    <path d="M8 34v4M40 34v4" />
  </svg>
);

const ICONA_RISTORANTI = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="16" />
    <circle cx="24" cy="24" r="8" />
  </svg>
);

const ICONA_RETAIL = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 18h26v22H11z" />
    <path d="M18 18v-4a6 6 0 0 1 12 0v4" />
  </svg>
);

const ICONA_VILLE = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 23 24 11l15 12v16H9z" />
    <path d="M20 39V29h8v10" />
  </svg>
);

// ICONE: associa la chiave stringa in data/services.js al markup JSX reale.
const ICONE = {
  hotel: ICONA_HOTEL,
  ristoranti: ICONA_RISTORANTI,
  retail: ICONA_RETAIL,
  ville: ICONA_VILLE,
};

function ServicesSlide() {
  const { hasInteracted, markInteracted } = useFirstInteraction('scroll-orizzontale-visto');

  const card = [];
  for (let indiceServizio = 0; indiceServizio < services.length; indiceServizio += 1) {
    const servizio = services[indiceServizio];
    card.push(
      <ServiceCard
        key={servizio.titolo}
        titolo={servizio.titolo}
        descrizione={servizio.descrizione}
        icona={ICONE[servizio.icona]}
      />,
    );
  }

  return (
    <SlideLayout numeroSlide="03" indiceSlide={2} sfondo="cream">
      <div className="w-full">
        <SectionLabel testo="Cosa facciamo" />

        <PageTitle variante="md" testo="Dove le persone si fermano, noi c'eravamo prima." />

        <div className="mt-8 md:mt-10">
          <MobileCarousel
            colonneDesktop={4}
            gap="gap-[clamp(24px,3vw,52px)]"
            onPrimoScrollOrizzontale={markInteracted}
            numeroSlide="03"
          >
            {card}
          </MobileCarousel>
        </div>

        <div className="mt-4 md:hidden">
          <ScrollHint variant="horizontal" visibile={!hasInteracted} />
        </div>
      </div>
    </SlideLayout>
  );
}

export default ServicesSlide;
