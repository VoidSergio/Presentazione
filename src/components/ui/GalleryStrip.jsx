// GalleryStrip: griglia di foto in riga (4 su desktop, 2x2 su mobile).
// Usata in pagina 3 agenzie. Generica: non contiene testo o logica
// specifica dell'audience, solo il layout della griglia.
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {celle}
    </div>
  );
}

export default GalleryStrip;
