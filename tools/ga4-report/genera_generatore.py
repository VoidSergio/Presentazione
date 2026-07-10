"""
Genera/aggiorna l'array `studi` dentro generatore_email.html a partire
dalla lista contatti CSV (fonte di verita' unica per la mappatura
ref -> studio, es. lista_ref_completa_42.csv tenuta FUORI dal repo).

Il generatore non puo' leggere il CSV da solo a runtime (aperto via
file://, il browser blocca fetch locali per CORS), quindi l'array va
rigenerato con questo script ogni volta che la lista contatti cambia —
cosi' generatore e lista non possono piu' divergere.

Il link di ogni contatto viene costruito da DOMINIO_PRESENTAZIONE + ref:
la colonna 'link' del CSV viene ignorata (e' il CSV storico, puo' puntare
al dominio vecchio). Le colonne citta/categoria non esistono nel CSV:
vengono preservate dai valori gia' presenti nel generatore, per ref.

USO:
    python tools/genera_generatore.py "C:\\percorso\\lista_ref_completa_42.csv"
    python tools/genera_generatore.py lista.csv --generatore altro_file.html
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path

DOMINIO_PRESENTAZIONE = "https://collaboratori.rilievocontract.it/?ref="

# Il generatore sta nella root del progetto, questo script in tools/ga4-report/
PERCORSO_GENERATORE_DEFAULT = Path(__file__).resolve().parent.parent.parent / "generatore_email.html"


def leggi_contatti(percorso_csv):
    """Legge la lista contatti. Colonne richieste: nome, email, ref."""
    with open(percorso_csv, newline="", encoding="utf-8-sig") as f:
        righe = list(csv.DictReader(f))

    if not righe:
        sys.exit("Il CSV contatti e' vuoto.")

    colonne_richieste = ["nome", "email", "ref"]
    for colonna in colonne_richieste:
        if colonna not in righe[0]:
            sys.exit(f"Colonna '{colonna}' mancante nel CSV contatti (richieste: {colonne_richieste}).")

    ref_visti = set()
    for riga in righe:
        riga["ref"] = riga["ref"].strip()
        if riga["ref"] in ref_visti:
            sys.exit(f"Ref duplicato nel CSV: {riga['ref']} — correggere il CSV prima di rigenerare.")
        ref_visti.add(riga["ref"])

    return righe


def estrai_studi_esistenti(html):
    """Estrae l'array `studi` attuale dal generatore, per preservare
    citta/categoria (che non esistono nel CSV)."""
    match = re.search(r"const studi = (\[.*?\]);", html, re.DOTALL)
    if match is None:
        sys.exit("Non trovo 'const studi = [...];' nel generatore: file inatteso.")
    return json.loads(match.group(1)), match


def main():
    parser = argparse.ArgumentParser(description="Rigenera l'array studi del generatore email dal CSV contatti")
    parser.add_argument("csv_contatti", help="CSV con colonne id,nome,email,ref (la colonna link e' ignorata)")
    parser.add_argument("--generatore", default=str(PERCORSO_GENERATORE_DEFAULT),
                        help="Percorso di generatore_email.html (default: root del progetto)")
    args = parser.parse_args()

    if not Path(args.csv_contatti).exists():
        sys.exit(f"CSV non trovato: {args.csv_contatti}")
    if not Path(args.generatore).exists():
        sys.exit(f"Generatore non trovato: {args.generatore}")

    contatti = leggi_contatti(args.csv_contatti)

    html = Path(args.generatore).read_text(encoding="utf-8")
    studi_esistenti, match = estrai_studi_esistenti(html)

    # citta/categoria per ref, dai dati gia' presenti nel generatore
    extra_per_ref = {}
    for studio in studi_esistenti:
        extra_per_ref[studio.get("ref", "")] = {
            "citta": studio.get("citta", ""),
            "categoria": studio.get("categoria", ""),
        }

    nuovi_studi = []
    preservati = 0
    for contatto in contatti:
        extra = extra_per_ref.get(contatto["ref"], {"citta": "", "categoria": ""})
        if contatto["ref"] in extra_per_ref:
            preservati += 1
        nuovi_studi.append({
            "id": contatto.get("id", "").strip(),
            "nome": contatto["nome"].strip(),
            "citta": extra["citta"],
            "email": contatto["email"].strip(),
            "categoria": extra["categoria"],
            "ref": contatto["ref"],
            "link": DOMINIO_PRESENTAZIONE + contatto["ref"],
        })

    nuova_riga = "const studi = " + json.dumps(nuovi_studi, ensure_ascii=False) + ";"
    html_nuovo = html[: match.start()] + nuova_riga + html[match.end():]
    Path(args.generatore).write_text(html_nuovo, encoding="utf-8")

    print(f"Fatto. {len(nuovi_studi)} studi scritti in: {args.generatore}")
    print(f"citta/categoria preservate per {preservati} studi gia' presenti; "
          f"{len(nuovi_studi) - preservati} nuovi senza citta/categoria.")


if __name__ == "__main__":
    main()
