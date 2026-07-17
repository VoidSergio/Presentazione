// SlideLayout: wrapper comune a ogni slide del deck. Gestisce padding,
// background e altezza sempre fissa a h-screen su ogni breakpoint (mai
// min-h-screen su mobile, vedi nota nella spec). Renderizza internamente
// SlideHeader, ripetuto per slide perche' il numero pagina cambia.
// immagineFondo e' opzionale (default nessuna foto, il caso comune): se
// passata, viene renderizzata come sfondo a piena slide con due livelli
// di scurimento — un velo uniforme leggero su tutta la foto, piu' una
// sfumatura forte da sinistra (zona del testo, quasi opaca fino al 58%
// della larghezza) verso destra piu' trasparente (foto visibile). Il
// doppio livello serve perche' foto molto chiare (es. piscina/facciata
// illuminata) restavano poco leggibili con la sola sfumatura, vedi
// screenshot del 15/07/2026. Va applicata qui e non nel componente
// chiamante perche' solo il <section> di questo file ha un'altezza
// reale (h-screen): un wrapper interno con solo h-full dentro il flex
// centrato di SlideLayout non ha un'altezza risolvibile, e l'immagine
// assoluta al suo interno collassa a zero. "isolate" sulla section e'
// necessario (non solo "relative"): senza, "relative" da solo non crea
// un nuovo stacking context, quindi i figli a z-index negativo possono
// "sfuggire" e finire dietro ad altri elementi della pagina invece che
// restare dietro solo al contenuto di QUESTA slide.
import SlideHeader from './SlideHeader';

function SlideLayout({
  numeroSlide, indiceSlide, sfondo, footer, immagineFondo, headerCentro, children,
}) {
  let classeSfondo = 'bg-cream';
  if (sfondo === 'dark') {
    classeSfondo = 'bg-dark';
  }

  return (
    <section
      data-slide-index={indiceSlide}
      className={'relative isolate h-screen w-full snap-start flex flex-col px-8 py-6 md:px-16 md:py-10 ' + classeSfondo}
    >
      {immagineFondo !== undefined && (
        <>
          <img
            src={immagineFondo}
            alt=""
            className="absolute inset-0 w-full h-full object-cover -z-20"
          />
          <div className="absolute inset-0 bg-dark/35 -z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark from-0% via-dark/90 via-58% to-dark/15 to-100% -z-10" />
        </>
      )}
      <SlideHeader numeroSlide={numeroSlide} sfondo={sfondo} centro={headerCentro} />
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
      {footer}
    </section>
  );
}

export default SlideLayout;
