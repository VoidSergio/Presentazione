// Presentation: monta il deck delle 7 slide con scroll-snap verticale e
// navigazione da tastiera (frecce, PageUp/PageDown, Spazio, Home, End).
// Usa SlideLayout per la struttura comune di ogni slide (header, background,
// altezza fissa) e NavigationDots montato una sola volta, fuori dal ciclo
// delle slide, come nell'HTML originale. Orchestra useFirstInteraction solo
// per l'hint verticale della cover: il container con lo scroll verticale
// vive qui. L'hint orizzontale del carosello (slide 03, 06) e' invece
// orchestrato dentro ciascuna slide, perche' e' li' che vive il carosello.
// Le 7 slide hanno tutte contenuto reale.
import useSlideNavigation from '../hooks/useSlideNavigation';
import useFirstInteraction from '../hooks/useFirstInteraction';
import NavigationDots from '../components/layout/NavigationDots';
import ScrollHint from '../components/ui/ScrollHint';
import CoverSlide from '../components/slides/CoverSlide';
import AboutSlide from '../components/slides/AboutSlide';
import ServicesSlide from '../components/slides/ServicesSlide';
import ClientsSlide from '../components/slides/ClientsSlide';
import ProjectsSlide from '../components/slides/ProjectsSlide';
import WorkflowSlide from '../components/slides/WorkflowSlide';
import ContactSlide from '../components/slides/ContactSlide';

function Presentation() {
  const { hasInteracted, markInteracted } = useFirstInteraction('scroll-verticale-visto');
  const { slideAttiva, containerRef, vaiASlide } = useSlideNavigation(markInteracted);

  const hintCover = <ScrollHint variant="vertical" visibile={!hasInteracted} />;

  return (
    <>
      <div ref={containerRef} className="slide-container h-screen overflow-y-scroll snap-y snap-mandatory">
        <CoverSlide hintScroll={hintCover} />
        <AboutSlide />
        <ServicesSlide />
        <ClientsSlide />
        <ProjectsSlide />
        <WorkflowSlide />
        <ContactSlide />
      </div>
      <NavigationDots slideAttiva={slideAttiva} vaiASlide={vaiASlide} />
    </>
  );
}

export default Presentation;
