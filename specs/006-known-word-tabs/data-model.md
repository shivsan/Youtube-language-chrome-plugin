# Data Model: Known Word Tabs

## Existing Persistent Collections

### Saved vocabulary

`savedVocabulary[]` retains its existing shape: normalized key, display lemma, nullable CEFR level, meaning, part of speech, encounter count and timestamps, encounter cue IDs, and importance.

### Known vocabulary

`knownVocabulary[]` remains an ordered array of normalized string keys. Later items are more recently marked known.

## Derived View Entity

### Known vocabulary word

- `key`: sanitized normalized key
- `lemma`: bundled lemma when resolved; otherwise the key
- `level`: bundled CEFR level or `null`
- `meaning`: bundled meaning or empty string
- `partOfSpeech`: bundled part of speech or empty string
- `recognized`: whether the bundled lexicon resolved the key

This entity is computed locally and is never stored separately.

## Session UI State

- `activeVocabularyTab`: `learn` or `known`; defaults to `learn` and is not persisted.

## State Transitions

### Mark saved word known

1. Remove the key from `savedVocabulary`.
2. Append it to sanitized `knownVocabulary`.
3. Store both collections together.

### Learn again

1. Confirm the key is still known inside the serialized write queue.
2. Resolve its derived view entity from the bundled lexicon.
3. Merge a fresh one-encounter record into `savedVocabulary`.
4. Confirm the bounded result contains the key.
5. Remove exactly that key from `knownVocabulary`.
6. Store both collections together and rerender.

### Restore failure

If step 4 or storage persistence fails, retain the known key and announce failure. No partial in-memory state should be presented as saved.
