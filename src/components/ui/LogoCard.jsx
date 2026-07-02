// LogoCard: card bianca con logo cliente, usata nella griglia 4x3 di
// ClientsSlide (slide 04). Il bianco e' fisso (#ffffff), non il token cream:
// e' un contrasto voluto contro lo sfondo dark della slide (client-logos.md).
// maxWidth/maxHeight arrivano per-logo da data/clients.js, non sono uguali
// per tutti e 12 perche' le proporzioni dei loghi originali sono molto diverse.
function LogoCard({ nome, file, maxWidth, maxHeight }) {
  return (
    <div className="bg-white rounded-[3px] h-[clamp(72px,11.2vh,112px)] p-[clamp(12px,2vh,20px)] flex items-center justify-center">
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
