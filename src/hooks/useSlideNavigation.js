// useSlideNavigation: gestisce la navigazione tra le slide del deck.
// Espone lo stato della slide attiva, un ref da mettere sul container
// con scroll-snap verticale, e una funzione vaiASlide per saltare a un
// indice specifico (tastiera, e in futuro NavigationDots).
import { useEffect, useRef, useState } from 'react';

const NUMERO_TOTALE_SLIDE = 7;

function useSlideNavigation(onPrimoScroll) {
  const [slideAttiva, setSlideAttiva] = useState(0);
  const containerRef = useRef(null);
  const stoScollandoProgrammaticamente = useRef(false);

  function vaiASlide(indiceRichiesto) {
    let indiceValido = indiceRichiesto;

    if (indiceValido < 0) {
      indiceValido = 0;
    } else if (indiceValido > NUMERO_TOTALE_SLIDE - 1) {
      indiceValido = NUMERO_TOTALE_SLIDE - 1;
    }

    const container = containerRef.current;
    if (container === null) {
      return;
    }

    const slideElementi = container.children;
    const slideTarget = slideElementi[indiceValido];
    if (slideTarget === undefined) {
      return;
    }

    stoScollandoProgrammaticamente.current = true;
    setSlideAttiva(indiceValido);
    slideTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Aggiorna slideAttiva quando l'utente scrolla manualmente (mouse, trackpad, swipe),
  // non solo quando naviga da tastiera tramite vaiASlide.
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return undefined;
    }

    const opzioniObserver = {
      root: container,
      threshold: 0.6,
    };

    function alCambioVisibilita(entries) {
      if (stoScollandoProgrammaticamente.current === true) {
        return;
      }

      for (let indiceEntry = 0; indiceEntry < entries.length; indiceEntry += 1) {
        const entry = entries[indiceEntry];
        if (entry.isIntersecting === true) {
          const indiceSlide = Number(entry.target.dataset.slideIndex);
          setSlideAttiva(indiceSlide);
        }
      }
    }

    const observer = new IntersectionObserver(alCambioVisibilita, opzioniObserver);
    const slideElementi = container.children;
    for (let indiceSlide = 0; indiceSlide < slideElementi.length; indiceSlide += 1) {
      observer.observe(slideElementi[indiceSlide]);
    }

    function alFineScrollProgrammatico() {
      stoScollandoProgrammaticamente.current = false;
    }

    container.addEventListener('scrollend', alFineScrollProgrammatico);

    function gestisciPrimoScroll() {
      if (onPrimoScroll !== undefined) {
        onPrimoScroll();
      }
    }

    container.addEventListener('scroll', gestisciPrimoScroll, { once: true });

    return function pulisci() {
      observer.disconnect();
      container.removeEventListener('scrollend', alFineScrollProgrammatico);
      container.removeEventListener('scroll', gestisciPrimoScroll);
    };
  }, []);

  // Gestione tastiera: frecce, PageUp/PageDown, Spazio, Home, End.
  useEffect(() => {
    function alTastoPremuto(evento) {
      if (evento.key === 'ArrowDown' || evento.key === 'PageDown' || evento.key === ' ') {
        evento.preventDefault();
        vaiASlide(slideAttiva + 1);
      } else if (evento.key === 'ArrowUp' || evento.key === 'PageUp') {
        evento.preventDefault();
        vaiASlide(slideAttiva - 1);
      } else if (evento.key === 'Home') {
        evento.preventDefault();
        vaiASlide(0);
      } else if (evento.key === 'End') {
        evento.preventDefault();
        vaiASlide(NUMERO_TOTALE_SLIDE - 1);
      }
    }

    window.addEventListener('keydown', alTastoPremuto);

    return function pulisci() {
      window.removeEventListener('keydown', alTastoPremuto);
    };
  }, [slideAttiva]);

  return { slideAttiva, containerRef, vaiASlide };
}

export default useSlideNavigation;
