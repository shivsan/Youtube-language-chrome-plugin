# Contract: Current Caption Without History

## Background storage contract

- Accept only existing validated cues from trusted YouTube watch or Shorts senders.
- Serialize writes as before.
- Replace `latestCue` with each accepted cue.
- Never create or update `cueHistory`.
- Remove an existing `cueHistory` key during initialization.

## Side-panel contract

- Read `latestCue` and `translationEnabled` from session storage.
- Observe only `latestCue` for caption changes.
- Ignore invalid latest-cue values.
- Show no caption-history surface or previous-cue selector.

## Explanation contract

- Send only the current subtitle plus the requested output language to local explanation engines.
- Do not include a previous-context heading, placeholder, or prior subtitle string.

## Compatibility contract

- Preserve current translation, vocabulary, settings, pause/resume, and saved-word behavior.
- Add no permission, origin, dependency, or external request.
