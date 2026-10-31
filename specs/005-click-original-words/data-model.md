# Data Model: Click Original Words to Learn

## OriginalWordToken

- `key`: normalized lowercase lemma when recognized, otherwise normalized surface; 1–100 characters.
- `surface`: exact visible token from the current caption.
- `start` / `end`: UTF-16 offsets into the current caption.
- `lemma`: dictionary lemma when recognized, otherwise the displayed surface.
- `level`: A1–C2 when recognized; `null` when unlisted.
- `meaning`: bundled meaning or an empty string.
- `partOfSpeech`: bundled category or an empty string.
- `recognized`: true only when the bundled lexicon resolves the surface.

## SavedVocabularyEntry

The existing record is unchanged except that `level` accepts `null` for manually selected unlisted words. The UI labels this state “unlisted”; automatic collection never creates it.

Existing validation and bounds remain: normalized unique key, lemma up to 100 characters, meaning up to 500, part of speech up to 50, positive encounter count and timestamps, at most 20 cue identifiers, importance flag, and collection limit of 500.

## WordSelectionState

- `available`: absent from both saved and known collections; activation can add it.
- `saved`: present in saved vocabulary; activation reports existing state without mutation.
- `known`: present in known vocabulary; activation reports the block without mutation.

Precedence is `known` over `saved` because initialization and known-word actions remove conflicting saved records.

## State Transitions

```text
available --select--> saved
saved --select--> saved
saved --mark known--> known
known --select--> known
known --reset known--> available
```
