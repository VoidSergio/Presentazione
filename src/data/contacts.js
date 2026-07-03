// contacts.js: dati puri dei 3 contatti per ContactSlide (slide 07). Copy
// verbatim da contact-slide.md. valore resta stringa pura (a-capo con \n,
// non <br/>): il rendering del ritorno a capo e la scelta <a>/<div> spettano
// a ContactSlide.jsx, non a questo file (vedi sezione 6 della spec).
export const contacts = [
  {
    label: 'Showroom',
    valore: 'Viale Trento 5\n09123 Cagliari',
    href: null,
  },
  {
    label: 'Telefono',
    valore: '+39 349 726 5203',
    href: 'tel:+393497265203',
  },
  {
    label: 'Email',
    valore: 'rilievocontract@gmail.com',
    href: 'mailto:rilievocontract@gmail.com',
  },
];
