# Data Model: Separate Known and Remove Actions

## Existing collections

- `savedVocabulary`: learning entries displayed in Words to learn.
- `knownVocabulary`: normalized word keys suppressed from automatic collection and displayed in Known.

## Transitions

### Mark known with tick

1. Remove the selected key from `savedVocabulary`.
2. Add the normalized key to `knownVocabulary`.
3. Persist both collections in one local-storage write.

### Remove with cross

1. Remove the selected key from `savedVocabulary`.
2. Leave `knownVocabulary` unchanged.
3. Persist only `savedVocabulary`.

No storage schema, migration, permission, or retention change is required.
