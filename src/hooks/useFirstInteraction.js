// useFirstInteraction: tiene traccia se l'utente ha gia' scoperto un
// meccanismo di interazione (scroll verticale, swipe orizzontale), per
// nascondere il relativo hint dopo la prima volta. Dismissal globale per
// chiave (non per-slide): la chiave rappresenta il meccanismo, non il
// contenuto della slide, quindi persiste in sessionStorage. Oltre al
// sessionStorage (che copre i reload), markInteracted dispatcha un evento
// custom 'hint-visto' cosi' le altre istanze gia' montate con la stessa
// chiave (es. la 03 quando si fa swipe sulla 05) si aggiornano subito,
// senza aspettare un reload.
import { useState, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';

function useFirstInteraction(chiave) {
  const [hasInteracted, setHasInteracted] = useState(function leggiStatoIniziale() {
    const valoreSalvato = sessionStorage.getItem(chiave);
    if (valoreSalvato === 'true') {
      return true;
    }
    return false;
  });

  useEffect(function ascoltaHintVisto() {
    function gestisciHintVisto(evento) {
      if (evento.detail === chiave) {
        setHasInteracted(true);
      }
    }

    window.addEventListener('hint-visto', gestisciHintVisto);

    return function pulisci() {
      window.removeEventListener('hint-visto', gestisciHintVisto);
    };
  }, [chiave]);

  function markInteracted() {
    // eraNonVisto: letto PRIMA di aggiornare lo stato. Serve a tracciare
    // scroll_hint_outcome una sola volta per meccanismo, non una volta per
    // ogni istanza del hook che condivide la stessa chiave (es. i
    // caroselli di 03/05/06 condividono 'scroll-orizzontale-visto' — solo
    // il primo a essere swipato deve generare l'evento, gli altri
    // ricevono solo la sincronizzazione via 'hint-visto').
    const eraNonVisto = hasInteracted === false;

    sessionStorage.setItem(chiave, 'true');
    setHasInteracted(true);
    window.dispatchEvent(new CustomEvent('hint-visto', { detail: chiave }));

    if (eraNonVisto === true) {
      let variant = 'unknown';
      if (chiave === 'scroll-verticale-visto') {
        variant = 'vertical';
      } else if (chiave === 'scroll-orizzontale-visto') {
        variant = 'horizontal';
      }

      // method e' sempre 'interaction': non esiste un percorso di timeout
      // nel codice attuale. Il campo resta per compatibilita' futura, non
      // eliminarlo solo perche' oggi ha un solo valore possibile.
      trackEvent('scroll_hint_outcome', { variant: variant, method: 'interaction' });
    }
  }

  return { hasInteracted, markInteracted };
}

export default useFirstInteraction;
