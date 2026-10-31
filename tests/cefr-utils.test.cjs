const test = require("node:test");
const assert = require("node:assert/strict");
const {
  addKnownVocabularyKey,
  classifyVocabularyWord,
  createGermanLexicon,
  filterKnownVocabulary,
  findAdvancedGermanWords,
  findGermanWords,
  mergeSavedVocabulary,
  removeKnownVocabularyKey,
  resolveKnownVocabularyWord,
  sanitizeKnownVocabulary,
  toggleVocabularyImportance
} = require("../cefr-utils.js");

const lexicon = createGermanLexicon([
  ["Bier", "A1", "beer", "noun", ["Biere"]],
  ["entscheiden", "B1", "to decide", "verb", ["entscheidet", "entschieden"]],
  ["unvermeidlich", "C1", "unavoidable", "adjective", []]
]);

test("tokenizes every German word while resolving only bundled vocabulary metadata", () => {
  const words = findGermanWords("Das Bier, Fantasie-Wort!", lexicon);

  assert.deepEqual(
    words.map(({ surface, lemma, level, recognized }) => ({
      surface,
      lemma,
      level,
      recognized
    })),
    [
      { surface: "Das", lemma: "Das", level: null, recognized: false },
      { surface: "Bier", lemma: "Bier", level: "A1", recognized: true },
      {
        surface: "Fantasie-Wort",
        lemma: "Fantasie-Wort",
        level: null,
        recognized: false
      }
    ]
  );
  assert.deepEqual(words.map(({ start, end }) => ({ start, end })), [
    { start: 0, end: 3 },
    { start: 4, end: 8 },
    { start: 10, end: 23 }
  ]);
});

test("finds only German words above the selected CEFR level", () => {
  assert.deepEqual(
    findAdvancedGermanWords("Das Bier ist unvermeidlich entschieden.", "A2", lexicon).map(
      ({ lemma, level, surface }) => ({ lemma, level, surface })
    ),
    [
      { lemma: "unvermeidlich", level: "C1", surface: "unvermeidlich" },
      { lemma: "entscheiden", level: "B1", surface: "entschieden" }
    ]
  );
});

test("finds every advanced occurrence so each can be highlighted", () => {
  const matches = findAdvancedGermanWords("Er entscheidet, wir haben entschieden.", "A2", lexicon);
  assert.equal(matches.length, 2);
  assert.deepEqual(matches.map((match) => match.lemma), ["entscheiden", "entscheiden"]);
});

test("stores a word once per caption and increments it on a later caption", () => {
  const words = findAdvancedGermanWords("unvermeidlich unvermeidlich", "A2", lexicon);
  const first = mergeSavedVocabulary([], words, "cue-1", 100);
  const sameCue = mergeSavedVocabulary(first, words, "cue-1", 200);
  const laterCue = mergeSavedVocabulary(sameCue, words, "cue-2", 300);

  assert.equal(sameCue, first);
  assert.equal(first.length, 1);
  assert.equal(first[0].important, false);
  assert.equal(laterCue[0].encounterCount, 2);
  assert.equal(laterCue[0].lastSeenAt, 300);
  assert.deepEqual(laterCue[0].encounterCueIds, ["cue-1", "cue-2"]);
});

test("stores a manually selected unlisted word without inventing metadata", () => {
  const [word] = findGermanWords("Fantasiewort", lexicon);
  const saved = mergeSavedVocabulary([], [word], "cue-1", 100);

  assert.deepEqual(saved, [
    {
      key: "fantasiewort",
      lemma: "Fantasiewort",
      level: null,
      meaning: "",
      partOfSpeech: "",
      encounterCount: 1,
      firstSeenAt: 100,
      lastSeenAt: 100,
      encounterCueIds: ["cue-1"],
      important: false
    }
  ]);
});

