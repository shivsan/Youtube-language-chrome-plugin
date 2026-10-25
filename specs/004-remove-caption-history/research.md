# Research: Remove Caption History

## Decision: Remove data retention, not only presentation

**Rationale**: Hiding the list would leave the privacy and maintenance cost of a session transcript while failing the plain meaning of removing caption history.

**Alternatives considered**: Collapse the section by default; add a setting; retain the array invisibly. Rejected because each preserves unnecessary complexity or data.

## Decision: Retain one session-scoped latest cue

**Rationale**: The side panel must recover the current caption when reopened, and one bounded cue is the minimum state that supports that behavior.

**Alternatives considered**: No session cue at all. Rejected because reopening the side panel would show an empty state until YouTube emits another DOM mutation.

## Decision: Remove previous-caption explanation context

**Rationale**: Keeping prior captions in memory or storage solely for prompts would still constitute caption history. Current-sentence explanations remain the primary requested behavior.

**Alternatives considered**: Two-cue in-memory context. Rejected because it creates an undocumented history boundary and complicates the privacy promise.

## Decision: Delete legacy session data during worker initialization

**Rationale**: Session storage can survive an unpacked extension reload; explicit cleanup prevents stale history from remaining after upgrade.

**Alternatives considered**: Ignore the old key and wait for Chrome shutdown. Rejected because the migration would be incomplete in an active session.
