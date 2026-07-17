// PresentazioneAgenzie.jsx: presentazione per il pubblico "agenzie
// immobiliari". Stesso motore a slide (h-screen, scroll-snap, puntini,
// tastiera) di Presentation.jsx — 4 slide invece di 7, stessi componenti
// condivisi (SlideLayout, NavigationDots, useSlideNavigation, tutti
// parametrizzati sul numero di slide). Contenuto da src/data/agenzie.js,
// zero testo hardcoded qui sotto, stessa regola delle altre slide. Le
// icone (chiave stringa nei dati) restano JSX locali qui, stesso pattern
// di ServicesSlide.jsx (mappa ICONE).
// Diventate 4 slide invece di 3 il 15/07/2026: "perche' scegliere
// Rilievo" aveva la sua slide condivisa con "come funziona" + "un tocco
// di Rilievo", troppa roba per uno schermo solo (soprattutto da mobile,
// dove i due pannelli si impilano invece di stare affiancati). Ora ha
// una slide tutta sua.
import useSlideNavigation from '../hooks/useSlideNavigation';
import NavigationDots from '../components/layout/NavigationDots';
import SlideLayout from '../components/layout/SlideLayout';
import SectionLabel from '../components/ui/SectionLabel';
import PageTitle from '../components/ui/PageTitle';
import StatBadge from '../components/ui/StatBadge';
import IconCircleItem from '../components/ui/IconCircleItem';
import IconLabelItem from '../components/ui/IconLabelItem';
import GalleryStrip from '../components/ui/GalleryStrip';
import {
  hero, statsBar, comeFunziona, toccoRilievo, percheScegliere, gallery, contatti,
} from '../data/agenzie';

const NUMERO_SLIDE_AGENZIE = 4;
const NOMI_SLIDE_AGENZIE = [
  'hero-statistiche',
  'come-funziona-tocco-rilievo',
  'perche-sceglierci',
  'galleria-contatti',
];

const ICONA_TELEFONO = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 8c2 0 4 5 4 7s-2 3-2 5c0 4 6 10 10 10 2 0 3-2 5-2s7 2 7 4-3 6-6 6C22 38 10 26 10 16c0-3 2-8 4-8Z" />
  </svg>
);

const ICONA_CASA = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 23 24 11l15 12v16H9z" />
    <path d="M20 39V29h8v10" />
  </svg>
);

const ICONA_EURO = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="15" />
    <path d="M28 17a8 8 0 0 0 0 14M15 21h11M15 27h9" />
  </svg>
);

const ICONA_MONETE = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="24" cy="15" rx="13" ry="5" />
    <path d="M11 15v9c0 2.8 5.8 5 13 5s13-2.2 13-5v-9" />
    <path d="M11 24v9c0 2.8 5.8 5 13 5s13-2.2 13-5v-9" />
  </svg>
);

const ICONA_PERSONA = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="16" r="7" />
    <path d="M10 39c0-8 6-13 14-13s14 5 14 13" />
  </svg>
);

const ICONA_ATTREZZI = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M28 20 38 30a4 4 0 0 1-6 6L22 26" />
    <path d="M22 26l-3 3-6-2-2-6 3-3 8 8Z" />
    <path d="M10 10l6 6M16 10l-6 6" />
  </svg>
);

const ICONA_CARTELLA = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 14h11l4 5h19v20H7Z" />
  </svg>
);

const ICONA_LUCCHETTO = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="11" y="22" width="26" height="17" rx="2" />
    <path d="M16 22v-6a8 8 0 0 1 16 0v6" />
  </svg>
);

const ICONE = {
  telefono: ICONA_TELEFONO,
  casa: ICONA_CASA,
  euro: ICONA_EURO,
  monete: ICONA_MONETE,
  persona: ICONA_PERSONA,
  attrezzi: ICONA_ATTREZZI,
  cartella: ICONA_CARTELLA,
  lucchetto: ICONA_LUCCHETTO,
};

