// ClientsSlide: slide 04 "I nostri clienti". Copy verbatim da copy-slides.md
// sezione "04 — Clienti", dati loghi da data/clients.js. Sfondo dark (le
// card logo bianche contrastano contro lo sfondo scuro, vedi client-logos.md).
// Desktop: griglia statica 4x3. Mobile: LogoMarquee (variante "Vetrina",
// 2026-07-03) sostituisce la griglia, che su schermi stretti non stava nei
// 100vh nemmeno a grid-cols-2 (vedi rilievo-slide04-mobile-marquee in memoria).
import SlideLayout from '../layout/SlideLayout';
import SectionLabel from '../ui/SectionLabel';
import PageTitle from '../ui/PageTitle';
import LogoCard from '../ui/LogoCard';
import LogoMarquee from '../ui/LogoMarquee';
import { clients } from '../../data/clients';

function ClientsSlide() {
  const cardLoghi = [];
  for (let indiceCliente = 0; indiceCliente < clients.length; indiceCliente += 1) {
    const cliente = clients[indiceCliente];
    cardLoghi.push(
      <LogoCard
        key={cliente.file}
        nome={cliente.nome}
        file={cliente.file}
        maxWidth={cliente.maxWidth}
        maxHeight={cliente.maxHeight}
      />,
    );
  }

  return (
    <SlideLayout numeroSlide="04" indiceSlide={3} sfondo="dark">
      <div className="w-full">
        <SectionLabel testo="I nostri clienti" />

        <PageTitle variante="clienti" className="text-cream" testo="Lavoriamo dove ogni dettaglio conta." />

        <p className="mt-3 md:mt-5 max-w-2xl text-cream/50 text-sm leading-relaxed">
          Affianchiamo studi di architettura, committenze e brand nella realizzazione di ambienti in cui estetica,
          funzione e cura del dettaglio devono parlare la stessa lingua.
        </p>

        <div className="mt-4 md:mt-10">
          <div className="hidden md:grid md:grid-cols-4 md:gap-5">
            {cardLoghi}
          </div>

          <LogoMarquee clienti={clients} />
        </div>

        <p className="mt-3 md:mt-5 max-w-2xl text-cream/50 text-sm leading-relaxed">
          Una selezione di realtà, progetti e contesti nei quali abbiamo portato competenza esecutiva, forniture e soluzioni su misura.
        </p>

      </div>
    </SlideLayout>
  );
}

export default ClientsSlide;
