// IconCircleItem: voce con icona dentro un cerchio (bordo oro sottile),
// titolo e descrizione. Usato dal blocco "Come funziona" della slide 02
// agenzie. Diverso da ProcessStep (bordo superiore, numero) e da
// ServiceCard (bordo superiore, nessun cerchio): qui il contenitore
// dell'icona e' circolare, pattern proprio del formato flyer. sfondo e'
// opzionale (default 'cream', testo scuro): stessa convenzione di
// SlideHeader/SlideFooter, passare sfondo="dark" quando il pannello che
// lo contiene e' scuro (altrimenti il titolo, text-dark di default,
// sparisce contro uno sfondo scuro).
function IconCircleItem({ icona, titolo, descrizione, sfondo }) {
  let classeTitolo = 'text-dark';
  let classeDescrizione = 'text-muted';
  if (sfondo === 'dark') {
    classeTitolo = 'text-cream';
    classeDescrizione = 'text-cream/60';
  }

  return (
    <div className="flex gap-4 items-start">
      <div className="flex-none w-11 h-11 rounded-full border border-gold/60 flex items-center justify-center text-gold">
        {icona}
      </div>
      <div>
        <h3 className={'font-display font-semibold text-sm md:text-base mb-1 ' + classeTitolo}>
          {titolo}
        </h3>
        <p className={'text-xs md:text-sm leading-relaxed ' + classeDescrizione}>
          {descrizione}
        </p>
      </div>
    </div>
  );
}

export default IconCircleItem;
