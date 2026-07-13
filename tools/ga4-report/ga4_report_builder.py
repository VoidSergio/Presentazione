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
    python ga4_report_builder.py export.csv
    python ga4_report_builder.py export.csv --contacts contatti.csv
    python ga4_report_builder.py export.csv --contacts contatti.csv --out report.xlsx

Il file --contacts, se fornito, deve avere almeno le colonne:
    ref,studio      (oppure ref,nome — 'nome' viene accettato come alias
                     di 'studio', cosi' si puo' usare direttamente la
                     lista contatti gia' esistente senza rinominare nulla)
(altre colonne extra come email, città, ecc. sono ignorate ma tollerate)

OUTPUT:
    --out con estensione .xlsx (default) -> file Excel con due fogli:
        "Riepilogo"       — una riga per studio, leggibile da chiunque
        "Dettaglio eventi" — stesso profilo con il conteggio di ogni
                              singolo evento (custom + automatici GA4)
    --out con estensione .csv -> solo il foglio Riepilogo, in CSV piatto
"""

import argparse
import csv
import sys
from pathlib import Path

import pandas as pd
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

EXCLUDE_HOST_SUBSTRINGS = ["localhost", "netlify.app"]

# Colonne che sono SEMPRE dimensioni (testo), mai metriche: non vanno mai
# convertite in numeri, anche se qualche valore sembra numerico. Il caso
# concreto: un ref come "53775" e' composto di sole cifre, ma resta un
# codice, non un numero — convertirlo trasformerebbe gli altri ref
# alfanumerici in valori mancanti, collassando contatti diversi.
DIMENSION_COLUMN_SUBSTRINGS = [
    "ref", "nome evento", "event name", "nome host", "hostname", "segmento", "segment",
]

# Valori GA4 che indicano "dimensione assente" (visite senza ?ref=) quando
# scritti come testo letterale.
NOT_SET_VALUES = ["(not set)", "(non impostato)"]

# I 7 eventi custom inviati dal sito (src/utils/analytics.js), nell'ordine
# di priorita' usato in GA4_PARAMETRI_TRACCIAMENTO.md — usato per ordinare
# le colonne del foglio Dettaglio, cosi' i piu' rilevanti stanno a sinistra.
EVENTI_CUSTOM_ORDINE = [
    "contact_click", "full_presentation_viewed", "slide_view",
    "slide_time_spent", "carousel_swipe", "nav_dot_click", "scroll_hint_outcome",
]

ETICHETTA_REF_NON_TROVATO = "Ref non trovato in lista contatti (verificare: dato di test?)"


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

    # Escludi il traffico senza ref: nello stesso export GA4 puo' comparire
    # in DUE forme diverse per lo stesso identico significato — il testo
    # letterale "(not set)" e la cella semplicemente vuota (osservato in un
    # export reale il 10/07/2026: 23 righe "(not set)" + 9 righe vuote,
    # entrambe traffico senza ?ref=, nessuna delle due un contatto reale).
    # Trattarle diversamente lasciava le righe vuote fuori dal conteggio e
    # dentro il report come un finto "contatto" con ref vuoto.
    senza_ref = df[ref_col].str.lower().isin([v.lower() for v in NOT_SET_VALUES])
    senza_ref = senza_ref | (df[ref_col] == "")
    numero_righe_escluse = int(senza_ref.sum())
    if numero_righe_escluse > 0:
        print(
            f"Escluse {numero_righe_escluse} righe senza ref "
            "('(not set)' o cella vuota: traffico non riconducibile a un link email)."
        )
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
    # con la dimensione slide_name (vedi README, sezione limiti).
    pivot["eventi_slide_view"] = pivot.get("slide_view", 0)
    pivot["presentazione_completata"] = pivot.get("full_presentation_viewed", 0) > 0
    pivot["ha_cliccato_contatti"] = pivot.get("contact_click", 0) > 0

    return pivot.reset_index().rename(columns={ref_col: "ref"}), numero_righe_escluse


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

    merged = profile.merge(contacts[["ref", "studio"]], on="ref", how="left")

    # Ref presenti nell'export ma assenti dalla lista contatti (tipicamente
    # codici di test/debug usati durante le verifiche, es. "test999") non
    # vengono scartati ne' lasciati vuoti: etichetta esplicita, cosi' chi
    # legge il report capisce subito che quella riga non e' uno studio.
    merged["studio"] = merged["studio"].fillna(ETICHETTA_REF_NON_TROVATO)

    cols = ["studio"] + [c for c in merged.columns if c != "studio"]
    return merged[cols]


def costruisci_riepilogo(profile: pd.DataFrame) -> pd.DataFrame:
    """Tabella essenziale, leggibile da chiunque: una riga per studio,
    solo le 3 domande che contano ('ha visto tutto?', 'ha cliccato un
    contatto?', 'quante slide?'), ordinata alfabeticamente."""
    colonne_base = []
    if "studio" in profile.columns:
        colonne_base.append("studio")
    colonne_base.append("ref")

    riepilogo = profile[colonne_base + [
        "presentazione_completata", "ha_cliccato_contatti", "eventi_slide_view",
    ]].copy()

    riepilogo["presentazione_completata"] = riepilogo["presentazione_completata"].map(
        {True: "Sì", False: "No"}
    )
    riepilogo["ha_cliccato_contatti"] = riepilogo["ha_cliccato_contatti"].map(
        {True: "Sì", False: "No"}
    )

    riepilogo = riepilogo.rename(columns={
        "ref": "Ref",
        "studio": "Studio",
        "presentazione_completata": "Presentazione completata",
        "ha_cliccato_contatti": "Ha cliccato un contatto",
        "eventi_slide_view": "Slide viste (eventi)",
    })

    colonna_ordinamento = "Studio" if "Studio" in riepilogo.columns else "Ref"
    return riepilogo.sort_values(colonna_ordinamento, kind="stable").reset_index(drop=True)


def costruisci_dettaglio(profile: pd.DataFrame) -> pd.DataFrame:
    """Tabella completa: una colonna per ogni evento (custom prima, in
    ordine di priorita', poi eventuali eventi automatici GA4 in coda)."""
    colonne_base = []
    if "studio" in profile.columns:
        colonne_base.append("studio")
    colonne_base.append("ref")

    colonne_riepilogo = {"presentazione_completata", "ha_cliccato_contatti", "eventi_slide_view"}
    tutte_le_colonne_eventi = [
        c for c in profile.columns
        if c not in colonne_base and c not in colonne_riepilogo
    ]

    eventi_custom_presenti = [c for c in EVENTI_CUSTOM_ORDINE if c in tutte_le_colonne_eventi]
    eventi_automatici = sorted(c for c in tutte_le_colonne_eventi if c not in eventi_custom_presenti)

    dettaglio = profile[colonne_base + eventi_custom_presenti + eventi_automatici].copy()
    dettaglio = dettaglio.rename(columns={"ref": "Ref", "studio": "Studio"})

    colonna_ordinamento = "Studio" if "Studio" in dettaglio.columns else "Ref"
    dettaglio = dettaglio.sort_values(colonna_ordinamento, kind="stable").reset_index(drop=True)
    return dettaglio, len(eventi_custom_presenti)


def scrivi_xlsx(riepilogo: pd.DataFrame, dettaglio: pd.DataFrame, numero_eventi_custom: int, percorso_output: str, righe_escluse: int):
    with pd.ExcelWriter(percorso_output, engine="openpyxl") as writer:
        riepilogo.to_excel(writer, sheet_name="Riepilogo", index=False, startrow=1)
        dettaglio.to_excel(writer, sheet_name="Dettaglio eventi", index=False, startrow=1)

        foglio_riepilogo = writer.sheets["Riepilogo"]
        foglio_riepilogo["A1"] = (
            f"Una riga per contatto. Escluse {righe_escluse} righe di traffico senza codice ref "
            "(visite dirette o eventi automatici del sito, non riconducibili a un contatto)."
        )
        foglio_riepilogo["A1"].font = Font(italic=True, color="55524A")
        # sposta l'intestazione vera (che to_excel ha scritto alla riga 2)
        # in cima cancellando visivamente lo scarto: usiamo la riga 2 come
        # intestazione reale, quindi il freeze/format lavora sulla riga 2.
        _formatta_intestazione_su_riga(foglio_riepilogo, riga_intestazione=2)

        foglio_dettaglio = writer.sheets["Dettaglio eventi"]
        foglio_dettaglio["A1"] = (
            "Conteggio eventi per contatto. Colonne scure = eventi inviati dal sito; "
            "colonne chiare = eventi automatici di GA4 (page_view, scroll, ecc.)."
        )
        foglio_dettaglio["A1"].font = Font(italic=True, color="55524A")
        _formatta_intestazione_su_riga(foglio_dettaglio, riga_intestazione=2, numero_colonne_evidenziate=numero_eventi_custom)


def _formatta_intestazione_su_riga(worksheet, riga_intestazione, numero_colonne_evidenziate=0):
    intestazione_font = Font(bold=True, color="FFFFFF")
    intestazione_sfondo = PatternFill(start_color="1C1C1A", end_color="1C1C1A", fill_type="solid")
    intestazione_sfondo_automatici = PatternFill(start_color="8A8680", end_color="8A8680", fill_type="solid")

    colonne_iniziali = 2 if worksheet.cell(row=riga_intestazione, column=1).value == "Studio" else 1

    for indice_colonna in range(1, worksheet.max_column + 1):
        cella = worksheet.cell(row=riga_intestazione, column=indice_colonna)
        cella.font = intestazione_font
        if numero_colonne_evidenziate > 0 and indice_colonna > colonne_iniziali + numero_colonne_evidenziate:
            cella.fill = intestazione_sfondo_automatici
        else:
            cella.fill = intestazione_sfondo
        cella.alignment = Alignment(horizontal="center", vertical="center")

    worksheet.freeze_panes = f"A{riga_intestazione + 1}"

    for indice_colonna in range(1, worksheet.max_column + 1):
        lunghezza_massima = 0
        for riga in worksheet.iter_rows(min_col=indice_colonna, max_col=indice_colonna, min_row=riga_intestazione):
            for cella in riga:
                if cella.value is not None:
                    lunghezza_massima = max(lunghezza_massima, len(str(cella.value)))
        lettera = get_column_letter(indice_colonna)
        worksheet.column_dimensions[lettera].width = min(max(lunghezza_massima + 3, 10), 55)


def main():
    parser = argparse.ArgumentParser(description="Analizza export GA4 per Rilievo Contract")
    parser.add_argument("export_csv", help="File CSV esportato da GA4 Esplora")
    parser.add_argument("--contacts", help="CSV locale con colonne ref,studio (facoltativo)")
    parser.add_argument("--out", default="report_per_contatto.xlsx",
                        help="File di output: .xlsx (default, con Riepilogo + Dettaglio) o .csv (solo Riepilogo)")
    args = parser.parse_args()

    if not Path(args.export_csv).exists():
        sys.exit(f"File non trovato: {args.export_csv}")
    if args.contacts and not Path(args.contacts).exists():
        sys.exit(f"File contatti non trovato: {args.contacts}")

    try:
        df = parse_ga4_export(args.export_csv)
        df = clean_dataframe(df)
        profile, righe_escluse = build_contact_profile(df)
        if args.contacts:
            profile = merge_contacts(profile, args.contacts)
    except ValueError as errore:
        sys.exit(f"Errore: {errore}")

    riepilogo = costruisci_riepilogo(profile)
    dettaglio, numero_eventi_custom = costruisci_dettaglio(profile)

    estensione = Path(args.out).suffix.lower()
    if estensione == ".xlsx":
        scrivi_xlsx(riepilogo, dettaglio, numero_eventi_custom, args.out, righe_escluse)
    else:
        riepilogo.to_csv(args.out, index=False, encoding="utf-8")
        print("Nota: il .csv contiene solo il Riepilogo. Per il dettaglio per singolo evento usa --out report.xlsx.")

    print(f"Fatto. Report salvato in: {args.out}")
    print(f"Contatti/ref trovati: {len(profile)}")


if __name__ == "__main__":
    main()
