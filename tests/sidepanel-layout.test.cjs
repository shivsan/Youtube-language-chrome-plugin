const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const html = readFileSync(join(projectRoot, "sidepanel.html"), "utf8");
const css = readFileSync(join(projectRoot, "sidepanel.css"), "utf8");
const script = readFileSync(join(projectRoot, "sidepanel.js"), "utf8");

function positionOf(fragment) {
  const position = html.indexOf(fragment);
  assert.notEqual(position, -1, `Expected sidepanel.html to contain ${fragment}`);
  return position;
}

test("current card presents translation before explanation and original reference", () => {
  const playbackTime = positionOf('id="playback-time"');
  const translation = positionOf('id="translated-text"');
  const explain = positionOf('id="explain-button"');
  const original = positionOf('id="original-text"');
  const vocabulary = positionOf('id="advanced-words"');

  assert.ok(playbackTime < translation, "playback time should remain with the current content");
  assert.ok(translation < explain, "translation should precede the explanation action");
  assert.ok(explain < original, "explanation action should precede the original reference");
  assert.ok(original < vocabulary, "original reference should precede its vocabulary summary");
  assert.match(html, /<section class="current-card" aria-label="Current translation">/);
  assert.match(html, /class="text-block translation-block"/);
  assert.match(html, /class="text-block original-block"/);
});

test("panel omits redundant visible headings and uses compact empty vocabulary copy", () => {
  assert.match(html, /<h1 class="eyebrow">LANGUAGE COMPANION<\/h1>/);
  assert.doesNotMatch(html, /Understand every line/);
  assert.doesNotMatch(html, /NOW PLAYING/);
  assert.doesNotMatch(html, /id="current-heading"/);
  assert.doesNotMatch(html, />Current translation<\/h2>/);
  assert.match(script, /appendNoAdvancedWordsMessage\("-"\)/);
});

test("translation has a generous stable reading area while both regions stay bounded", () => {
  assert.match(css, /\.translation-text\s*{[^}]*height:\s*8\.88em;[^}]*font-size:\s*19px;[^}]*font-weight:\s*680;/s);
  assert.match(css, /\.subtitle-text\s*{[^}]*height:\s*2\.96em;[^}]*color:\s*#b7b7c0;[^}]*font-size:\s*13px;/s);
  assert.match(css, /\.subtitle-text,\s*\.translation-text\s*{[^}]*overflow-y:\s*auto;[^}]*scrollbar-gutter:\s*stable;/s);
});

test("vocabulary actions expose persistent importance, known, and remove controls", () => {
  assert.match(html, /id="known-vocabulary-tab"[^>]*role="tab"/);
  assert.match(script, /setAttribute\("aria-pressed", String\(entry\.important\)\)/);
  assert.match(script, /`Mark \$\{entry\.lemma\} as important`/);
  assert.match(script, /`Mark \$\{entry\.lemma\} as known`/);
  assert.match(script, /`Remove \$\{entry\.lemma\} from Words to learn`/);
  assert.match(script, /learnAgain\.textContent = "Learn again"/);
  assert.match(css, /\.vocabulary-item-actions\s*{/);
  assert.match(css, /\.vocabulary-star\[aria-pressed="true"\]\s*{/);
});

test("side panel names the model assigned to each local AI route", () => {
  assert.match(script, /OLLAMA_TRANSLATION_MODEL/);
  assert.match(script, /OLLAMA_EXPLANATION_MODEL/);
  assert.match(
    script,
    /`Local \$\{OLLAMA_TRANSLATION_MODEL\} was unavailable, so Chrome is translating captions\.`/
  );
  assert.match(
    script,
    /`Using \$\{OLLAMA_EXPLANATION_MODEL\} locally through Ollama…`/
  );
  assert.match(
    script,
    /`Local \$\{OLLAMA_EXPLANATION_MODEL\} was unavailable\. Trying Chrome's on-device model…`/
  );
});
