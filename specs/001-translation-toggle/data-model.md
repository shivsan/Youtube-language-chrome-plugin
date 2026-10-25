# Data Model: Translation Record Control

## TranslationMode

Represents whether automatic quick translation is allowed in the current Chrome session.

| Field | Type | Allowed values | Default | Storage |
|---|---|---|---|---|
| `translationEnabled` | Boolean | `true`, `false` | `true` when missing | `chrome.storage.session` |

### State transitions

| Current | Learner action | Next | Required effects |
|---|---|---|---|
| Active | Press stop-square button | Paused | Clear scheduled work, invalidate pending results, show paused status |
| Paused | Press red record button | Active | Prepare/reuse the local-first engine and translate the selected caption |
| Paused | Change language | Paused | Save language only; do not prepare or call a translator |
| Either | New Chrome session | Active | Session value is absent and defaults to active |

## ControlPresentation

Derived, not stored.

| Mode | `data-active` | Accessible name / tooltip | Icon |
|---|---|---|---|
| Active | `true` | `Stop live translation` | Stop square |
| Paused | `false` | `Start live translation` | Red record circle |

## Invariants

- Automatic translation may start only when `translationEnabled`, a translator, and a selected caption are all present.
- The translation area says `Translation paused.` whenever the mode is paused.
- Caption history and saved vocabulary are never cleared or disabled by a mode transition.
- Manual explanation requests do not depend on `translationEnabled`.
- Control dimensions do not depend on the mode.
