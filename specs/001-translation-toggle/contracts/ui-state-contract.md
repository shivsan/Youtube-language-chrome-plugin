# UI State Contract: Translation Record Control

## Active mode

- Header button has `data-active="true"`.
- Header button has `aria-label="Stop live translation"` and the same `title`.
- The icon is visually a stop square.
- Automatic translation may be scheduled when a caption and translator are available.
- Settings status reflects the current engine (`Preparing`, `Local Llama`, or `Chrome fallback`).

## Paused mode

- Header button has `data-active="false"`.
- Header button has `aria-label="Start live translation"` and the same `title`.
- The icon is visually a red record circle.
- Settings status reads `Paused`.
- The quick-translation area reads `Translation paused.`.
- No debounce callback, caption update, language change, or late request completion may start or display an automatic translation.
- Original captions, history, vocabulary, and manual explanation remain usable.

## Persistence contract

- Each mode change writes `translationEnabled` to `chrome.storage.session`.
- Reopening the panel reads and honors that value.
- An absent or invalid value resolves to active mode.

## Accessibility and layout contract

- The control is a native button and follows normal tab order.
- The existing visible `:focus-visible` treatment applies.
- Shape and accessible text communicate state in addition to color.
- The button's width and height remain fixed in both states.
