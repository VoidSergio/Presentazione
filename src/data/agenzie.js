// data/agenzie.js: dati puri per le 4 slide della presentazione "agenzie
// immobiliari" (PresentazioneAgenzie.jsx). Copy verbatim dal materiale
// grafico fornito dal cliente (flyer 3 pagine, luglio 2026). Stesso
// principio di data/services.js e data/workflow.js su main/collaboratori:
// zero JSX qui, solo stringhe/array/oggetti, un file per branch/pubblico
// (nessuna selezione a runtime tra piu' pubblichi in questo repo). Le
// icone restano chiavi stringa, il markup SVG vive in
// PresentazioneAgenzie.jsx (vedi mappa ICONE la', stesso motivo per cui
// ServicesSlide.jsx tiene il proprio ICONE locale).
// gallery e hero usano foto progetto gia' esistenti in public/images/
// (root, non in una sottocartella agenzie/): scelte da Se il 15/07/2026.

export const hero = {
  eyebrow: 'Proposta di partnership — Agenzie immobiliari',
  titoloRighe: ['Trasforma ogni', 'compravendita'],
  titoloCorsivo: 'in un’opportunità in più.',
  paragrafo: [
    'Hai venduto la casa dei loro sogni.',
    'Noi la rendiamo ancora più straordinaria.',
    'Il tuo cliente ti ringrazierà due volte.',
  ],
  immagineFondo: 'fort-proj.jpg',
};

export const statsBar = [
  {
    tipo: 'percentuale',
    prefisso: 'fino al',
    valore: '10%',
    label: 'royalties per te',
  },
  {
    tipo: 'numero',
    valore: '3',
    label: 'generazioni di artigianalità',
  },
  {
    tipo: 'clienti',
    titolo: 'Clienti Rilievo:',
    loghi: ['palazzodoglio', 'fortevillage', 'prada', 'rinascente'],
    righe: ['Palazzo Doglio · Forte Village', 'Prada Luna Rossa · Rinascente'],
  },
];

export const comeFunziona = [
  {
    icona: 'telefono',
    titolo: 'Ci presenti il cliente',
    descrizione: 'Basta una telefonata, un messaggio o un’email.',
  },
  {
    icona: 'casa',
    titolo: 'Noi gestiamo tutto',
    descrizione: 'Dal sopralluogo al rendering, fino alla consegna chiavi in mano.',
  },
  {
    icona: 'euro',
    titolo: 'Tu ricevi il fino al 10%',
    descrizione: 'Royalties sulla commessa, pagate a progetto concluso.',
  },
];

export const toccoRilievo = {
  titolo: 'Un tocco di Rilievo nella tua agenzia',
  // Foto del totem materioteca fornita da Se il 17/07/2026 (formato
  // verticale, 1125x1398), in public/images/ come le altre foto
  // progetto, nessuna sottocartella agenzie/ (mai esistita nel repo).
  immagine: 'totem-materioteca.jpg',
  passi: [
    {
      numero: '01',
      titolo: 'Materioteca',
      descrizione: 'Campioni di materiali e finiture di pregio.',
    },
    {
      numero: '02',
      titolo: 'Magazine Rilievo',
      descrizione: 'Un supporto esclusivo da lasciare al cliente.',
    },
    {
      numero: '03',
      titolo: 'Design di livello',
      descrizione: 'Nero opaco e dettagli oro per valorizzare il tuo spazio.',
    },
  ],
};

export const percheScegliere = [
  { icona: 'monete', titolo: 'Revenue senza lavoro aggiuntivo' },
  { icona: 'persona', titolo: 'Servizio in più per il tuo cliente' },
  { icona: 'attrezzi', titolo: 'Unici in Sardegna con produzione artigianale propria' },
  { icona: 'cartella', titolo: 'Portfolio di riferimento' },
  { icona: 'lucchetto', titolo: 'Nessun vincolo' },
];

// Foto gia' presenti in public/images/ (progetti esistenti), riusate per
// la galleria della slide 3. Ordine scelto per somiglianza al mood del
// flyer originale: da confermare/riordinare se non e' quello che intendevi.
export const gallery = [
  { file: 'fort-proj.jpg', alt: 'Progetto Forte Village' },
  { file: 'proj-baita.png', alt: 'Progetto Baita' },
  { file: 'officina.png', alt: 'Officina di produzione artigianale' },
  { file: 'proj-yachtclub.jpg', alt: 'Progetto Yacht Club' },
];

export const contatti = {
  titolo: 'Parliamoci.',
  sottotitolo: '20 minuti per iniziare a collaborare.',
  cta: 'Scrivici ora',
  ctaHref: 'mailto:rilievocontract@gmail.com',
  showroom: 'Showroom a Cagliari, Viale Trento 5',
  disponibilita: 'Disponibili per un incontro in tutta la Sardegna',
  telefono: '+39 349 726 5203',
  telefonoHref: 'tel:+393497265203',
  email: 'rilievocontract@gmail.com',
  brand: 'Un brand Sudlegno · Cagliari, Sardegna',
};
