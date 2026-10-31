# Data Model: Split Ollama Models

This feature introduces no persistent data.

## Configuration Entities

### Translation model route

- Identifier: `llama3.2:3b`
- Consumer: automatic quick translation
- Fallback: Chrome on-device Translator
- Request policy: existing bounded translation prompt and debounce

### Explanation model route

- Identifier: `llama3.1:8b`
- Consumer: user-requested meaning and idiom explanation
- Fallback: Chrome on-device LanguageModel
- Request policy: existing bounded tutor prompt

## Invariants

- Each operation supplies its own model identifier.
- Both model identifiers are fixed, non-user data and are not persisted.
- Failure or availability of one route does not mutate the other route.
