"""
GA4 Report Builder — Rilievo Contract

Legge un export CSV da un'Esplorazione GA4 (formato libero, con o senza
Confronti di segmenti) e produce un profilo per contatto (ref): quali
eventi ha generato, quante slide ha visto, se ha completato la
presentazione.

Opzionalmente unisce i dati con un file di mappatura ref -> nome studio
(NON incluso in questo script, va fornito da te in locale — non caricarlo
mai in una chat o in un repository condiviso, contiene dati sensibili).

USO:
    python3 ga4_report_builder.py export.csv
    python3 ga4_report_builder.py export.csv --contacts contatti.csv --out report.csv

Il file --contacts, se fornito, deve avere almeno le colonne:
    ref,studio      (oppure ref,nome — 'nome' viene accettato come alias
                     di 'studio', cosi' si puo' usare direttamente la
                     lista contatti gia' esistente senza rinominare nulla)
(altre colonne extra come email, città, ecc. sono ignorate ma tollerate)
"""

import argparse
import csv
import sys
from pathlib import Path

import pandas as pd

EXCLUDE_HOST_SUBSTRINGS = ["localhost", "netlify.app"]

# Colonne che sono SEMPRE dimensioni (testo), mai metriche: non vanno mai
# convertite in numeri, anche se qualche valore sembra numerico. Il caso
# concreto: un ref come "53775" e' composto di sole cifre, ma resta un
# codice, non un numero — convertirlo trasformerebbe gli altri ref
# alfanumerici in valori mancanti, collassando contatti diversi.
DIMENSION_COLUMN_SUBSTRINGS = [
    "ref", "nome evento", "event name", "nome host", "hostname", "segmento", "segment",
]

# Valori GA4 che indicano "dimensione assente" (visite senza ?ref=):
# non sono un contatto reale, vanno esclusi dal profilo per contatto.
NOT_SET_VALUES = ["(not set)", "(non impostato)"]


def _is_dimension_column(column_name: str) -> bool:
    lowered = column_name.strip().lower()
    for substring in DIMENSION_COLUMN_SUBSTRINGS:
        if substring in lowered:
            return True
    return False


