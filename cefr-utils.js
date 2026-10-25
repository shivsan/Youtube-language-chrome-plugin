(function exposeCefrUtils(root) {
  const CEFR_LEVELS = Object.freeze(["A1", "A2", "B1", "B2", "C1", "C2"]);

  function normalizeGermanForm(value) {
    return typeof value === "string"
      ? value.normalize("NFC").toLocaleLowerCase("de-DE").trim()
      : "";
  }

  function isCefrLevel(value) {
    return CEFR_LEVELS.includes(value);
  }

  function createGermanLexicon(rows) {
    const lexicon = new Map();
    const entries = [];

    for (const row of Array.isArray(rows) ? rows : []) {
      const [lemma, level, meaning = "", partOfSpeech = "", forms = []] = row;
      if (!lemma || !isCefrLevel(level)) {
        continue;
      }

      const entry = Object.freeze({
        lemma,
        level,
        meaning,
        partOfSpeech
      });
      entries.push({ entry, forms });

      const normalizedLemma = normalizeGermanForm(lemma);
      if (normalizedLemma && !lexicon.has(normalizedLemma)) {
        lexicon.set(normalizedLemma, entry);
      }
    }

    for (const { entry, forms } of entries) {
      for (const form of Array.isArray(forms) ? forms : []) {
        const normalizedForm = normalizeGermanForm(form);
        if (normalizedForm && !lexicon.has(normalizedForm)) {
          lexicon.set(normalizedForm, entry);
        }
      }
    }

    return lexicon;
  }

  function findAdvancedGermanWords(text, learnerLevel, lexicon) {
    const threshold = CEFR_LEVELS.indexOf(learnerLevel);
    if (typeof text !== "string" || threshold < 0 || !(lexicon instanceof Map)) {
      return [];
    }

    const matches = [];
    const wordPattern = /[\p{L}\p{M}]+(?:[-’'][\p{L}\p{M}]+)*/gu;

    for (const match of text.matchAll(wordPattern)) {
      const surface = match[0];
      const entry = lexicon.get(normalizeGermanForm(surface));
      if (!entry || CEFR_LEVELS.indexOf(entry.level) <= threshold) {
        continue;
      }

      const key = normalizeGermanForm(entry.lemma);
      matches.push({
        key,
        surface,
        start: match.index,
        end: match.index + surface.length,
        lemma: entry.lemma,
        level: entry.level,
        meaning: entry.meaning,
        partOfSpeech: entry.partOfSpeech
      });
    }

    return matches;
  }

  function sortSavedVocabulary(currentItems, maxEntries = 500) {
    const limit = Math.max(1, Number.isFinite(maxEntries) ? Math.floor(maxEntries) : 500);
    return (Array.isArray(currentItems) ? currentItems : [])
      .map((item) => ({ ...item, important: item?.important === true }))
      .sort((left, right) => (
        Number(right.important) - Number(left.important) ||
        right.lastSeenAt - left.lastSeenAt
      ))
      .slice(0, limit);
  }

  function toggleVocabularyImportance(currentItems, key) {
    if (!Array.isArray(currentItems) || typeof key !== "string") {
      return currentItems;
    }

    let found = false;
    const items = currentItems.map((item) => {
      if (item?.key !== key) {
        return { ...item };
      }
      found = true;
      return { ...item, important: item.important !== true };
    });

    return found ? sortSavedVocabulary(items, Math.max(1, items.length)) : currentItems;
  }

  function sanitizeKnownVocabulary(value, maxEntries = 500) {
    const limit = Math.max(1, Number.isFinite(maxEntries) ? Math.floor(maxEntries) : 500);
    const seen = new Set();
    const keys = [];

    const input = Array.isArray(value) ? value : [];
    for (let index = input.length - 1; index >= 0 && keys.length < limit; index -= 1) {
      const key = input[index];
      if (
        typeof key !== "string" ||
        key.length === 0 ||
        key.length > 100 ||
        seen.has(key)
      ) {
        continue;
      }
      seen.add(key);
      keys.push(key);
    }

    return keys.reverse();
  }

  function addKnownVocabularyKey(currentKeys, key, maxEntries = 500) {
    const keys = sanitizeKnownVocabulary(currentKeys, maxEntries);
    if (typeof key !== "string" || key.length === 0 || key.length > 100 || keys.includes(key)) {
      return keys;
    }
    return sanitizeKnownVocabulary([...keys, key], maxEntries);
  }

  function filterKnownVocabulary(words, knownKeys) {
    const known = new Set(sanitizeKnownVocabulary(knownKeys));
    return (Array.isArray(words) ? words : []).filter((word) => (
      typeof word?.key === "string" && !known.has(word.key)
    ));
  }

  function mergeSavedVocabulary(currentItems, advancedWords, cueId, seenAt, maxEntries = 500) {
    const items = Array.isArray(currentItems) ? currentItems.map((item) => ({ ...item })) : [];
    const byKey = new Map(items.map((item) => [item.key, item]));
    let changed = false;

    for (const word of Array.isArray(advancedWords) ? advancedWords : []) {
      if (!word?.key || !isCefrLevel(word.level)) {
        continue;
      }

      const existing = byKey.get(word.key);
      if (existing) {
        const encounterCueIds = Array.isArray(existing.encounterCueIds)
          ? existing.encounterCueIds
          : existing.lastEncounterCueId
            ? [existing.lastEncounterCueId]
            : [];
        if (!encounterCueIds.includes(cueId)) {
          existing.encounterCount = Math.max(1, Number(existing.encounterCount) || 1) + 1;
          existing.lastSeenAt = seenAt;
          existing.encounterCueIds = [...encounterCueIds, cueId].slice(-20);
          delete existing.lastEncounterCueId;
          changed = true;
        }
        continue;
      }

      const item = {
        key: word.key,
        lemma: word.lemma,
        level: word.level,
        meaning: word.meaning || "",
        partOfSpeech: word.partOfSpeech || "",
        encounterCount: 1,
        firstSeenAt: seenAt,
        lastSeenAt: seenAt,
        encounterCueIds: [cueId],
        important: false
      };
      items.push(item);
      byKey.set(item.key, item);
      changed = true;
    }

    if (!changed) {
      return currentItems;
    }

    return sortSavedVocabulary(items, maxEntries);
  }

  const api = {
    CEFR_LEVELS,
    normalizeGermanForm,
    isCefrLevel,
    createGermanLexicon,
    findAdvancedGermanWords,
    mergeSavedVocabulary,
    sortSavedVocabulary,
    toggleVocabularyImportance,
    sanitizeKnownVocabulary,
    addKnownVocabularyKey,
    filterKnownVocabulary
  };
  root.YouTubeLanguageCefrUtils = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(globalThis);
