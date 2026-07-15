// StatBadge: una delle 3 colonne nella fascia statistiche di pagina 1
// (agenzie immobiliari). Generico apposta (non specifico "royalties" o
// "generazioni"): la prossima audience che vuole la stessa fascia con
// numeri diversi riusa questo componente, non lo riscrive. tipo decide
// solo quale composizione di elementi mostrare nella colonna.
function StatBadge({ tipo, prefisso, valore, label, titolo, righe }) {
  if (tipo === 'clienti') {
    const righeTesto = [];
    for (let indiceRiga = 0; indiceRiga < righe.length; indiceRiga += 1) {
      righeTesto.push(<div key={righe[indiceRiga]}>{righe[indiceRiga]}</div>);
    }

    return (
      <div className="flex flex-col items-center text-center gap-2">
        <div className="text-gold w-9 h-9">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 40V20l16-10 16 10v20" />
            <path d="M16 40V26h16v14M20 20h8" />
          </svg>
        </div>
        <div className="text-cream/90 text-sm">{titolo}</div>
        <div className="text-gold text-sm leading-relaxed">{righeTesto}</div>
      </div>
    );
  }

  let testoValore = valore;
  if (tipo === 'percentuale') {
    testoValore = valore;
  }

  return (
    <div className="flex flex-col items-center text-center gap-1">
      {prefisso !== undefined && prefisso !== null && (
        <div className="text-cream/70 text-xs uppercase tracking-[0.2em]">{prefisso}</div>
      )}
      <div className="font-display font-bold text-gold text-[clamp(40px,5vw,64px)] leading-none">
        {testoValore}
      </div>
      <div className="text-cream/70 text-xs uppercase tracking-[0.2em] max-w-[16ch]">{label}</div>
    </div>
  );
}

export default StatBadge;
