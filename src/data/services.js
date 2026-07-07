// services.js: dati puri dei 4 servizi per ServicesSlide (slide 03). Copy
// verbatim da copy-slides.md sezione "03 — Cosa facciamo". icona resta una
// stringa chiave (non JSX, nessuna logica): il markup SVG vero, verbatim da
// service-icons.md, resta in ServicesSlide.jsx nella mappa ICONE, stesso
// motivo per cui contacts.js non contiene <br/> (vedi commento li').
export const services = [
  {
    titolo: 'Hotel & Resort',
    descrizione: "Camere, lobby, spa: gli ambienti che l'ospite ricorda e recensisce.",
    icona: 'hotel',
  },
  {
    titolo: 'Ristoranti & Bar',
    descrizione: 'Sale che riempiono i tavoli e reggono ogni servizio, sera dopo sera.',
    icona: 'ristoranti',
  },
  {
    titolo: 'Retail & Flagship',
    descrizione: 'Spazi vendita che fanno fermare, entrare e comprare.',
    icona: 'retail',
  },
  {
    titolo: 'Ville & Residenze',
    descrizione: 'Case su misura, dal primo rendering alle chiavi in mano.',
    icona: 'ville',
  },
];
