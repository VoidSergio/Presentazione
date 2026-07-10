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
    ref,studio
(altre colonne extra come email, città, ecc. sono ignorate ma tollerate)
"""

import argparse
import csv
import sys
from pathlib import Path

import pandas as pd

EXCLUDE_HOST_SUBSTRINGS = ["localhost", "netlify.app"]


def parse_ga4_export(path: str) -> pd.DataFrame:
    """Legge un export GA4 'Formato libero', gestendo:
    - righe di commento iniziali (#...)
    - riga opzionale 'Segmento' con nomi dei confronti
    - riga di intestazione colonne
    - riga 'Totale complessivo' da scartare
    Restituisce un DataFrame con colonne pulite.
    """
    with open(path, newline="", encoding="utf-8") as f:
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

    # Converte le colonne numeriche quando possibile (le metriche)
    for col in df.columns:
        converted = pd.to_numeric(df[col], errors="coerce")
        if converted.notna().sum() > 0:
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
    metric_cols = [
        c for c in df.columns
        if c not in (ref_col, event_col) and pd.api.types.is_numeric_dtype(df[c])
    ]

    if not ref_col or not event_col:
        raise ValueError(
            "Non trovo le colonne 'ref' e/o 'Nome evento' nell'export. "
            "Verifica di aver incluso entrambe le dimensioni in Esplora."
        )

    # Se ci sono più metriche numeriche (es. per via dei Confronti di
    # segmenti), le sommiamo per avere un conteggio evento unico.
    df = df.copy()
    df["_eventi"] = df[metric_cols].sum(axis=1) if metric_cols else 1

    pivot = df.pivot_table(
        index=ref_col, columns=event_col, values="_eventi", aggfunc="sum", fill_value=0
    )

    pivot["slide_totali_viste"] = pivot.get("slide_view", 0)
    pivot["presentazione_completata"] = pivot.get("full_presentation_viewed", 0) > 0
    pivot["ha_cliccato_contatti"] = pivot.get("contact_click", 0) > 0

    return pivot.reset_index()


def merge_contacts(profile: pd.DataFrame, contacts_path: str) -> pd.DataFrame:
    contacts = pd.read_csv(contacts_path, dtype=str)
    if "ref" not in contacts.columns:
        raise ValueError("Il file contatti deve avere una colonna 'ref'.")
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
