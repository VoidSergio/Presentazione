// MobileCarousel: wrapper riutilizzabile per griglia 4-up che diventa swipe
// orizzontale su mobile. Sotto md: torna a griglia normale. Usato dalla
// slide 03 "Cosa facciamo" e 06 "Come lavoriamo".
import { useEffect, useRef } from 'react';

function MobileCarousel({ children, colonneDesktop, gap, onPrimoScrollOrizzontale }) {
  const containerRef = useRef(null);

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

    container.addEventListener('scroll', gestisciPrimoScroll, { once: true });

    return function pulisci() {
      container.removeEventListener('scroll', gestisciPrimoScroll);
    };
  }, [onPrimoScrollOrizzontale]);

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
