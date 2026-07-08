// analytics.js: unico punto da cui partono tutti gli eventi custom GA4.
// Guard su window.gtag (definito inline in index.html, sempre presente
// dopo il caricamento pagina). Non serve controllare il consenso qui: con
// Consent Mode v2 "advanced" gtag.js gestisce da solo l'invio di ping
// anonimi quando l'utente ha negato analytics_storage — la responsabilita'
// di questo file e' solo costruire l'evento, non decidere se mandarlo.
// Aggiunge 'ref' (provenienza email, vedi trackingRef.js) a ogni evento
// quando presente in URL.
import { getRef } from './trackingRef';

export function trackEvent(nome, parametri) {
  if (typeof window.gtag !== 'function') {
    return;
  }

  let parametriFinali = {};
  if (parametri !== undefined) {
    parametriFinali = { ...parametri };
  }

  const ref = getRef();
  if (ref !== null) {
    parametriFinali.ref = ref;
  }

  window.gtag('event', nome, parametriFinali);
}
