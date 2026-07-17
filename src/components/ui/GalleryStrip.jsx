// GalleryStrip: griglia di foto in riga (4 da sm in su, 2x2 sotto sm).
// Usata in pagina 3 agenzie. Generica: non contiene testo o logica
// specifica dell'audience, solo il layout della griglia. Il passaggio a 4
// colonne scatta da sm (640px) e non da md (768px): tra 640 e 767px il
// 2x2 con aspect-[4/3] e' alto quasi il doppio del 4-in-riga e, sommato
// al box contatti sotto, andava in overflow su viewport corte (bug
// trovato il 17/07/2026 a 640-768 larghezza con altezza ~700px).
function GalleryStrip({ immagini }) {
  const celle = [];
  for (let indiceImmagine = 0; indiceImmagine < immagini.length; indiceImmagine += 1) {
    const immagine = immagini[indiceImmagine];
    celle.push(
      <div key={immagine.file} className="aspect-[4/3] overflow-hidden rounded-[2px]">
        <img
          src={'/images/' + immagine.file}
          alt={immagine.alt}
          className="w-full h-full object-cover"
        />
      </div>,
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
      {celle}
    </div>
  );
}

export default GalleryStrip;