test("classifies original words with known state taking precedence", () => {
  const saved = [{ key: "bier" }];

  assert.equal(classifyVocabularyWord(saved, [], "neu"), "available");
  assert.equal(classifyVocabularyWord(saved, [], "bier"), "saved");
  assert.equal(classifyVocabularyWord(saved, ["bier"], "bier"), "known");
  assert.equal(classifyVocabularyWord(saved, ["bekannt"], "bekannt"), "known");
});

test("keeps an important saved word when the vocabulary limit is reached", () => {
  const saved = [
    {
      key: "important",
      lemma: "wichtig",
      level: "B2",
      encounterCount: 1,
      firstSeenAt: 100,
      lastSeenAt: 100,
      encounterCueIds: ["cue-1"],
      important: true
    }
  ];
  const advancedWords = [
    {
      key: "new",
      lemma: "neu",
      level: "B2",
      meaning: "new",
      partOfSpeech: "adjective"
    }
  ];

  const merged = mergeSavedVocabulary(saved, advancedWords, "cue-2", 200, 1);

  assert.deepEqual(merged.map(({ key, important }) => ({ key, important })), [
    { key: "important", important: true }
  ]);
});

test("toggles importance without losing encounter data and sorts important words first", () => {
  const current = [
    {
      key: "newer",
      lemma: "neuer",
      level: "B2",
      encounterCount: 3,
      lastSeenAt: 300,
      important: false
    },
    {
      key: "older",
      lemma: "älter",
      level: "B2",
      encounterCount: 7,
      lastSeenAt: 100,
      important: false
    }
  ];

  const starred = toggleVocabularyImportance(current, "older");
  assert.deepEqual(starred.map(({ key, important }) => ({ key, important })), [
    { key: "older", important: true },
    { key: "newer", important: false }
  ]);
  assert.equal(starred[0].encounterCount, 7);

  const unstarred = toggleVocabularyImportance(starred, "older");
  assert.deepEqual(unstarred.map(({ key, important }) => ({ key, important })), [
    { key: "newer", important: false },
    { key: "older", important: false }
  ]);
});

test("filters known words before automatic vocabulary collection", () => {
  const words = findAdvancedGermanWords(
    "unvermeidlich entschieden",
    "A2",
    lexicon
  );

  assert.deepEqual(
    filterKnownVocabulary(words, ["unvermeidlich"]).map((word) => word.key),
    ["entscheiden"]
  );
});

test("sanitizes, deduplicates, and bounds known vocabulary keys", () => {
  assert.deepEqual(
    sanitizeKnownVocabulary(["first", "", "first", 42, "second", "third"], 2),
    ["second", "third"]
  );
  assert.deepEqual(addKnownVocabularyKey(["first", "second"], "third", 2), [
    "second",
    "third"
  ]);
  assert.deepEqual(addKnownVocabularyKey(["first"], "first", 2), ["first"]);
  assert.deepEqual(
    sanitizeKnownVocabulary(["first", "second", "first", "third"], 2),
    ["first", "third"]
  );
});

test("removes exactly one known vocabulary key without mutating the input", () => {
  const known = ["bier", "entscheiden", "unvermeidlich"];

  assert.deepEqual(removeKnownVocabularyKey(known, "entscheiden"), [
    "bier",
    "unvermeidlich"
  ]);
  assert.deepEqual(known, ["bier", "entscheiden", "unvermeidlich"]);
  assert.deepEqual(removeKnownVocabularyKey(known, "missing"), known);
});

test("resolves known keys from the bundled lexicon with an honest unlisted fallback", () => {
  assert.deepEqual(resolveKnownVocabularyWord("biere", lexicon), {
    key: "biere",
    lemma: "Bier",
    level: "A1",
    meaning: "beer",
    partOfSpeech: "noun",
    recognized: true
  });
  assert.deepEqual(resolveKnownVocabularyWord("fantasiewort", lexicon), {
    key: "fantasiewort",
    lemma: "fantasiewort",
    level: null,
    meaning: "",
    partOfSpeech: "",
    recognized: false
  });
  assert.equal(resolveKnownVocabularyWord("", lexicon), null);
  assert.equal(resolveKnownVocabularyWord("bier", null), null);
});
