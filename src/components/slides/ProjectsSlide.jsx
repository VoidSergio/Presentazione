// ProjectsSlide: slide 05 "Lavori scelti". Copy verbatim da copy-slides.md
// sezione "05 — Lavori scelti", dati da data/projects.js, valori di stile
// da project-cards.md. Unica slide senza PageTitle: l'originale ha solo la
// label + 3 progetti. Su mobile 3 card impilate non stanno in 100vh, quindi
// MobileCarousel (carosello confermato in spec sezione 3, non piu' ipotetico),
// con ScrollHint orizzontale e stessa chiave sessionStorage di 03/06.
import useFirstInteraction from '../../hooks/useFirstInteraction';
import SlideLayout from '../layout/SlideLayout';
import SectionLabel from '../ui/SectionLabel';
import MobileCarousel from '../ui/MobileCarousel';
import ProjectCard from '../ui/ProjectCard';
import ScrollHint from '../ui/ScrollHint';
import { projects } from '../../data/projects';

function ProjectsSlide() {
  const { hasInteracted, markInteracted } = useFirstInteraction('scroll-orizzontale-visto');

  const card = [];
  for (let indiceProgetto = 0; indiceProgetto < projects.length; indiceProgetto += 1) {
    const progetto = projects[indiceProgetto];
    card.push(
      <ProjectCard
        key={progetto.titolo}
        eyebrow={progetto.eyebrow}
        titolo={progetto.titolo}
        descrizione={progetto.descrizione}
        file={progetto.file}
      />,
    );
  }

  return (
    <SlideLayout numeroSlide="02" indiceSlide={1} sfondo="cream">
      <div className="w-full">
        <SectionLabel testo="Lavori scelti" />

        <div className="mt-8 md:mt-10">
          <MobileCarousel
            colonneDesktop={3}
            gap="gap-[clamp(24px,2.6vw,44px)]"
            onPrimoScrollOrizzontale={markInteracted}
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

export default ProjectsSlide;