// PassoNumerato: come ProcessStep (numero + titolo + descrizione) ma con
// i colori adatti a un pannello scuro. Impilato in colonna a fianco
// della foto (non piu' su 3 colonne sotto), quindi puo' usare testo piu'
// leggibile. Non e' un componente condiviso in components/ui perche', a
// oggi, serve solo qui.
function PassoNumerato({ numero, titolo, descrizione }) {
  return (
    <div className="border-t border-cream/20 pt-2.5 flex gap-3 items-baseline">
      <div className="font-display font-bold text-gold leading-none text-lg flex-none w-6">
        {numero}
      </div>
      <div>
        <h4 className="font-display font-semibold text-cream text-sm leading-snug">
          {titolo}
        </h4>
        <p className="text-cream/60 text-xs leading-[1.4] mt-0.5">
          {descrizione}
        </p>
      </div>
    </div>
  );
}

function PresentazioneAgenzie() {
  const { slideAttiva, containerRef, vaiASlide } = useSlideNavigation(
    undefined,
    NUMERO_SLIDE_AGENZIE,
    NOMI_SLIDE_AGENZIE,
  );

  const stats = [];
  for (let indiceStat = 0; indiceStat < statsBar.length; indiceStat += 1) {
    const voce = statsBar[indiceStat];
    stats.push(<StatBadge key={voce.tipo} {...voce} />);
  }

  const vociComeFunziona = [];
  for (let indiceVoce = 0; indiceVoce < comeFunziona.length; indiceVoce += 1) {
    const voce = comeFunziona[indiceVoce];
    vociComeFunziona.push(
      <IconCircleItem
        key={voce.titolo}
        icona={ICONE[voce.icona]}
        titolo={voce.titolo}
        descrizione={voce.descrizione}
        sfondo="dark"
      />,
    );
  }

  const passiTocco = [];
  for (let indicePasso = 0; indicePasso < toccoRilievo.passi.length; indicePasso += 1) {
    const passo = toccoRilievo.passi[indicePasso];
    passiTocco.push(<PassoNumerato key={passo.numero} {...passo} />);
  }

  const vociPerche = [];
  for (let indiceVoce = 0; indiceVoce < percheScegliere.length; indiceVoce += 1) {
    const voce = percheScegliere[indiceVoce];
    vociPerche.push(
      <IconLabelItem key={voce.titolo} icona={ICONE[voce.icona]} titolo={voce.titolo} />,
    );
  }

  const paragrafiHero = [];
  for (let indiceRiga = 0; indiceRiga < hero.paragrafo.length; indiceRiga += 1) {
    paragrafiHero.push(<div key={hero.paragrafo[indiceRiga]}>{hero.paragrafo[indiceRiga]}</div>);
  }

  return (
    <>
      <div ref={containerRef} className="slide-container h-screen overflow-y-scroll snap-y snap-mandatory">

        {/* Slide 01 — hero + fascia statistiche. Contenuto w-full (NON
            max-w centrato): SlideLayout centra il suo contenuto sia in
            orizzontale che in verticale, e un blocco piu' stretto del
            100% finirebbe centrato in mezzo allo schermo, lasciando un
            vuoto scuro a sinistra e coprendo la foto invece di lasciarla
            visibile a destra. Con w-full sul contenitore la "centratura
            orizzontale" del layout non ha piu' spazio residuo su cui
            agire, e titolo/paragrafo restano allineati a sinistra per
            via del loro stesso max-w. */}
        <SlideLayout numeroSlide="01" indiceSlide={0} sfondo="dark" immagineFondo={'/images/' + hero.immagineFondo}>
          <div className="w-full">
            <div className="text-gold text-xs uppercase tracking-[0.24em] font-medium mb-5 max-w-[26ch]">
              {hero.eyebrow}
            </div>

            <h1 className="font-display font-bold text-cream leading-[1.08] text-[clamp(30px,4.8vw,58px)] max-w-xl">
              {hero.titoloRighe[0]}
              <br />
              {hero.titoloRighe[1]}
              <br />
              <span className="italic text-gold font-medium">{hero.titoloCorsivo}</span>
            </h1>

            <div className="mt-4 text-cream/90 text-sm leading-relaxed max-w-md">
              {paragrafiHero}
            </div>

            <div className="mt-7 md:mt-9 border-t border-gold/25 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
              {stats}
            </div>
          </div>
        </SlideLayout>

        {/* Slide 02 — come funziona / un tocco di Rilievo. items-start
            sui due pannelli: non devono avere la stessa altezza forzata
            (il default di CSS grid stira le colonne alla piu' alta). */}
        <SlideLayout numeroSlide="02" indiceSlide={1} sfondo="dark">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-start">
            <div className="border border-gold/30 rounded-[2px] p-5 md:p-6">
              <SectionLabel testo="Come funziona" margine="mb-4" />
              <div className="flex flex-col gap-4">
                {vociComeFunziona}
              </div>
            </div>

            <div className="border border-gold/30 rounded-[2px] p-5 md:p-6">
              <SectionLabel testo={toccoRilievo.titolo} margine="mb-3 md:mb-4" />
              {/* Foto verticale (totem contro finestra, vedi originale):
                  affiancata alla lista su desktop (grid-cols-2), impilata
                  sopra su mobile — un aspect-ratio verticale (3/4) sta
                  bene in entrambi i casi, a differenza di un riquadro
                  largo e basso che tagliava male una foto in verticale. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="order-2 sm:order-1 flex flex-col gap-2.5">
                  {passiTocco}
                </div>
                <div className="order-1 sm:order-2 aspect-[3/4] overflow-hidden rounded-[2px] bg-cream/5">
                  <img
                    src={'/images/' + toccoRilievo.immagine}
                    alt="Totem Materioteca Rilievo Contract"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </SlideLayout>

        {/* Slide 03 — perche' scegliere Rilievo, slide dedicata. */}
        <SlideLayout numeroSlide="03" indiceSlide={2} sfondo="dark">
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-4 mb-12 md:mb-16">
              <div className="w-10 h-px bg-gold/40" />
              <SectionLabel testo="Perché scegliere Rilievo" margine="mb-0" />
              <div className="w-10 h-px bg-gold/40" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10 max-w-4xl mx-auto">
              {vociPerche}
            </div>
          </div>
        </SlideLayout>

        {/* Slide 04 — galleria + contatti */}
        <SlideLayout numeroSlide="04" indiceSlide={3} sfondo="cream">
          <div className="w-full">
            <GalleryStrip immagini={gallery} />

            <div className="mt-6 md:mt-8 border border-border rounded-[2px] p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <PageTitle variante="md" testo={contatti.titolo} margine="mb-1" />
                <p className="text-muted text-sm">{contatti.sottotitolo}</p>
                <div className="mt-3 text-dark/50 text-xs leading-relaxed">
                  <div>{contatti.showroom}</div>
                  <div>{contatti.disponibilita}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <a
                  href={contatti.ctaHref}
                  className="inline-flex items-center justify-center bg-gold text-dark font-semibold text-sm uppercase tracking-[0.14em] px-6 py-3 rounded-[2px] w-fit"
                >
                  {contatti.cta} →
                </a>
                <a href={contatti.telefonoHref} className="text-dark text-sm">{contatti.telefono}</a>
                <a href={'mailto:' + contatti.email} className="text-dark text-sm">{contatti.email}</a>
                <div className="text-dark/40 text-xs uppercase tracking-[0.14em]">{contatti.brand}</div>
              </div>
            </div>
          </div>
        </SlideLayout>

      </div>
      <NavigationDots slideAttiva={slideAttiva} vaiASlide={vaiASlide} numeroTotaleSlide={NUMERO_SLIDE_AGENZIE} />
    </>
  );
}

export default PresentazioneAgenzie;
