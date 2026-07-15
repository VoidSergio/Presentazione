// IconLabelItem: icona sopra, etichetta sotto, centrato. Usato dalla
// slide 03 "Perche' scegliere Rilievo" (5 voci, slide dedicata: puo'
// permettersi dimensioni piu' generose di quando condivideva lo spazio
// con altri blocchi). Generico: riusabile per qualunque riga di "punti
// di forza" futura, non solo questa audience.
function IconLabelItem({ icona, titolo }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-10 h-10 md:w-12 md:h-12 text-gold">
        {icona}
      </div>
      <div className="text-cream text-xs md:text-sm uppercase tracking-[0.14em] leading-relaxed max-w-[16ch]">
        {titolo}
      </div>
    </div>
  );
}

export default IconLabelItem;
