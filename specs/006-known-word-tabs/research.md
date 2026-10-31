# Research: Known Word Tabs

## Decisions

### Use “Learn again” for the per-word action

It describes the learner's intent and the state transition more clearly than “Save,” which could mean export, bookmark, or persist. The accessible label will include the word and destination.

### Reuse the existing known-key schema

Known words already persist as normalized keys. Adding a second metadata store would duplicate data, create migration work, and introduce inconsistency. The bundled lexicon can resolve current metadata on demand.

### Preserve honest metadata gaps

If a known key is not in the bundled lexicon, show the key and unlisted metadata. Restoring it uses a null level and empty meaning, matching manual Original-word selection behavior.

### Keep the Known tab selected after restore

This makes repeated cleanup efficient and avoids an unexpected context switch. Both counts update immediately and a status message confirms the destination.

### Replace bulk reset instead of retaining it

The requested per-word recovery is safer and more precise. Keeping bulk reset would preserve an unnecessarily destructive path and make the tab's purpose less clear.

### Serialize and verify before removing known state

The learning list can be bounded by important entries. The implementation first derives the candidate saved list and confirms the selected key is retained; only then does it remove the known key and store both collections together.

## Alternatives Rejected

- **Generic Save button**: ambiguous about destination and previous state.
- **Persist active tab**: adds a storage write and preference with little value.
- **Restore every known word at once**: recreates the unsafe bulk reset behavior.
- **Fetch dictionary metadata**: violates local-first behavior and is unnecessary.
