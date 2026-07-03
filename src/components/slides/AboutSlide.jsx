// AboutSlide: slide 02 "Chi siamo". Copy verbatim da copy-slides.md sezione
// "02 — Chi siamo". Grid 1.05fr/1fr su desktop, 1 colonna su mobile (foto
// sotto il testo, gia' cosi' nell'ordine del DOM, nessun order necessario).
// Nessun SlideFooter: l'originale non ha riga footer su questa slide.
import SlideLayout from '../layout/SlideLayout';
import SectionLabel from '../ui/SectionLabel';
import PageTitle from '../ui/PageTitle';

function AboutSlide() {
  return (
    <SlideLayout numeroSlide="02" indiceSlide={1} sfondo="cream">
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-6 md:gap-16 items-center w-full">
        <div>
          <SectionLabel testo="Chi siamo" />

          <PageTitle variante="lg" testo={
            <>
              Officina propria.
              <br />
              Nessun intermediario.
            </>
          } />

          <p className="mt-4 md:mt-6 text-muted text-sm md:text-lg leading-relaxed max-w-xl">
            Rilievo è il braccio contract di <span translate="no" className="font-semibold">Sudlegno</span>:
            tre generazioni di mani sul legno, oggi in showroom in Viale Trento a Cagliari.
            Progettiamo, produciamo e forniamo tutto ciò che riempie uno spazio — arredi,
            luce, tessuti, complementi. In Sardegna siamo gli unici a farlo con produzione
            artigianale interna.
          </p>

          <div className="mt-4 md:mt-8 flex items-center gap-3">
            <span className="text-xs tracking-widest uppercase font-sans text-dark/40">Un marchio</span>
            <img src="/images/sudlegno.svg" alt="Sudlegno" translate="no" className="h-6" />
          </div>
        </div>

        <div className="w-full aspect-[4/3] md:aspect-[4/5] overflow-hidden">
          <img src="/images/officina.png" alt="Officina Sudlegno" className="w-full h-full object-cover object-[18%_center]" />
        </div>
      </div>
    </SlideLayout>
  );
}

export default AboutSlide;
