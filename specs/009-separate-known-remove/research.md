# Research: Separate Known and Remove Actions

## Decision: Tick means persistent known-word suppression

**Rationale**: A tick naturally communicates completion or knowledge. It preserves the existing known-word behavior and recovery path in the Known tab.

## Decision: Cross means remove from the learning list only

**Rationale**: Removal and knowledge are different learner intents. Removing only from `savedVocabulary` keeps the word eligible for future collection.

## Decision: Keep both actions immediate and serialized

**Rationale**: The current compact controls act immediately, and the existing write queue prevents rapid actions from overwriting one another.

## Alternatives considered

- Keep the cross as known: rejected because it conflates dismissal with knowledge.
- Add a confirmation for each cross: rejected because the operation is recoverable through future collection or Original-word selection and would interrupt frequent vocabulary cleanup.
- Add a new storage collection for removed words: rejected because removal should not create persistent suppression.
