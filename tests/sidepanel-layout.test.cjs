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
  const translation = positionOf('id="translated-text"');
  const explain = positionOf('id="explain-button"');
  const original = positionOf('id="original-text"');
  const vocabulary = positionOf('id="advanced-words"');

  assert.ok(translation < explain, "translation should precede the explanation action");
  assert.ok(explain < original, "explanation action should precede the original reference");
  assert.ok(original < vocabulary, "original reference should precede its vocabulary summary");
  assert.match(html, /<h2 id="current-heading">Current translation<\/h2>/);
  assert.match(html, /class="text-block translation-block"/);
  assert.match(html, /class="text-block original-block"/);
});

test("translation is visually dominant while both reading regions stay bounded", () => {
  assert.match(css, /\.translation-text\s*{[^}]*height:\s*4\.44em;[^}]*font-size:\s*19px;[^}]*font-weight:\s*680;/s);
  assert.match(css, /\.subtitle-text\s*{[^}]*height:\s*2\.96em;[^}]*color:\s*#b7b7c0;[^}]*font-size:\s*13px;/s);
  assert.match(css, /\.subtitle-text,\s*\.translation-text\s*{[^}]*overflow-y:\s*auto;[^}]*scrollbar-gutter:\s*stable;/s);
});

test("vocabulary actions expose persistent importance and known-word controls", () => {
  assert.match(html, /id="reset-known-vocabulary"[^>]*hidden/);
  assert.match(script, /setAttribute\("aria-pressed", String\(entry\.important\)\)/);
  assert.match(script, /`Mark \$\{entry\.lemma\} as important`/);
  assert.match(script, /`Mark \$\{entry\.lemma\} as known`/);
  assert.match(css, /\.vocabulary-item-actions\s*{/);
  assert.match(css, /\.vocabulary-star\[aria-pressed="true"\]\s*{/);
});
