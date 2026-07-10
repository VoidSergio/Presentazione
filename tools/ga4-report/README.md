# tools/ga4-report — toolbox email marketing e analytics

Tre script Python per il flusso completo del canale collaboratori: dalla
lista grezza dei contatti fino al report di comportamento per singolo
studio. Questa cartella è anche la cartella di lavoro per i CSV: il
`.gitignore` del repo esclude qualunque `*.csv` qui dentro.

Requisito comune: Python 3. Solo `ga4_report_builder.py` richiede pandas
(`pip install pandas`, su alcuni sistemi con `--break-system-packages`).

---

## Il flusso completo, in ordine

```
1. CSV grezzo nomi/email      (nuovi contatti, senza ref)
        │
        ▼  python genera_ref.py contatti.csv
2. CSV con ref popolati       (contatti_con_ref.csv → diventa la lista ufficiale)
        │
        ▼  python genera_generatore.py lista.csv
3. generatore_email.html      (array studi rigenerato, root del progetto)
        │
        ▼  [manuale] apri il generatore → copia → incolla in Gmail → invia
4. Email inviate con link ?ref= personalizzati
        │
        ▼  [attesa] i destinatari visitano il sito, GA4 raccoglie gli eventi
5. Export CSV da GA4 Esplora  (Formato libero, dimensioni ref + Nome evento)
        │
        ▼  python ga4_report_builder.py export.csv --contacts lista.csv
6. report_per_contatto.csv    (una riga per studio: eventi, completamento, click)
```

I passi 1-2 servono solo quando la lista contatti cambia (nuovi studi).
I passi 5-6 si ripetono ogni volta che si vuole un report aggiornato.

**La lista contatti ufficiale** (oggi `lista_ref_completa_42.csv`) è
l'unica fonte di verità per la mappatura ref → studio. Vive FUORI dal
repo, in una cartella personale, con una copia di backup: i ref già
spediti nelle email sono codici casuali NON ricostruibili da nessuna
formula — se il file si perde, si perde l'attribuzione.

---

## 1. genera_ref.py — popola i ref mancanti

**Cosa fa**: dato un CSV con almeno le colonne `nome,email`, genera un
codice `ref` per ogni riga che non ce l'ha e scrive un nuovo file
`<input>_con_ref.csv`. Le righe con ref già valorizzato non vengono MAI
toccate.

**Quando**: quando si aggiungono contatti nuovi alla lista, PRIMA di
rigenerare il generatore email.

**Come**:
```bash
python genera_ref.py nuovi_contatti.csv
python genera_ref.py nuovi_contatti.csv --out lista_aggiornata.csv
```

**Input**: CSV con colonne `nome,email` (la colonna `ref` può mancare,
essere vuota, o essere popolata solo in parte; altre colonne sono
conservate tali e quali).

**Output**: nuovo file con la colonna `ref` completa. L'input non viene
mai sovrascritto (protezione della fonte di verità: un bug in scrittura
non può distruggere la mappatura, che non è recuperabile).

**Regole dei codici**:
- I ref esistenti sono dati immutabili (i 42 storici sono casuali,
  verificato il 10/07/2026 provando md5/sha1/sha256 su ~120 varianti di
  chiave: nessun match — non esiste una formula che li rigenera)
- I ref nuovi sono deterministici: `md5(email minuscola)[:5]` — stessi
  contatti in ingresso, stessi codici in uscita, sempre
- Collisione con un codice già in uso → avviso esplicito e nuovo
  tentativo deterministico (`email#2`, `#3`, ...)
- Email duplicata nel CSV → avviso esplicito; le righe duplicate
  ricevono lo STESSO ref (stessa persona), ereditandolo se una delle
  righe ne ha già uno
- Ref esistente con formato anomalo (non 5 esadecimali) → avviso, ma
  lasciato invariato

## 2. genera_generatore.py — rigenera il generatore email

**Cosa fa**: riscrive l'array `studi` dentro `generatore_email.html`
(root del progetto) a partire dalla lista contatti, costruendo i link
come `https://collaboratori.rilievocontract.it/?ref=<ref>`.

**Quando**: ogni volta che la lista contatti cambia (dopo genera_ref.py),
PRIMA di un giro di invii.

