// useSlideNavigation: gestisce la navigazione tra le slide del deck.
// Espone lo stato della slide attiva, un ref da mettere sul container
// con scroll-snap verticale, e una funzione vaiASlide per saltare a un
// indice specifico (tastiera, e in futuro NavigationDots).
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../utils/analytics';

const NUMERO_TOTALE_SLIDE = 7;

// NOMI_SLIDE: ordine post-riordino dell'08/07/2026 (vedi Presentation.jsx).
const NOMI_SLIDE = [
  'cover',
  'lavori-scelti',
  'cosa-facciamo',
  'clienti',
  'come-lavoriamo',
  'chi-siamo',
  'contatti',
];

function useSlideNavigation(onPrimoScroll) {
  const [slideAttiva, setSlideAttiva] = useState(0);
  const containerRef = useRef(null);
  const stoScollandoProgrammaticamente = useRef(false);
  const slidePrecedenteRef = useRef(null);
  const tempoIngressoRef = useRef(Date.now());
  const presentazioneVistaRef = useRef(false);

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

  // Traccia slide_view/slide_time_spent/full_presentation_viewed ad ogni
  // cambio di slideAttiva, sia da tastiera/dots (vaiASlide) sia da scroll
  // manuale (IntersectionObserver sopra). Un solo effect per non duplicare
  // la logica nei due punti d'ingresso.
  useEffect(() => {
    const ora = Date.now();

    if (slidePrecedenteRef.current !== null) {
      const secondiSpesi = Math.round((ora - tempoIngressoRef.current) / 1000);
      trackEvent('slide_time_spent', {
        slide_number: slidePrecedenteRef.current + 1,
        seconds_spent: secondiSpesi,
      });
    }

    trackEvent('slide_view', {
      slide_number: slideAttiva + 1,
      slide_name: NOMI_SLIDE[slideAttiva],
    });

    // full_presentation_viewed: semantica "e' arrivato in fondo al deck",
    // NON "ha visto tutte le slide in sequenza". Se l'utente salta
    // direttamente all'ultima slide (es. tasto End appena caricata la
    // pagina, gia' supportato), l'evento scatta comunque — e' un proxy
    // per "ha raggiunto i contatti", non una controprova di visione
    // completa. Per la lettura piu' stretta servirebbe un Set delle slide
    // gia' viste da controllare qui: deciso di non farlo, la versione
    // semplice basta per ora (discusso con l'utente, 08/07/2026).
    if (slideAttiva === NUMERO_TOTALE_SLIDE - 1 && presentazioneVistaRef.current === false) {
      presentazioneVistaRef.current = true;
      trackEvent('full_presentation_viewed', {});
    }

    slidePrecedenteRef.current = slideAttiva;
    tempoIngressoRef.current = ora;
    // Limite noto: il tempo sull'ULTIMA slide visitata prima della
    // chiusura tab/reload non viene mai inviato (nessun listener su
    // beforeunload/pagehide agganciato qui) — compromesso accettato, vedi
    // piano tracciamento.
  }, [slideAttiva]);

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