def parse_ga4_export(path: str) -> pd.DataFrame:
    """Legge un export GA4 'Formato libero', gestendo:
    - righe di commento iniziali (#...)
    - riga opzionale 'Segmento' con nomi dei confronti
    - riga di intestazione colonne
    - riga 'Totale complessivo' da scartare
    Restituisce un DataFrame con colonne pulite.
    """
    # utf-8-sig: gli export GA4 spesso hanno il BOM iniziale, che con
    # "utf-8" semplice finirebbe dentro il nome della prima colonna.
    with open(path, newline="", encoding="utf-8-sig") as f:
        raw_lines = [line for line in csv.reader(f)]

    # Rimuovi righe di commento (# ...) e righe completamente vuote
    lines = [
        row for row in raw_lines
        if not (row and row[0].startswith("#")) and any(cell.strip() for cell in row)
    ]

    if not lines:
        raise ValueError("Nessun dato trovato nel file: controlla che sia un export GA4 valido.")

    idx = 0
    segment_row = None

    # Riga 'Segmento' opzionale: presente solo se hai usato Confronti di segmenti
    if "Segmento" in lines[idx]:
        segment_row = lines[idx]
        idx += 1

    header_row = lines[idx]
    idx += 1

    # Costruisci i nomi di colonna finali
    columns = []
    for i, name in enumerate(header_row):
        if segment_row and i < len(segment_row) and segment_row[i].strip():
            columns.append(f"{segment_row[i].strip()} — {name.strip()}")
        else:
            columns.append(name.strip())

    data_rows = []
    for row in lines[idx:]:
        if any("totale complessivo" in cell.lower() for cell in row):
            continue  # riga di riepilogo totale, non è un dato reale
        if len(row) < len(columns):
            row = row + [""] * (len(columns) - len(row))
        data_rows.append(row[: len(columns)])

    df = pd.DataFrame(data_rows, columns=columns)

    # Converte in numerica solo una colonna che (a) non e' una dimensione
    # nota e (b) ha TUTTI i valori non vuoti convertibili. La vecchia
    # regola "almeno un valore converte" corrompeva la colonna ref quando
    # conteneva codici di sole cifre insieme a codici alfanumerici.
    for col in df.columns:
        if _is_dimension_column(col):
            continue
        non_empty = df[col].astype(str).str.strip() != ""
        if non_empty.sum() == 0:
            continue
        converted = pd.to_numeric(df[col], errors="coerce")
        if converted[non_empty].notna().all():
            df[col] = converted.fillna(0)

    return df


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Esclude righe di traffico tecnico (localhost, netlify.app)."""
    host_col = next((c for c in df.columns if "nome host" in c.lower()), None)
    if host_col:
        mask = ~df[host_col].str.lower().str.contains(
            "|".join(EXCLUDE_HOST_SUBSTRINGS), na=False
        )
        df = df[mask]
    return df


def build_contact_profile(df: pd.DataFrame) -> pd.DataFrame:
    """Aggrega per ref: elenco eventi con conteggi, in colonne pivot."""
    ref_col = next((c for c in df.columns if c.strip().lower() == "ref"), None)
    event_col = next((c for c in df.columns if "nome evento" in c.lower()), None)

    if not ref_col or not event_col:
        raise ValueError(
            "Non trovo le colonne 'ref' e/o 'Nome evento' nell'export. "
            "Verifica di aver incluso entrambe le dimensioni in Esplora."
        )

    df = df.copy()
    df[ref_col] = df[ref_col].astype(str).str.strip()

    # Escludi il traffico senza ref ("(not set)"): sono visite dirette o
    # di test, non un contatto reale — nel report diventerebbero un finto
    # contatto con i numeri di tutto il traffico organico messo insieme.
    senza_ref = df[ref_col].str.lower().isin([v.lower() for v in NOT_SET_VALUES])
    if senza_ref.sum() > 0:
        print(f"Escluse {senza_ref.sum()} righe senza ref ('(not set)': traffico non da email).")
        df = df[~senza_ref]

    # Metrica: cerca per NOME le colonne "Conteggio eventi" (una sola, o
    # una per segmento se hai usato i Confronti — in quel caso sommarle e'
    # corretto perche' sono la stessa metrica ripetuta). Sommare invece
    # QUALUNQUE colonna numerica mischierebbe metriche diverse (es.
    # "Conteggio eventi" + "Utenti totali" = numero senza senso).
    event_count_cols = [
        c for c in df.columns
        if "conteggio eventi" in c.lower() or "event count" in c.lower()
    ]
    if event_count_cols:
        metric_cols = event_count_cols
    else:
        metric_cols = [
            c for c in df.columns
            if c not in (ref_col, event_col) and pd.api.types.is_numeric_dtype(df[c])
        ]
        if metric_cols:
            print(
                "Attenzione: nessuna colonna 'Conteggio eventi' trovata, uso la somma di: "
                + ", ".join(metric_cols)
                + " — verifica che siano davvero conteggi di eventi."
            )

    df["_eventi"] = df[metric_cols].sum(axis=1) if metric_cols else 1

    pivot = df.pivot_table(
        index=ref_col, columns=event_col, values="_eventi", aggfunc="sum", fill_value=0
    )

    # eventi_slide_view: numero di EVENTI slide_view (le rivisite contano),
    # NON il numero di slide distinte viste — per quello serve l'export
    # con la dimensione slide_name (vedi tutorial, sezione limiti).
    pivot["eventi_slide_view"] = pivot.get("slide_view", 0)
    pivot["presentazione_completata"] = pivot.get("full_presentation_viewed", 0) > 0
    pivot["ha_cliccato_contatti"] = pivot.get("contact_click", 0) > 0

    return pivot.reset_index()


def merge_contacts(profile: pd.DataFrame, contacts_path: str) -> pd.DataFrame:
    contacts = pd.read_csv(contacts_path, dtype=str, encoding="utf-8-sig")
    if "ref" not in contacts.columns:
        raise ValueError("Il file contatti deve avere una colonna 'ref'.")

    # 'nome' accettato come alias di 'studio': la lista contatti reale usa
    # gia' quella colonna, inutile pretendere un file rinominato a mano.
    if "studio" not in contacts.columns and "nome" in contacts.columns:
        contacts = contacts.rename(columns={"nome": "studio"})

    contacts["ref"] = contacts["ref"].astype(str).str.strip()

    # Ref duplicati nel file contatti duplicherebbero silenziosamente le
    # righe del report nel merge: tieni la prima occorrenza e avvisa.
    duplicati = contacts["ref"].duplicated()
    if duplicati.sum() > 0:
        print(f"Attenzione: {duplicati.sum()} ref duplicati nel file contatti, tengo la prima occorrenza.")
        contacts = contacts[~duplicati]

    merged = profile.merge(contacts, on="ref", how="left")
    # Porta 'studio' (se presente) come prima colonna leggibile
    if "studio" in merged.columns:
        cols = ["studio"] + [c for c in merged.columns if c != "studio"]
        merged = merged[cols]
    return merged


def main():
    parser = argparse.ArgumentParser(description="Analizza export GA4 per Rilievo Contract")
    parser.add_argument("export_csv", help="File CSV esportato da GA4 Esplora")
    parser.add_argument("--contacts", help="CSV locale con colonne ref,studio (facoltativo)")
    parser.add_argument("--out", default="report_per_contatto.csv", help="File di output")
    args = parser.parse_args()

    if not Path(args.export_csv).exists():
        sys.exit(f"File non trovato: {args.export_csv}")

    df = parse_ga4_export(args.export_csv)
    df = clean_dataframe(df)
    profile = build_contact_profile(df)

    if args.contacts:
        if not Path(args.contacts).exists():
            sys.exit(f"File contatti non trovato: {args.contacts}")
        profile = merge_contacts(profile, args.contacts)

    profile.to_csv(args.out, index=False, encoding="utf-8")
    print(f"Fatto. Report salvato in: {args.out}")
    print(f"Contatti/ref trovati: {len(profile)}")


if __name__ == "__main__":
    main()
