# Local Model Routing Contract

## Quick translation

- Destination: existing Ollama loopback chat endpoint
- Model: `llama3.2:3b`
- Trigger: debounced usable caption while translation is active
- Fallback: existing Chrome Translator path
- Output: bounded plain-text natural translation

## Meaning and idiom explanation

- Destination: existing Ollama loopback chat endpoint
- Model: `llama3.1:8b`
- Trigger: explicit Explain meaning & idioms action
- Fallback: existing Chrome LanguageModel path
- Output: bounded plain-text natural explanation

## Error contract

- Missing-model errors include the requested model identifier.
- Network and timeout errors retain existing user-safe wording.
- No route silently substitutes the other Ollama model.
