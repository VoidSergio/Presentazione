"""
Genera i codici ref mancanti per una lista contatti — Rilievo Contract.

Dato un CSV con almeno le colonne nome,email (colonna ref assente o
parzialmente vuota), popola i ref mancanti e scrive un NUOVO file con
suffisso _con_ref.csv accanto all'input. L'input non viene mai toccato:
la lista contatti e' l'unica copia della mappatura ref -> persona (i ref
gia' spediti nelle email NON sono ricostruibili da nessuna formula, vedi
sotto), quindi lo script non deve poterla corrompere nemmeno per un bug.

FORMULA DEI REF NUOVI (verificata il 10/07/2026):
I 42 ref storici sono codici CASUALI — verificato provando md5/sha1/sha256
su ~120 varianti di chiave (email, nome, id, slug, sali) senza nessun
match: non esiste una "logica MD5 esistente" da replicare. I ref gia'
assegnati vanno quindi trattati come dati immutabili. Per i contatti
NUOVI questo script usa una formula deterministica e documentata:

    ref = md5(email minuscola senza spazi)[:5]

Deterministica = rilanciare lo script sugli stessi contatti produce gli
stessi codici. In caso di collisione con un ref gia' esistente, si
ritenta con md5(email + "#2"), "#3", ... e si stampa un avviso esplicito.

USO:
    python genera_ref.py nuovi_contatti.csv
    python genera_ref.py nuovi_contatti.csv --out lista_completa.csv
"""

import argparse
import csv
import hashlib
import re
import sys
from pathlib import Path

FORMATO_REF = re.compile(r"^[0-9a-f]{5}$")


def normalizza_email(email):
    return email.strip().lower()


def genera_codice(email_normalizzata, tentativo):
    """md5 dell'email normalizzata, primi 5 caratteri esadecimali.
    Dal secondo tentativo in poi (collisioni) aggiunge '#2', '#3', ...
    alla chiave — sempre deterministico, mai casuale."""
    chiave = email_normalizzata
    if tentativo > 1:
        chiave = email_normalizzata + "#" + str(tentativo)
    return hashlib.md5(chiave.encode("utf-8")).hexdigest()[:5]


def main():
    parser = argparse.ArgumentParser(description="Popola i ref mancanti in una lista contatti")
    parser.add_argument("csv_contatti", help="CSV con almeno le colonne nome,email (ref opzionale)")
    parser.add_argument("--out", help="File di output (default: <input>_con_ref.csv)")
    args = parser.parse_args()

    percorso_input = Path(args.csv_contatti)
    if not percorso_input.exists():
        sys.exit(f"CSV non trovato: {args.csv_contatti}")

    if args.out:
        percorso_output = Path(args.out)
    else:
        percorso_output = percorso_input.with_name(percorso_input.stem + "_con_ref.csv")

    if percorso_output.resolve() == percorso_input.resolve():
        sys.exit("Il file di output coincide con l'input: scegli un --out diverso, l'input non va mai sovrascritto.")

    with open(percorso_input, newline="", encoding="utf-8-sig") as f:
        lettore = csv.DictReader(f)
        colonne = list(lettore.fieldnames)
        righe = list(lettore)

    if not righe:
        sys.exit("Il CSV e' vuoto.")
    for colonna in ["nome", "email"]:
        if colonna not in colonne:
            sys.exit(f"Colonna '{colonna}' mancante nel CSV (richieste: nome, email).")
    if "ref" not in colonne:
        colonne.append("ref")
        for riga in righe:
            riga["ref"] = ""

    avvisi = []

    # 1. Censimento email duplicate (stessa persona, non deve avere due ref)
    righe_per_email = {}
    for indice, riga in enumerate(righe):
        email = normalizza_email(riga["email"])
        if email not in righe_per_email:
            righe_per_email[email] = []
        righe_per_email[email].append(indice)
    for email, indici in righe_per_email.items():
        if len(indici) > 1:
            numeri_riga = [str(i + 2) for i in indici]  # +2: header + 1-based
            avvisi.append(
                f"EMAIL DUPLICATA: '{email}' compare {len(indici)} volte (righe {', '.join(numeri_riga)}) — "
                "stessa persona, ricevera' lo stesso ref. Valuta se e' un doppione da rimuovere."
            )

    # 2. Censimento ref gia' assegnati (mai toccati) + controllo formato
    ref_occupati = set()
    for indice, riga in enumerate(righe):
        ref_esistente = (riga.get("ref") or "").strip()
        riga["ref"] = ref_esistente
        if ref_esistente == "":
            continue
        if not FORMATO_REF.match(ref_esistente):
            avvisi.append(
                f"FORMATO ANOMALO: riga {indice + 2} ha ref '{ref_esistente}' (atteso: 5 caratteri esadecimali) — "
                "lasciato invariato, ma verifica che sia voluto."
            )
        if ref_esistente in ref_occupati:
            avvisi.append(
                f"REF DUPLICATO GIA' PRESENTE: '{ref_esistente}' compare piu' volte nell'input — "
                "due contatti diversi con lo stesso codice sono indistinguibili in GA4, correggere a mano."
            )
        ref_occupati.add(ref_esistente)

    # 3. Generazione per le righe senza ref, una email per volta cosi' i
    #    duplicati della stessa email ricevono lo stesso codice.
    ref_per_email = {}
    for email, indici in righe_per_email.items():
        for indice in indici:
            if righe[indice]["ref"] != "":
                # la persona ha gia' un ref: le eventuali righe duplicate
                # senza ref lo ereditano, non se ne genera uno nuovo
                ref_per_email[email] = righe[indice]["ref"]
                break

    generati = 0
    ereditati = 0
    for email, indici in righe_per_email.items():
        for indice in indici:
            if righe[indice]["ref"] != "":
                continue
            if email in ref_per_email:
                righe[indice]["ref"] = ref_per_email[email]
                ereditati += 1
                continue

            tentativo = 1
            codice = genera_codice(email, tentativo)
            while codice in ref_occupati:
                avvisi.append(
                    f"COLLISIONE: il codice '{codice}' per '{email}' (tentativo {tentativo}) e' gia' in uso — "
                    f"ritento in modo deterministico con chiave '{email}#{tentativo + 1}'."
                )
                tentativo += 1
                codice = genera_codice(email, tentativo)

            righe[indice]["ref"] = codice
            ref_occupati.add(codice)
            ref_per_email[email] = codice
            generati += 1

    with open(percorso_output, "w", newline="", encoding="utf-8") as f:
        scrittore = csv.DictWriter(f, fieldnames=colonne)
        scrittore.writeheader()
        scrittore.writerows(righe)

    for avviso in avvisi:
        print("ATTENZIONE —", avviso)
    print(f"Fatto. {len(righe)} righe scritte in: {percorso_output}")
    print(f"Ref generati: {generati} | ereditati da email duplicata: {ereditati} | "
          f"gia' presenti e non toccati: {len(righe) - generati - ereditati}")


if __name__ == "__main__":
    main()
