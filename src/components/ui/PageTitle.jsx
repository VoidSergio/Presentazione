// PageTitle: h2 principale di ogni slide, Playfair Display bold.
// La variante determina quale clamp da typography.css usare.
// Usata dalla slide 02 in poi (02 "lg", 03/06 "md", 04 "clienti", 07 "hero").
function PageTitle({ testo, variante, className }) {
  let classeClamp = '';
  let classeColore = 'text-dark';
  if (className) {
    classeColore = className;
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
    <h2 className={'font-display font-bold leading-[1.04] ' + classeColore + ' ' + classeClamp}>
      {testo}
    </h2>
  );
}

export default PageTitle;
