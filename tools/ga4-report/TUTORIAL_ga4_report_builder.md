# Tutorial — GA4 Report Builder

Guida rapida per usare `ga4_report_builder.py`: trasforma un export CSV di
GA4 in un profilo leggibile per ogni contatto (`ref`), con nome dello
studio se lo colleghi ai tuoi dati locali.

## File coinvolti

| File | Cosa è | Dove sta | Va condiviso/committato? |
|---|---|---|---|
| `ga4_report_builder.py` | Lo script Python | Cartella di lavoro a tua scelta | Sì, può stare nel repo (nessun dato sensibile) |
| `export.csv` | Export scaricato da GA4 → Esplora | Cartella di lavoro | No, è solo un file temporaneo di lavoro |
| `contatti.csv` | Mappatura `ref → studio` (facoltativo) | **Solo in locale**, mai nel repo | **No, mai** — dato sensibile, stessa regola di `generatore_email.html` |
| `report_per_contatto.csv` / output | Risultato finale | Cartella di lavoro | No, contiene dati derivati dai contatti se hai usato `--contacts` |

## Come deve essere strutturato `contatti.csv`

Un CSV semplice, minimo due colonne:

```csv
ref,studio
8fa8d3c1,Studio Rossi Architettura
2b91e0aa,Studio Bianchi Associati
```

Puoi aggiungere altre colonne (email, città, categoria...) — lo script le
ignora silenziosamente, non serve ripulirle prima. L'importante è che la
colonna si chiami esattamente `ref` (minuscolo) e contenga gli stessi
codici usati nei link email.

**Non caricare mai questo file in chat, su Claude.ai, o in un repository
condiviso** — contiene la mappatura tra codice tracciamento e identità
reale del contatto, la stessa informazione sensibile che tenete fuori dal
repo per `generatore_email.html`.

## Come si usa

### 1. Solo analisi comportamento (senza nomi)

```bash
python3 ga4_report_builder.py export.csv
```

Produce `report_per_contatto.csv`: una riga per `ref`, colonne per ogni
tipo di evento, più tre colonne di sintesi (`slide_totali_viste`,
`presentazione_completata`, `ha_cliccato_contatti`).

### 2. Con i nomi degli studi

```bash
python3 ga4_report_builder.py export.csv --contacts contatti.csv --out report_completo.csv
```

Stesso risultato, ma con la colonna `studio` in prima posizione.

## Da dove viene `export.csv`

GA4 → sezione Esplora → apri la scheda che vuoi (es. "Profilo per
contatto (ref)") → icona di download in alto a destra → salva il file
nella stessa cartella dello script (o indica il percorso completo come
argomento).

## Requisiti

Serve Python 3 con la libreria `pandas` installata:

```bash
pip install pandas --break-system-packages
```

(su alcuni sistemi basta `pip install pandas`, senza il flag)

## Limiti attuali

- Legge solo il formato "Formato libero" di GA4 Esplora (non funziona con
  export da report standard o da Esplorazione della canalizzazione)
- Non include ancora `slide_number`/`slide_name` (solo conteggio eventi
  aggregato) — se ti serve il dettaglio per singola slide, va richiesta
  un'estensione dello script
- Se l'export ha nomi di colonna diversi da quelli visti finora (es. se
  cambi lingua dell'interfaccia GA4 da italiano a inglese), lo script
  potrebbe non riconoscere le colonne — verificalo prima di fidarti del
  risultato
