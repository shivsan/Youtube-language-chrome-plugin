# Data Model: Vocabulary Word Actions

## Saved vocabulary entry

Existing fields remain unchanged:

- `key`: normalized identifier, non-empty string, maximum 100 characters
- `lemma`: display word, non-empty string, maximum 100 characters
- `level`: one of A1, A2, B1, B2, C1, C2
- `meaning`: string, maximum 500 characters
- `partOfSpeech`: string, maximum 50 characters
- `encounterCount`: integer of at least 1
- `firstSeenAt`, `lastSeenAt`: finite timestamps
- `encounterCueIds`: up to 20 valid cue identifiers

New field:

- `important`: Boolean; missing or invalid values migrate to `false`

Ordering:

1. `important: true` before `important: false`
2. Descending `lastSeenAt` within each importance group

State transitions:

- Unstarred → starred: set `important` true, retain all other fields
- Starred → unstarred: set `important` false, retain all other fields
- Saved → known: remove the entry and add its key to the known-word set

## Known-word set

- Stored as `knownVocabulary`
- Array of unique, non-empty normalized keys
- Each key is at most 100 characters
- Maximum 500 keys; newer additions are retained when capped
- Invalid or duplicate values are discarded on load

State transitions:

- Unknown → known: append the key once and remove any matching saved entry
- Known → eligible: Reset known clears the complete set; words may return only through a later caption encounter

## Consistency rules

- A key must not exist simultaneously in saved and known collections after a completed write.
- Automatic collection filters known keys before merging saved vocabulary.
- Clearing the active learning list does not clear known-word choices.
- Resetting known words does not clear the active learning list.
