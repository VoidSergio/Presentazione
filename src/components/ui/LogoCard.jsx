// LogoCard: card bianca con logo cliente, usata nella griglia 4x3 desktop di
// ClientsSlide (slide 04), dentro LogoMarquee (mobile) e nella griglia
// fallback compatta per prefers-reduced-motion (prop compatta=true).
// Il bianco e' fisso (#ffffff), non il token cream: e' un contrasto voluto
// contro lo sfondo dark della slide (client-logos.md). maxWidth/maxHeight
// arrivano per-logo da data/clients.js, non sono uguali per tutti e 12
// perche' le proporzioni dei loghi originali sono molto diverse.
function LogoCard({ nome, file, maxWidth, maxHeight, compatta }) {
  let classeDimensioni = 'h-[clamp(72px,11.2vh,112px)] p-[clamp(12px,2vh,20px)]';
  if (compatta === true) {
    classeDimensioni = 'h-[52px] p-2';
  }

  return (
    <div className={'bg-white rounded-[3px] w-full flex items-center justify-center ' + classeDimensioni}>
      <img
        src={'/images/' + file}
        alt={nome}
        className="block object-contain"
        style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
      />
    </div>
  );
}

export default LogoCard;
