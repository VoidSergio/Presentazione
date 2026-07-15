// NavigationDots: colonna di dot fissa lateralmente rispetto al viewport,
// nascosta su mobile. Montata una sola volta in Presentation.jsx (o in
// PresentazioneAgenzie.jsx), fuori dal ciclo delle slide (nell'HTML
// originale e' un fratello del container scrollabile, position: fixed,
// non un componente ripetuto per slide). numeroTotaleSlide e' opzionale
// (default 7, il deck hotel/collaboratori): passato esplicitamente da
// PresentazioneAgenzie.jsx per il suo deck a 3 slide.
import { trackEvent } from '../../utils/analytics';

const NUMERO_TOTALE_SLIDE_DEFAULT = 7;

function NavigationDots({ slideAttiva, vaiASlide, numeroTotaleSlide }) {
  let totaleSlide = NUMERO_TOTALE_SLIDE_DEFAULT;
  if (numeroTotaleSlide !== undefined) {
    totaleSlide = numeroTotaleSlide;
  }

  const dot = [];
  for (let indiceSlide = 0; indiceSlide < totaleSlide; indiceSlide += 1) {
    let classeDot = 'w-2 h-2 rounded-full bg-border transition-colors';
    if (indiceSlide === slideAttiva) {
      classeDot = 'w-2 h-2 rounded-full bg-gold transition-colors';
    }

    dot.push(
      <button
        key={indiceSlide}
        type="button"
        aria-label={'Vai alla slide ' + (indiceSlide + 1)}
        className={classeDot}
        onClick={function alClick() {
          trackEvent('nav_dot_click', { target_slide: indiceSlide + 1 });
          vaiASlide(indiceSlide);
        }}
      />,
    );
  }

  return (
    <div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
      {dot}
    </div>
  );
}

export default NavigationDots;