**Come**:
```bash
python genera_generatore.py "C:\percorso\lista_ref_completa_42.csv"
python genera_generatore.py lista.csv --generatore altro_file.html
```

**Input**: CSV con colonne `nome,email,ref` (e `id` facoltativo). La
colonna `link` del CSV, se presente, viene ignorata: il dominio è deciso
dallo script, non dal CSV storico.

**Output**: `generatore_email.html` aggiornato in place. Le colonne
`citta`/`categoria` (che il CSV non ha) vengono preservate dai valori già
presenti nel generatore, abbinate per ref. Ref duplicati nel CSV bloccano
lo script con errore.

**Perché serve uno script**: il generatore è aperto via `file://` e il
browser gli vieta di leggere il CSV da solo (CORS) — la rigenerazione
esplicita garantisce che generatore e lista non possano divergere (è già
successo: il generatore era rimasto a 23 contatti su 42).

## 3. ga4_report_builder.py — dal export GA4 al report per contatto

**Cosa fa**: legge un export CSV di GA4 Esplora (Formato libero) e
produce un profilo per ogni ref: colonne per ogni evento, più
`eventi_slide_view`, `presentazione_completata`, `ha_cliccato_contatti`.
Con `--contacts` aggiunge il nome dello studio in prima colonna.

**Quando**: dopo gli invii, ogni volta che serve un report aggiornato.

**Come**:
```bash
python ga4_report_builder.py export.csv
python ga4_report_builder.py export.csv --contacts lista_ref_completa_42.csv --out report_completo.csv
```

**Input**:
- `export.csv`: da GA4 → Esplora → scheda con dimensioni `ref` e
  `Nome evento` e metrica `Conteggio eventi` → icona download.
  Solo formato "Formato libero" (non report standard né canalizzazioni)
- `--contacts` (facoltativo): CSV con colonne `ref` e `studio` — oppure
  `nome`, accettato come alias: la lista ufficiale va bene così com'è

**Output**: `report_per_contatto.csv` (o `--out`), una riga per ref.

**Esclude automaticamente**: traffico `localhost`/`*.netlify.app`, righe
`(not set)` (visite non da email, escluse con messaggio), riga "Totale
complessivo". Se nell'export ci sono metriche oltre a `Conteggio eventi`
(es. "Utenti totali") vengono ignorate, non sommate per sbaglio.

**Attenzione a `eventi_slide_view`**: conta gli EVENTI slide_view (le
rivisite contano), non le slide distinte viste. Per il dettaglio per
slide serve l'estensione con `slide_name` (prevista: secondo output in
formato lungo `ref, slide_name, viste` + colonne `slide_distinte_viste`
e `max_slide_raggiunta`).

---

## Cosa NON va mai committato (e perché)

Il `.gitignore` del repo esclude già:

| Regola | Cosa copre |
|---|---|
| `tools/ga4-report/*.csv` | Qualunque CSV in questa cartella: export GA4, liste contatti, report |
| `contatti.csv`, `report_per_contatto*.csv` | Gli stessi file se creati per sbaglio altrove nel repo |
| `generatore_email.html` (root) | Il generatore con l'array studi completo |

Il motivo, valido per tutti: la **mappatura ref → identità reale**
(nome, email dello studio) è il dato che rende il tracciamento
riconducibile a persone specifiche. La regola di progetto (vedi
`_reference/PIANO_TRACCIAMENTO_ANALYTICS.md`, sezione "Parametro ref") è
che questa corrispondenza viva SOLO in un file locale, mai nel
repository, mai in una chat. I tre script sono committati perché non
contengono nessun dato — lavorano su file che restano fuori.

---

## Storia

- 10/07/2026 — cartella creata; report builder irrobustito rispetto alla
  prima versione ricevuta (BOM `utf-8-sig`, conversione numerica solo su
  colonne interamente numeriche e mai sulle dimensioni — un ref di sole
  cifre come `53775` non corrompe più gli altri —, metrica selezionata
  per nome, esclusione `(not set)`, alias `nome`→`studio`, ref duplicati
  segnalati) e testato contro la lista reale: 42 ref in ingresso →
  42 righe nel report. Aggiunti genera_generatore.py e genera_ref.py,
  entrambi testati sulla stessa lista reale.
