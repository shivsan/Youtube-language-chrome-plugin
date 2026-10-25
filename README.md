# YouTube Language Companion

A local-first Chrome extension that reads the caption currently visible on YouTube and explains its natural meaning, idioms, and tone in Chrome's side panel.

## Features

- Captures only caption text visibly rendered on YouTube watch and Shorts pages.
- Translates each new caption with local Ollama, falling back to Chrome's on-device Translator API when Ollama is unavailable.
- Puts the natural translation first in a stable reading area, with the original caption kept below as a compact reference for comparison and vocabulary study.
- Provides a compact record/stop control to pause automatic translation without stopping the current caption, vocabulary, or manual explanations.
- Explains intended meaning, idioms, fixed expressions, slang, tone, grammar, and cultural context with local Llama, falling back to Chrome's on-device Prompt API.
- Lets learners select a persistent German level from A1 through C2 and shows it beside the extension name.
- Highlights German words estimated above the selected level and keeps a separate, deduplicated **Words to learn** collection.
- Lets learners star important words, mark familiar words as known so they stay out of the list, and reset known-word choices later; all choices remain local.
- Avoids misleading word-for-word translations. For example, German `Es ist nicht mein Bier` is explained as “It's none of my business” or “It's not my problem,” rather than literally as “It is not my beer.”
- Keeps only the current caption in session storage; each new caption replaces it and closing Chrome clears it.
- Does not fetch video, export transcripts, use analytics, or send caption text beyond the local device.

## Requirements

- Desktop Google Chrome 138 or newer.
- Captions must be enabled for the YouTube video.
- [Ollama](https://ollama.com/download) with `llama3.1:8b` installed for the primary local AI engine.

Ollama runs the primary model on `127.0.0.1`. Chrome may download its own language or AI models only if the Ollama request fails and the fallback is needed. Chrome model availability varies by language, browser version, operating system, hardware, and free disk space.

To install the local fallback model, start Ollama and run:

```sh
ollama pull llama3.1:8b
```

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project folder.
5. Open a YouTube video or Short and enable captions.
6. Select the extension's toolbar button to open the side panel.
7. Choose the caption language, translation language, and your German level.

Translation starts automatically. Press the stop-square button in the header to pause automatic translation; it becomes a red record button that resumes and translates the current caption. A pause lasts while the same Chrome session remains open. Expand **Languages & level** only when you want to change a setting.

## How it works

The content script observes YouTube's rendered caption elements on `/watch` and `/shorts` pages. It emits only changed, visible caption cues to the extension service worker. The worker keeps only the latest cue in `chrome.storage.session`; it does not accumulate a caption history. The side panel uses the local Ollama API first and automatically tries Chrome's built-in AI APIs if Ollama is unavailable.

For German captions, the side panel compares words with a bundled A1–C2 vocabulary index. CEFR labels are estimates rather than official ratings for every use of a word. Saved vocabulary contains the lemma, estimated level, short meaning, encounter count, importance choice, and random caption identifiers used for deduplication. Known-word choices are stored as normalized word keys so familiar words are not re-added. It does not retain the video title or subtitle sentence.

YouTube's interface is not a public caption integration API and can change. Caption selectors may need updating when YouTube changes its player. This project deliberately avoids intercepting media or private playback requests.

## Development

There are no runtime or development dependencies.

```sh
npm test
```

After changing extension files, use the reload button for the extension on `chrome://extensions`, then refresh the YouTube tab.

### Spec-driven development

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) with its Codex integration. New features follow a reviewable **specify → clarify → plan → checklist → tasks → analyze → implement → converge** workflow. Bug fixes use the separate **assess → fix → test** workflow.

Start Codex in this repository and invoke the installed skills with `$speckit-*`. For example:

```text
$speckit-specify Add an optional pause-while-explaining mode without interrupting caption capture.
$speckit-clarify Focus on playback state, user control, and recovery after errors.
$speckit-plan Keep the Manifest V3 architecture and add tests before changing the side panel.
$speckit-checklist
$speckit-tasks
$speckit-analyze
$speckit-implement
$speckit-converge
```

Project principles and non-negotiable privacy, security, UX, and testing constraints live in `.specify/memory/constitution.md`. Generated feature artifacts live under `specs/`; bug reports and verification records live under `.specify/bugs/`.

## Privacy

Only the current caption is stored in Chrome session storage and processed on the device; each new caption replaces it. No caption history is retained. Language preferences, the selected German level, saved vocabulary, importance stars, and known-word choices are stored in Chrome local extension storage. Saved vocabulary remains until it is removed or cleared; known-word choices remain until **Reset known** is used. When Ollama is used, subtitle text is sent only to the loopback address `127.0.0.1:11434`; it does not leave the computer. No API key is used.

## Vocabulary data

The bundled German CEFR index is generated from the Deutsch Karten A1–C2 dataset and is intended for personal, non-commercial language study. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution and licence terms. The index can be rebuilt from an acquired source file with:

```sh
npm run build:cefr-data -- /path/to/german_vocab_a1_c2.json
```

## Security design

- Site access is limited to YouTube watch and Shorts URLs. The only additional host permission is the exact loopback Ollama address `http://127.0.0.1:11434/*`.
- Content scripts explicitly run in Chrome's isolated world and stop processing after YouTube navigates away from a supported video route.
- Extension storage is restricted to trusted extension contexts, preventing content scripts from reading preferences or the current retained cue directly.
- The service worker validates the sender origin and every cue field before accepting caption data.
- Untrusted caption and model text is inserted with `textContent`, never interpreted as HTML.
- A strict extension-page Content Security Policy permits only bundled scripts and disables plugin objects.
- The Ollama client is pinned to loopback, uses bounded request sizes and timeouts, and treats subtitle content as untrusted quoted material.
- Validation fails if broad permissions, new origins, dynamic code execution, HTML injection, or unauthorized network requests are introduced.

## Disclaimer

This is an independent project and is not affiliated with or endorsed by YouTube or Google. Use it only with content you are authorized to access, and comply with YouTube's terms and applicable law.
