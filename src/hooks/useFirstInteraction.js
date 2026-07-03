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
    sessionStorage.setItem(chiave, 'true');
    setHasInteracted(true);
    window.dispatchEvent(new CustomEvent('hint-visto', { detail: chiave }));
  }

  return { hasInteracted, markInteracted };
}

export default useFirstInteraction;
