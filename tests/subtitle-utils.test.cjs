const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeCueText,
  deduplicateLines,
  cleanYouTubeTitle,
  isProgressiveCue,
  mergeOverlappingCueText,
  createCaptionContext,
  selectCurrentPassage,
  selectExplanationCaption
} = require("../subtitle-utils.js");

test("normalizes whitespace while preserving caption lines", () => {
  assert.equal(normalizeCueText("  Hello   there\n General\tKenobi "), "Hello there\nGeneral Kenobi");
});

test("removes duplicate rendered caption lines", () => {
  assert.deepEqual(deduplicateLines(["Hello", " Hello ", "World"]), ["Hello", "World"]);
});

test("removes YouTube branding from a document title", () => {
  assert.equal(cleanYouTubeTitle("Example Video - YouTube"), "Example Video");
});

test("recognizes progressively rendered caption text", () => {
  assert.equal(isProgressiveCue("I", "I am"), true);
  assert.equal(isProgressiveCue("I am", "I am Siva"), true);
  assert.equal(isProgressiveCue("I am\nSiva", "I am Siva today"), true);
});

test("distinguishes a new caption from a growing caption", () => {
  assert.equal(isProgressiveCue("I am Siva", "Nice to meet you"), false);
  assert.equal(isProgressiveCue("", "Nice to meet you"), false);
});

test("merges overlapping rolling captions without repeating shared words", () => {
  const first = "finden, denn in vielen europäischen Ländern brennt";
  const second = "Ländern brennt aktuell die Hütte, also wortwörtlich.";
  const expected = "finden, denn in vielen europäischen Ländern brennt aktuell die Hütte, also wortwörtlich.";
  assert.equal(mergeOverlappingCueText(first, second), expected);

  const context = createCaptionContext();
  context.addCue(cue({ id: "first", text: first, capturedAt: 1_000 }));
  context.addCue(cue({ id: "second", text: second, capturedAt: 1_500 }));
  assert.equal(context.snapshot(1_500).currentPassage, expected);
});

test("keeps unrelated captions separate and replaces progressive cue updates", () => {
  const context = createCaptionContext();
  context.addCue(cue({ id: "one", text: "I", capturedAt: 1_000 }));
  context.addCue(cue({ id: "one", text: "I am Siva", capturedAt: 1_100 }));
  context.addCue(cue({ id: "two", text: "Nice to meet you", capturedAt: 1_500 }));

  assert.deepEqual(context.snapshot(1_500), {
    currentText: "Nice to meet you",
    precedingText: "I am Siva",
    reconstructedText: "I am Siva\nNice to meet you",
    currentPassage: "Nice to meet you",
    cueCount: 2
  });
});

test("selects the reconstructed current passage for translation and explanation", () => {
  const context = createCaptionContext();
  context.addCue(cue({
    id: "first",
    text: "habe ich immer gerne gesehen. Es fing an",
    capturedAt: 1_000
  }));
  context.addCue(cue({
    id: "second",
    text: "Es fing an als Schülerprotest",
    capturedAt: 1_500
  }));

  const snapshot = context.snapshot(1_500);
  assert.equal(
    selectCurrentPassage(snapshot, "Es fing an als Schülerprotest"),
    "habe ich immer gerne gesehen. Es fing an als Schülerprotest"
  );
  assert.equal(selectCurrentPassage(snapshot, "Different cue"), "Different cue");
});

test("explains the source behind the visible translation instead of a trailing fragment", () => {
  const context = {
    currentText: "an als Schülerprotest und",
    currentPassage: "an als Schülerprotest und"
  };
  assert.equal(
    selectExplanationCaption(
      "habe ich immer gerne gesehen. Es fing an als Schülerprotest.",
      context,
      "an als Schülerprotest und"
    ),
    "habe ich immer gerne gesehen. Es fing an als Schülerprotest."
  );
});

test("bounds context by age, cue count, and characters", () => {
  const context = createCaptionContext({
    maxCues: 2,
    maxAgeMs: 3_000,
    maxChars: 32
  });

  context.addCue(cue({ id: "old", text: "This caption is stale", capturedAt: 1_000 }));
  context.addCue(cue({ id: "one", text: "First recent line", capturedAt: 4_500 }));
  context.addCue(cue({ id: "two", text: "Second recent line", capturedAt: 5_000 }));
  context.addCue(cue({ id: "three", text: "Third current line", capturedAt: 5_500 }));

  const snapshot = context.snapshot(5_500);
  assert.equal(snapshot.currentText, "Third current line");
  assert.equal(snapshot.precedingText, "");
  assert.equal(snapshot.cueCount, 1);
  assert.ok(snapshot.reconstructedText.length <= 32);
  assert.doesNotMatch(snapshot.reconstructedText, /stale|First/);
});

test("clears context on video changes and significant seeks", () => {
  const context = createCaptionContext({ maxPlaybackGapSeconds: 10 });
  context.addCue(cue({ id: "one", text: "Before", playbackSeconds: 10 }));
  context.addCue(cue({ id: "two", text: "After seek", playbackSeconds: 45 }));
  assert.equal(context.snapshot(2_000).reconstructedText, "After seek");

  context.addCue(cue({
    id: "three",
    text: "Different video",
    videoKey: "video-b",
    playbackSeconds: 46
  }));
  assert.equal(context.snapshot(2_000).reconstructedText, "Different video");
  assert.equal(context.snapshot(2_000).cueCount, 1);
});

function cue(overrides) {
  return {
    id: "cue",
    text: "Caption",
    title: "Video",
    videoKey: "video-a",
    playbackSeconds: 10,
    capturedAt: 2_000,
    ...overrides
  };
}
