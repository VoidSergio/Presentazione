// Presentation: monta il deck delle 7 slide con scroll-snap verticale e
// navigazione da tastiera (frecce, PageUp/PageDown, Spazio, Home, End).
// Usa SlideLayout per la struttura comune di ogni slide (header, background,
// altezza fissa) e NavigationDots montato una sola volta, fuori dal ciclo
// delle slide, come nell'HTML originale. Orchestra useFirstInteraction solo
// per l'hint verticale della cover: il container con lo scroll verticale
// vive qui. L'hint orizzontale del carosello (slide 03, 06) e' invece
// orchestrato dentro ciascuna slide, perche' e' li' che vive il carosello.
// CoverSlide (01), AboutSlide (02) e ServicesSlide (03) hanno gia' contenuto
// reale; le altre 4 slide restano placeholder numerici fino alle prossime task.
import useSlideNavigation from '../hooks/useSlideNavigation';
import useFirstInteraction from '../hooks/useFirstInteraction';
import SlideLayout from '../components/layout/SlideLayout';
import NavigationDots from '../components/layout/NavigationDots';
import ScrollHint from '../components/ui/ScrollHint';
import CoverSlide from '../components/slides/CoverSlide';
import AboutSlide from '../components/slides/AboutSlide';
import ServicesSlide from '../components/slides/ServicesSlide';
import ClientsSlide from '../components/slides/ClientsSlide';

const NUMERI_SLIDE = ['05', '06', '07'];
const SFONDI_SLIDE = ['cream', 'cream', 'dark'];

function Presentation() {
  const { hasInteracted, markInteracted } = useFirstInteraction('scroll-verticale-visto');
  const { slideAttiva, containerRef, vaiASlide } = useSlideNavigation(markInteracted);

  const hintCover = <ScrollHint variant="vertical" visibile={!hasInteracted} />;

  const slidePlaceholder = [];
  for (let indiceNumero = 0; indiceNumero < NUMERI_SLIDE.length; indiceNumero += 1) {
    const numeroSlide = NUMERI_SLIDE[indiceNumero];
    const sfondo = SFONDI_SLIDE[indiceNumero];
    const indiceSlide = indiceNumero + 4;
    let classeNumero = 'font-display text-[length:var(--text-h1-hero)] text-dark/40';
    if (sfondo === 'dark') {
      classeNumero = 'font-display text-[length:var(--text-h1-hero)] text-cream/50';
    }

    slidePlaceholder.push(
      <SlideLayout
        key={numeroSlide}
        numeroSlide={numeroSlide}
        indiceSlide={indiceSlide}
        sfondo={sfondo}
      >
        <span className={classeNumero}>{numeroSlide}</span>
      </SlideLayout>,
    );
  }

  return (
    <>
      <div ref={containerRef} className="slide-container h-screen overflow-y-scroll snap-y snap-mandatory">
        <CoverSlide hintScroll={hintCover} />
        <AboutSlide />
        <ServicesSlide />
        <ClientsSlide />
        {slidePlaceholder}
      </div>
      <NavigationDots slideAttiva={slideAttiva} vaiASlide={vaiASlide} />
    </>
  );
}

export default Presentation;
