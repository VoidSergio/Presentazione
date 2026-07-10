# Tutorial — GA4 Report Builder

Guida rapida per usare `ga4_report_builder.py`: trasforma un export CSV di
GA4 in un profilo leggibile per ogni contatto (`ref`), con nome dello
studio se lo colleghi ai tuoi dati locali.

## File coinvolti

| File | Cosa è | Dove sta | Va condiviso/committato? |
|---|---|---|---|
| `ga4_report_builder.py` | Lo script Python | `tools/ga4-report/` nel repo | Sì, è nel repo (nessun dato sensibile) |
| `export.csv` | Export scaricato da GA4 → Esplora | `tools/ga4-report/` (i CSV lì sono gitignorati) | No, è solo un file temporaneo di lavoro |
| lista contatti (es. `lista_ref_completa_42.csv`) | Mappatura `ref → studio` (facoltativo) | **Solo in locale**, mai nel repo | **No, mai** — dato sensibile, stessa regola di `generatore_email.html` |
| `report_per_contatto.csv` / output | Risultato finale | `tools/ga4-report/` | No, contiene dati derivati dai contatti se hai usato `--contacts` |

Il `.gitignore` del repo esclude già qualunque `*.csv` dentro
`tools/ga4-report/`, oltre a `contatti.csv` e `report_per_contatto*.csv`
ovunque si trovino: lavorando in questa cartella non può finire committato
nulla di sensibile per sbaglio.

## Come deve essere strutturato il file contatti

Un CSV semplice, minimo due colonne — la colonna col nome dello studio può
chiamarsi `studio` **oppure `nome`** (accettato come alias, così puoi usare
direttamente la lista contatti completa già esistente senza rinominare
nulla):

```csv
ref,studio
8fa8d,Studio Rossi Architettura
cf458,Studio Bianchi Associati
```

Puoi aggiungere altre colonne (email, città, categoria...) — lo script le
ignora silenziosamente, non serve ripulirle prima. L'importante è che la
colonna si chiami esattamente `ref` (minuscolo) e contenga gli stessi
codici usati nei link email. Eventuali ref duplicati vengono segnalati e
viene tenuta solo la prima occorrenza.

**Non caricare mai questo file in chat, su Claude.ai, o in un repository
condiviso** — contiene la mappatura tra codice tracciamento e identità
reale del contatto, la stessa informazione sensibile che tenete fuori dal
repo per `generatore_email.html`.

## Come si usa

### 1. Solo analisi comportamento (senza nomi)

```bash
python ga4_report_builder.py export.csv
```

Produce `report_per_contatto.csv`: una riga per `ref`, colonne per ogni
tipo di evento, più tre colonne di sintesi (`eventi_slide_view`,
`presentazione_completata`, `ha_cliccato_contatti`).

Attenzione al significato di `eventi_slide_view`: conta gli **eventi**
`slide_view` (le rivisite della stessa slide contano), non le slide
distinte viste.

### 2. Con i nomi degli studi

```bash
python ga4_report_builder.py export.csv --contacts lista_ref_completa_42.csv --out report_completo.csv
```

Stesso risultato, ma con la colonna `studio` in prima posizione.

## Cosa esclude automaticamente

- **Traffico tecnico**: righe con hostname `localhost` o `*.netlify.app`
- **Traffico senza ref**: le righe `(not set)` (visite dirette/organiche,
  non provenienti dai link email) — vengono escluse dal report con un
  messaggio che ne indica il numero
- **Riga "Totale complessivo"** dell'export GA4

## Da dove viene `export.csv`

GA4 → sezione Esplora → apri la scheda che vuoi (es. "Profilo per
contatto (ref)") → icona di download in alto a destra → salva il file
nella stessa cartella dello script (o indica il percorso completo come
argomento).

Dimensioni minime richieste nell'Esplorazione: `ref` e `Nome evento`.
Metrica richiesta: `Conteggio eventi` — lo script seleziona quella colonna
per nome; se nell'export ci sono altre metriche (es. "Utenti totali")
vengono ignorate, non sommate per sbaglio. Se `Conteggio eventi` manca,
lo script usa le colonne numeriche disponibili ma stampa un avviso.

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
  aggregato) — se serve il dettaglio per singola slide, l'estensione
  prevista è un secondo output in formato lungo (`ref, slide_name, viste`)
  accanto al profilo, più due colonne derivate (`slide_distinte_viste`,
  `max_slide_raggiunta`)
- Se l'export ha nomi di colonna diversi da quelli visti finora (es. se
  cambi lingua dell'interfaccia GA4 da italiano a inglese), lo script
  riconosce anche gli equivalenti inglesi più comuni (`Event name`,
  `Event count`), ma verifica il risultato al primo uso

## Storia

- 10/07/2026 — irrobustito rispetto alla prima versione: lettura con BOM
  (`utf-8-sig`, i veri export GA4 lo hanno), conversione numerica solo
  quando l'intera colonna è numerica e mai sulle colonne dimensione (un
  ref di sole cifre come `53775` non corrompe più gli altri), selezione
  della metrica per nome, esclusione `(not set)`, alias `nome`→`studio`,
  gestione ref duplicati. Testato contro la lista reale dei 42 contatti:
  42 ref distinti in ingresso → 42 righe nel report.
