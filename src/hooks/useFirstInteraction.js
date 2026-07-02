// useFirstInteraction: tiene traccia se l'utente ha gia' scoperto un
// meccanismo di interazione (scroll verticale, swipe orizzontale), per
// nascondere il relativo hint dopo la prima volta. Dismissal globale per
// chiave (non per-slide): la chiave rappresenta il meccanismo, non il
// contenuto della slide, quindi persiste in sessionStorage.
import { useState } from 'react';

function useFirstInteraction(chiave) {
  const [hasInteracted, setHasInteracted] = useState(function leggiStatoIniziale() {
    const valoreSalvato = sessionStorage.getItem(chiave);
    if (valoreSalvato === 'true') {
      return true;
    }
    return false;
  });

  function markInteracted() {
    sessionStorage.setItem(chiave, 'true');
    setHasInteracted(true);
  }

  return { hasInteracted, markInteracted };
}

export default useFirstInteraction;
