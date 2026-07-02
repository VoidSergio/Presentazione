// SlideLayout: wrapper comune a ogni slide del deck. Gestisce padding,
// background e altezza sempre fissa a h-screen su ogni breakpoint (mai
// min-h-screen su mobile, vedi nota nella spec). Renderizza internamente
// SlideHeader, ripetuto per slide perche' il numero pagina cambia.
import SlideHeader from './SlideHeader';

function SlideLayout({ numeroSlide, indiceSlide, sfondo, footer, children }) {
  let classeSfondo = 'bg-cream';
  if (sfondo === 'dark') {
    classeSfondo = 'bg-dark';
  }

  return (
    <section
      data-slide-index={indiceSlide}
      className={'relative h-screen w-full snap-start flex flex-col px-8 py-6 md:px-16 md:py-10 ' + classeSfondo}
    >
      <SlideHeader numeroSlide={numeroSlide} sfondo={sfondo} />
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
      {footer}
    </section>
  );
}

export default SlideLayout;
