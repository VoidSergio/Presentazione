// LogoMarquee: rappresentazione mobile dei 12 loghi cliente per ClientsSlide
// (slide 04), variante "Vetrina" scelta il 2026-07-03. Due righe che scorrono
// in direzioni opposte (40s sopra, 55s sotto, riga inferiore a scala 0.94),
// contenuto duplicato per il loop invisibile, dissolvenza ai bordi via
// mask-image (~48px, .marquee-dissolvenza in index.css), due filetti oro
// 1px/35% sopra e sotto. Le card sono le stesse LogoCard bianche del
// desktop, solo racchiuse in una larghezza fissa: qui sono in un flex, non
// in una grid, e le percentuali maxWidth/maxHeight per-logo richiedono un
// parent con larghezza esplicita per risolversi correttamente.
// Visibilita' interamente delegata a CSS (.marquee-zona / .marquee-fallback
// in index.css): sotto md e senza prefers-reduced-motion scorre il marquee;
// sotto md con prefers-reduced-motion appare la griglia statica compatta con
// tutti e 12 i loghi (fallback dichiarato, nessun cliente sacrificato); da
// md in su resta la griglia 4x3 di ClientsSlide, invariata.
import LogoCard from './LogoCard';

function LogoMarquee({ clienti }) {
  const rigaSuperiore = clienti.slice(0, 6);
  const rigaInferiore = clienti.slice(6, 12);

  function costruisciRiga(loghi, suffisso) {
    const cardRiga = [];
    for (let ripetizione = 0; ripetizione < 2; ripetizione += 1) {
      for (let indiceLogo = 0; indiceLogo < loghi.length; indiceLogo += 1) {
        const logo = loghi[indiceLogo];
        cardRiga.push(
          <div key={suffisso + '-' + ripetizione + '-' + logo.file} className="flex-none w-[168px]">
            <LogoCard nome={logo.nome} file={logo.file} maxWidth={logo.maxWidth} maxHeight={logo.maxHeight} />
          </div>,
        );
      }
    }
    return cardRiga;
  }

  const cardFallback = [];
  for (let indiceCliente = 0; indiceCliente < clienti.length; indiceCliente += 1) {
    const cliente = clienti[indiceCliente];
    cardFallback.push(
      <LogoCard
        key={cliente.file}
        nome={cliente.nome}
        file={cliente.file}
        maxWidth={cliente.maxWidth}
        maxHeight={cliente.maxHeight}
        compatta
      />,
    );
  }

  return (
    <div className="marquee-zona">
      <div className="h-px bg-gold/35" />

      <div className="marquee-dissolvenza mt-4">
        <div className="marquee-track flex gap-3 w-max">
          {costruisciRiga(rigaSuperiore, 'sup')}
        </div>
      </div>

      <div className="marquee-dissolvenza mt-3 scale-[0.94] origin-left">
        <div className="marquee-track marquee-track-inversa flex gap-3 w-max">
          {costruisciRiga(rigaInferiore, 'inf')}
        </div>
      </div>

      <div className="h-px bg-gold/35 mt-4" />

      <div className="marquee-fallback grid-cols-3 gap-2.5 mt-2">
        {cardFallback}
      </div>
    </div>
  );
}

export default LogoMarquee;
