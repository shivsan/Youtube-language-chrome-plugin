# YouTube Language Companion

A local-first Chrome extension that reads the caption currently visible on YouTube and explains its natural meaning, idioms, and tone in Chrome's side panel.

## Features

- Captures only caption text visibly rendered on YouTube watch and Shorts pages.
- Translates each new caption using Chrome's on-device Translator API.
- Explains intended meaning, idioms, fixed expressions, slang, tone, grammar, and cultural context with Chrome's on-device Prompt API.
- Avoids misleading word-for-word translations. For example, German `Es ist nicht mein Bier` is explained as “It's none of my business” or “It's not my problem,” rather than literally as “It is not my beer.”
- Keeps a short caption history in session storage; closing Chrome clears it.
- Does not fetch video, export transcripts, use analytics, or send caption text to a server.

## Requirements

- Desktop Google Chrome 138 or newer.
- A device supported by Chrome's built-in AI features.
- Captions must be enabled for the YouTube video.

Chrome may download language or AI models the first time a feature is used. Availability varies by language, Chrome version, operating system, hardware, and free disk space.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project folder.
5. Open a YouTube video or Short and enable captions.
6. Select the extension's toolbar button to open the side panel.
7. Choose the caption and target languages, then select **Start live translation**.

## How it works

The content script observes YouTube's rendered caption elements on `/watch` and `/shorts` pages. It emits only changed, visible caption cues to the extension service worker. The worker keeps the most recent 60 cues in `chrome.storage.session`. The side panel performs translation and explanation locally with Chrome's built-in AI APIs.

YouTube's interface is not a public caption integration API and can change. Caption selectors may need updating when YouTube changes its player. This project deliberately avoids intercepting media or private playback requests.

## Development

There are no runtime or development dependencies.

```sh
npm test
```

After changing extension files, use the reload button for the extension on `chrome://extensions`, then refresh the YouTube tab.

## Privacy

Caption text is stored only in Chrome session storage and processed on the device. Language preferences are stored in Chrome local extension storage. The extension makes no external network requests of its own.

## Security design

- Site access is limited to YouTube watch and Shorts URLs; no separate host permissions are requested.
- Content scripts explicitly run in Chrome's isolated world and stop processing after YouTube navigates away from a supported video route.
- Extension storage is restricted to trusted extension contexts, preventing content scripts from reading preferences or captured history directly.
- The service worker validates the sender origin and every cue field before accepting caption data.
- Untrusted caption and model text is inserted with `textContent`, never interpreted as HTML.
- A strict extension-page Content Security Policy permits only bundled scripts and disables plugin objects.
- Validation fails if broad permissions, new origins, dynamic code execution, HTML injection, or direct network requests are introduced.

## Disclaimer

This is an independent project and is not affiliated with or endorsed by YouTube or Google. Use it only with content you are authorized to access, and comply with YouTube's terms and applicable law.
