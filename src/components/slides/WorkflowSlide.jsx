// WorkflowSlide: slide 06 "Come lavoriamo". Copy verbatim da copy-slides.md
// sezione "06 — Come lavoriamo", valori esatti da workflow-steps.md. Nessun
// SlideFooter (come 02, 03). Stesso pattern carosello/hint di ServicesSlide,
// ma con ProcessStep al posto di ServiceCard (border-top di colore diverso,
// vedi ProcessStep.jsx) e margini/gap propri, diversi dalla slide 03.
import useFirstInteraction from '../../hooks/useFirstInteraction';
import SlideLayout from '../layout/SlideLayout';
import SectionLabel from '../ui/SectionLabel';
import PageTitle from '../ui/PageTitle';
import MobileCarousel from '../ui/MobileCarousel';
import ProcessStep from '../ui/ProcessStep';
import ScrollHint from '../ui/ScrollHint';
import { workflow } from '../../data/workflow';

function WorkflowSlide() {
  const { hasInteracted, markInteracted } = useFirstInteraction('scroll-orizzontale-visto');

  const card = [];
  for (let indiceStep = 0; indiceStep < workflow.length; indiceStep += 1) {
    const step = workflow[indiceStep];
    card.push(
      <ProcessStep
        key={step.numero}
        numero={step.numero}
        titolo={step.titolo}
        descrizione={step.descrizione}
      />,
    );
  }

  return (
    <SlideLayout numeroSlide="05" indiceSlide={4} sfondo="cream">
      <div className="w-full">
        <SectionLabel testo="Come lavoriamo" margine="mb-[clamp(10px,1.5vh,16px)]" />

        <PageTitle
          variante="md"
          testo="Un solo interlocutore, dall'idea alla consegna."
          margine="mb-[clamp(34px,5vh,60px)]"
          maxWidth="max-w-[20ch]"
        />

        <MobileCarousel
          colonneDesktop={4}
          gap="gap-[clamp(20px,2.4vw,44px)]"
          onPrimoScrollOrizzontale={markInteracted}
          numeroSlide="05"
        >
          {card}
        </MobileCarousel>

        <div className="mt-4 md:hidden">
          <ScrollHint variant="horizontal" visibile={!hasInteracted} />
        </div>
      </div>
    </SlideLayout>
  );
}

export default WorkflowSlide;
