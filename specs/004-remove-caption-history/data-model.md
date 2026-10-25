# Data Model: Remove Caption History

## Latest caption cue

The sole retained caption entity for an active Chrome session.

| Field | Constraint |
|---|---|
| `id` | Non-empty string, maximum 100 characters |
| `text` | Non-empty string, maximum 1,000 characters |
| `title` | String, maximum 200 characters |
| `playbackSeconds` | `null` or a finite non-negative number |
| `capturedAt` | Finite positive number |

### Lifecycle

1. A trusted YouTube content script submits a valid cue.
2. The cue replaces the previous `latestCue` value through the serialized session write queue.
3. The side panel reads or observes this one value.
4. Chrome removes the value when the browser session ends.

## Obsolete caption history

The former `cueHistory` array is not part of the active model. It is deleted during background initialization and is never read or written afterward.

## Unchanged data

Translation mode remains session-scoped. Languages, learner level, saved vocabulary, importance flags, and known-word choices remain local persistent preferences.
