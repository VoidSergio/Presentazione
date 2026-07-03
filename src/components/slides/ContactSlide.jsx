// ContactSlide: slide 07 "Contatti", ultima del deck. Copy verbatim da
// contact-slide.md. Sfondo dark, nessun ScrollHint (e' l'ultima slide, non
// c'e' "sotto" verso cui scrollare). La griglia a 3 colonne NON e' SlideFooter:
// e' markup proprio di questa slide (label + valore su 3 colonne, diverso dal
// semplice flex a 2 slot di SlideFooter).
import SlideLayout from '../layout/SlideLayout';
import SectionLabel from '../ui/SectionLabel';
import PageTitle from '../ui/PageTitle';
import { contacts } from '../../data/contacts';

function ContactSlide() {
  const titolo = (
    <>
      Parliamo del tuo
      <br />
      <span className="text-gold">prossimo spazio.</span>
    </>
  );

  const colonneContatto = [];
  for (let indiceContatto = 0; indiceContatto < contacts.length; indiceContatto += 1) {
    const contatto = contacts[indiceContatto];

    const righeValore = contatto.valore.split('\n');
    const valoreConARiga = [];
    for (let indiceRiga = 0; indiceRiga < righeValore.length; indiceRiga += 1) {
      if (indiceRiga > 0) {
        valoreConARiga.push(<br key={'br-' + indiceRiga} />);
      }
      valoreConARiga.push(righeValore[indiceRiga]);
    }

    let elementoValore;
    if (contatto.href) {
      elementoValore = (
        <a
          href={contatto.href}
          className="text-cream text-[length:var(--text-contact-value)] leading-[1.4]"
        >
          {valoreConARiga}
        </a>
      );
    } else {
      elementoValore = (
        <div className="text-cream text-[length:var(--text-contact-value)] leading-[1.4]">
          {valoreConARiga}
        </div>
      );
    }

    colonneContatto.push(
      <div key={contatto.label}>
        <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-2">
          {contatto.label}
        </div>
        {elementoValore}
      </div>,
    );
  }

  return (
    <SlideLayout numeroSlide="07" indiceSlide={6} sfondo="dark">
      <div className="w-full">
        <SectionLabel testo="Parliamone" margine="mb-[clamp(18px,2.6vh,30px)]" />

        <PageTitle
          variante="hero"
          className="text-cream"
          testo={titolo}
          lineHeight="leading-[0.98]"
          margine="mb-[clamp(20px,3vh,30px)]"
        />

        <p className="font-display italic text-cream/80 text-[length:var(--text-quote-contatti)] max-w-[36ch]">
          Portaci il progetto, o anche solo un'idea. Al resto pensiamo noi.
        </p>

        <div translate="no" className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(20px,3vw,52px)] border-t border-cream/16 pt-[clamp(20px,3vh,32px)] mt-[clamp(24px,4vh,44px)]">
          {colonneContatto}
        </div>
      </div>
    </SlideLayout>
  );
}

export default ContactSlide;
