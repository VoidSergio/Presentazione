// PageTitle: h2 principale di ogni slide, Playfair Display bold.
// La variante determina quale clamp da typography.css usare.
// Usata dalla slide 02 in poi (02 "lg", 03/06 "md", 04 "clienti", 07 "hero").
// margine, maxWidth e lineHeight sono opzionali (default nessuno / leading-[1.04],
// la spaziatura la gestisce il genitore): quando passati sostituiscono la classe
// di default invece di concatenarsi, stesso motivo di SectionLabel (vedi commento
// li'). testo puo' essere una stringa o un ReactNode (es. frammento con uno
// <span> colorato per evidenziare solo una parte del titolo, vedi ContactSlide).
function PageTitle({ testo, variante, className, margine, maxWidth, lineHeight }) {
  let classeClamp = '';
  let classeColore = 'text-dark';
  if (className) {
    classeColore = className;
  }

  let classeMargine = '';
  if (margine) {
    classeMargine = margine;
  }

  let classeMaxWidth = '';
  if (maxWidth) {
    classeMaxWidth = maxWidth;
  }

  let classeLineHeight = 'leading-[1.04]';
  if (lineHeight) {
    classeLineHeight = lineHeight;
  }

  if (variante === 'lg') {
    classeClamp = 'text-[length:var(--text-h2-lg)]';
  } else if (variante === 'md') {
    classeClamp = 'text-[length:var(--text-h2-md)]';
  } else if (variante === 'clienti') {
    classeClamp = 'text-[length:var(--text-h2-clienti)]';
  } else if (variante === 'hero') {
    classeClamp = 'text-[length:var(--text-h1-hero)]';
  }

  return (
    <h2
      className={
        'font-display font-bold ' + classeLineHeight + ' ' + classeColore + ' ' + classeClamp
        + ' ' + classeMargine + ' ' + classeMaxWidth
      }
    >
      {testo}
    </h2>
  );
}

export default PageTitle;
