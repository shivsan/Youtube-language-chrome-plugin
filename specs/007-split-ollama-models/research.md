# Research: Split Ollama Models

## Decisions

### Translation uses `llama3.2:3b`

The user explicitly chose a 3B model for the high-frequency quick-translation path. It is the recommended balance between latency and usable German translation quality on the user's M1 Pro.

### Explanation keeps `llama3.1:8b`

The existing 8B model is already installed and measured locally. Its stronger language reasoning is retained for lower-frequency idiom and tone explanations.

### Each public operation owns its model selection

Routing at the public translate/explain boundary is easy to test and prevents a later shared default from silently sending both workloads to one model.

### Existing fallbacks remain route-specific

Chrome Translator continues to back up caption translation, while Chrome LanguageModel continues to back up explanation. Cross-falling from 3B to 8B is rejected because it would undermine the requested performance split.

### Keep-alive remains five minutes in this change

The user requested model routing, not a power/memory retention policy change. Keeping two models resident longer could consume substantial unified memory; tuning that policy should be measured separately.

## Alternatives Rejected

- One shared model constant: contradicts independent routing.
- 8B fallback for quick translation: can reintroduce the latency the split is intended to avoid.
- User-selectable model settings: expands scope and configuration burden.
- Cloud fallback: violates the local-first constitution.
