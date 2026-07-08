// MobileCarousel: wrapper riutilizzabile per griglia 4-up che diventa swipe
// orizzontale su mobile. Sotto md: torna a griglia normale. Usato dalla
// slide 03 "Cosa facciamo" e 06 "Come lavoriamo".
// numeroSlide: stesso valore letterale che il componente slide genitore
// passa gia' a SlideLayout (es. "03") — non un secondo canale per sapere
// "che slide e' questa", solo passato in giu' un livello in piu' per
// l'evento carousel_swipe.
import { useEffect, useRef } from 'react';
import { trackEvent } from '../../utils/analytics';

function MobileCarousel({ children, colonneDesktop, gap, onPrimoScrollOrizzontale, numeroSlide }) {
  const containerRef = useRef(null);
  const indiceCardRef = useRef(0);
  const timeoutDebounceRef = useRef(null);

  let classeColonneDesktop = 'md:grid-cols-4';
  if (colonneDesktop === 3) {
    classeColonneDesktop = 'md:grid-cols-3';
  } else if (colonneDesktop === 2) {
    classeColonneDesktop = 'md:grid-cols-2';
  }

  let classeGap = 'gap-4';
  if (gap !== undefined) {
    classeGap = gap;
  }

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return undefined;
    }

    function gestisciPrimoScroll() {
      if (onPrimoScrollOrizzontale !== undefined) {
        onPrimoScrollOrizzontale();
      }
    }

    // carousel_swipe: niente evento 'scrollend' (non supportato su iOS
    // Safari, vedi spec sezione nested scroll-snap) — debounce manuale sul
    // 'scroll', spara solo quando l'indice assestato cambia davvero.
    function gestisciScrollAssestato() {
      if (timeoutDebounceRef.current !== null) {
        clearTimeout(timeoutDebounceRef.current);
      }

      timeoutDebounceRef.current = setTimeout(function calcolaIndiceAssestato() {
        const larghezzaCard = container.scrollWidth / children.length;
        let indiceAssestato = Math.round(container.scrollLeft / larghezzaCard);
        if (indiceAssestato < 0) {
          indiceAssestato = 0;
        } else if (indiceAssestato > children.length - 1) {
          indiceAssestato = children.length - 1;
        }

        if (indiceAssestato !== indiceCardRef.current) {
          indiceCardRef.current = indiceAssestato;
          trackEvent('carousel_swipe', {
            slide_number: numeroSlide,
            card_index: indiceAssestato,
          });
        }
      }, 150);
    }

    container.addEventListener('scroll', gestisciPrimoScroll, { once: true });
    container.addEventListener('scroll', gestisciScrollAssestato);

    return function pulisci() {
      container.removeEventListener('scroll', gestisciPrimoScroll);
      container.removeEventListener('scroll', gestisciScrollAssestato);
      if (timeoutDebounceRef.current !== null) {
        clearTimeout(timeoutDebounceRef.current);
      }
    };
  }, [onPrimoScrollOrizzontale, numeroSlide, children.length]);

  const cardAvvolte = [];
  for (let indiceCard = 0; indiceCard < children.length; indiceCard += 1) {
    cardAvvolte.push(
      <div key={indiceCard} className="flex-none w-[78%] snap-start md:w-auto">
        {children[indiceCard]}
      </div>,
    );
  }

  return (
    <div
      ref={containerRef}
      className={
        'carousel-scroll flex items-stretch overflow-x-auto snap-x snap-mandatory md:grid md:overflow-visible '
        + classeGap + ' ' + classeColonneDesktop
      }
    >
      {cardAvvolte}
    </div>
  );
}

export default MobileCarousel;
