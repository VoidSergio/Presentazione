// ClientsSlide: slide 04 "I nostri clienti". Copy verbatim da copy-slides.md
// sezione "04 — Clienti", dati loghi da data/clients.js. Sfondo dark (le
// card logo bianche contrastano contro lo sfondo scuro, vedi client-logos.md).
// Nessun carosello mobile: i loghi sono immagini piccole, la griglia passa
// semplicemente a grid-cols-2 (vedi tabella responsive nella spec).
import SlideLayout from '../layout/SlideLayout';
import SectionLabel from '../ui/SectionLabel';
import PageTitle from '../ui/PageTitle';
import LogoCard from '../ui/LogoCard';
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

        <PageTitle variante="clienti" className="text-cream" testo="I posti dove non puoi sbagliare un dettaglio." />

        <p className="mt-3 md:mt-5 max-w-2xl text-cream/50 text-sm leading-relaxed">
          Hotel a cinque stelle, resort, boutique e brand che curano ogni dettaglio
          come lo curiamo noi. Dalla Sardegna a Milano, da Porto Cervo a Fiuggi.
        </p>

        <div className="mt-4 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
          {cardLoghi}
        </div>
      </div>
    </SlideLayout>
  );
}

export default ClientsSlide;
