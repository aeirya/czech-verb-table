# Czech Verb Lab

A zero-dependency, browser-based Czech verb conjugation reference and practice tool.

## Conjugation tables (main page)

Open **`index.html`** to compare Czech verbs in a configurable table view inspired by the study workflow of [esponyol-inator](https://github.com/aeirya/esponyol-inator).

- **15 example verbs** covering common `-ám`, `-ím`, and `-uji` conjugation patterns, irregular stems, and perfective verbs.
- **Select any combination** of individual verbs, present/past/future, and six grammatical persons.
- **Quick comparison sets** for core patterns, individual endings, irregulars, and the `dělat` / `udělat` aspect contrast (automatically shows present + future).
- **Compare by verbs or by tenses** using responsive side-by-side panels.
- **Highlight stems, endings/irregular parts, and auxiliary words**, or disable color. Switch to **endings-only** to compare suffixes without stems.
- Toggle **masculine/feminine past agreement**; masculine animate/mixed vs feminine plural groups are included, but **neuter agreement is not**.
- Search verbs by Czech infinitive, English gloss, pattern, or aspect (diacritics optional).
- Preferences are saved locally in your browser.

**Aspect matters:** Czech perfective verbs have no true present tense. Their future forms are shown under Future, with a reminder in the Present view. Imperfective verbs usually form the future with `budu + infinitive`; `být` and `jít` have special future forms.

The application uses common example paradigms rather than a general-purpose Czech conjugator. Some verbs have additional standard or conversational variants; notes flag examples where relevant.

## Ending-block practice

Open **`practice.html`** for the original six-person drag-and-drop/click-to-place **present tense** exercise, with answer checking and pattern notes.

## Run locally

Open `index.html` directly in a modern browser. No server, compilation, dependency installation, or internet connection is required for the conjugation tables. The practice page also works directly, although its optional Google fonts need a connection.

## Extend it

- `verbs.js` — the verb list, complete conjugation arrays, past agreement, splitting metadata and comparison presets.
- `app.js` — selection, highlighting, rendering and browser-local preferences.
- `styles.css` — layout and responsive styling.
- `practice.html` — preserved original exercise.

Conjugation arrays follow **já, ty, on/ona, my, vy, oni/ony**. Verbs are labelled **imperfective (IPF)** or **perfective (PF)**. The `pastStem` and `stem` fields define the visually colored parts; full forms are stored explicitly or derived from the indicated past/future auxiliary patterns.
