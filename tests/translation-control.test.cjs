const test = require("node:test");
const assert = require("node:assert/strict");
const {
  getTranslationControlView,
  shouldStartAutomaticTranslation
} = require("../translation-control.js");

test("active mode presents a stop action", () => {
  assert.deepEqual(getTranslationControlView(true), {
    active: true,
    actionLabel: "Stop live translation",
    statusLabel: null,
    translationMessage: null
  });
});

test("paused mode presents a red record start action", () => {
  assert.deepEqual(getTranslationControlView(false), {
    active: false,
    actionLabel: "Start live translation",
    statusLabel: "Paused",
    translationMessage: "Translation paused."
  });
});

test("automatic translation is allowed only in active mode with an engine and cue", () => {
  assert.equal(shouldStartAutomaticTranslation(true, true, true), true);
  assert.equal(shouldStartAutomaticTranslation(false, true, true), false);
  assert.equal(shouldStartAutomaticTranslation(true, false, true), false);
  assert.equal(shouldStartAutomaticTranslation(true, true, false), false);
});
