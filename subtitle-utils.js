(function exposeSubtitleUtils(root) {
  function normalizeCueText(value) {
    if (typeof value !== "string") {
      return "";
    }

    return value
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  function deduplicateLines(values) {
    const seen = new Set();
    const result = [];

    for (const value of values) {
      const normalized = normalizeCueText(value);
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      result.push(normalized);
    }

    return result;
  }

  function cleanYouTubeTitle(value) {
    return normalizeCueText(value)
      .replace(/\s*[-–—|]\s*YouTube$/i, "")
      .slice(0, 200);
  }

  function isProgressiveCue(previousValue, nextValue) {
    const previous = normalizeCueText(previousValue).replace(/\n/g, " ");
    const next = normalizeCueText(nextValue).replace(/\n/g, " ");

    return Boolean(previous && next && next.startsWith(previous));
  }

  function mergeOverlappingCueText(previousValue, nextValue) {
    return mergeCaptionFragments(previousValue, nextValue).text;
  }

  function createCaptionContext(options = {}) {
    const limits = {
      maxCues: positiveInteger(options.maxCues, 4),
      maxAgeMs: positiveInteger(options.maxAgeMs, 20_000),
      maxChars: positiveInteger(options.maxChars, 1_600),
      maxPlaybackGapSeconds: positiveNumber(options.maxPlaybackGapSeconds, 12)
    };
    let cues = [];

    function addCue(cue) {
      const nextCue = sanitizeContextCue(cue);
      if (!nextCue) {
        return snapshot();
      }

      const previousCue = cues.at(-1);
      if (previousCue && shouldResetContext(previousCue, nextCue, limits)) {
        cues = [];
      }

      const currentCue = cues.at(-1);
      if (currentCue?.id === nextCue.id) {
        cues[cues.length - 1] = nextCue;
      } else {
        cues.push(nextCue);
      }

      trimContext(nextCue.capturedAt);
      return snapshot(nextCue.capturedAt);
    }

    function clear() {
      cues = [];
    }

    function snapshot(now = Date.now()) {
      trimContext(now);
      if (cues.length === 0) {
        return {
          currentText: "",
          precedingText: "",
          reconstructedText: "",
          currentPassage: "",
          cueCount: 0
        };
      }

      const currentText = cues.at(-1).text;
      const precedingText = mergeCueTexts(cues.slice(0, -1));
      return {
        currentText,
        precedingText,
        reconstructedText: mergeCueTexts(cues),
        currentPassage: buildCurrentPassage(cues),
        cueCount: cues.length
      };
    }

    function trimContext(now) {
      const currentCue = cues.at(-1);
      cues = cues
        .filter((cue) => cue === currentCue || now - cue.capturedAt <= limits.maxAgeMs)
        .slice(-limits.maxCues);

      while (cues.length > 1 && mergeCueTexts(cues).length > limits.maxChars) {
        cues.shift();
      }

      const retainedCurrentCue = cues.at(-1);
      if (retainedCurrentCue && retainedCurrentCue.text.length > limits.maxChars) {
        retainedCurrentCue.text = retainedCurrentCue.text.slice(0, limits.maxChars).trim();
      }
    }

    return Object.freeze({ addCue, clear, snapshot });
  }

  function selectCurrentPassage(context, cueText) {
    const normalizedCue = normalizeCueText(cueText);
    if (
      context?.currentText === normalizedCue &&
      typeof context.currentPassage === "string" &&
      context.currentPassage.trim()
    ) {
      return context.currentPassage.trim();
    }
    return normalizedCue;
  }

  function selectExplanationCaption(displayedTranslationSource, context, cueText) {
    return normalizeCueText(displayedTranslationSource) ||
      selectCurrentPassage(context, cueText);
  }

  function mergeCueTexts(cues) {
    return cues.reduce(
      (merged, cue) => mergeOverlappingCueText(merged, cue.text),
      ""
    );
  }

  function buildCurrentPassage(cues) {
    let passage = cues.at(-1)?.text || "";
    for (let index = cues.length - 2; index >= 0; index -= 1) {
      const merged = mergeCaptionFragments(cues[index].text, passage);
      if (!merged.overlapped) {
        break;
      }
      passage = merged.text;
    }
    return passage;
  }

  function mergeCaptionFragments(previousValue, nextValue) {
    const previous = normalizeCueText(previousValue).replace(/\n/g, " ");
    const next = normalizeCueText(nextValue).replace(/\n/g, " ");
    if (!previous) {
      return { text: next, overlapped: false };
    }
    if (!next) {
      return { text: previous, overlapped: false };
    }
    if (previous === next || previous.endsWith(next)) {
      return { text: previous, overlapped: true };
    }
    if (next.startsWith(previous)) {
      return { text: next, overlapped: true };
    }

    const previousTokens = previous.split(" ");
    const nextTokens = next.split(" ");
    const maximumOverlap = Math.min(previousTokens.length, nextTokens.length);

    for (let size = maximumOverlap; size > 0; size -= 1) {
      const previousTail = previousTokens.slice(-size);
      const nextHead = nextTokens.slice(0, size);
      const normalizedTail = previousTail.map(normalizeOverlapToken);
      const normalizedHead = nextHead.map(normalizeOverlapToken);
      const matches = normalizedTail.every(
        (token, index) => token && token === normalizedHead[index]
      );
      const meaningful = size >= 2 || normalizedTail[0]?.length >= 6;
      if (matches && meaningful) {
        return {
          text: [...previousTokens, ...nextTokens.slice(size)].join(" "),
          overlapped: true
        };
      }
    }

    return { text: `${previous}\n${next}`, overlapped: false };
  }

  function normalizeOverlapToken(value) {
    return value
      .toLowerCase()
      .replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");
  }

  function sanitizeContextCue(cue) {
    const text = normalizeCueText(cue?.text);
    if (!text || typeof cue?.id !== "string" || !Number.isFinite(cue.capturedAt)) {
      return null;
    }
    return {
      id: cue.id,
      text,
      title: typeof cue.title === "string" ? cue.title : "",
      videoKey: typeof cue.videoKey === "string" ? cue.videoKey : "",
      playbackSeconds: Number.isFinite(cue.playbackSeconds)
        ? cue.playbackSeconds
        : null,
      capturedAt: cue.capturedAt
    };
  }

  function shouldResetContext(previousCue, nextCue, limits) {
    if (
      previousCue.videoKey &&
      nextCue.videoKey &&
      previousCue.videoKey !== nextCue.videoKey
    ) {
      return true;
    }
    if (
      !previousCue.videoKey &&
      !nextCue.videoKey &&
      previousCue.title &&
      nextCue.title &&
      previousCue.title !== nextCue.title
    ) {
      return true;
    }

    const elapsedMs = nextCue.capturedAt - previousCue.capturedAt;
    if (elapsedMs < 0 || elapsedMs > limits.maxAgeMs) {
      return true;
    }
    if (
      Number.isFinite(previousCue.playbackSeconds) &&
      Number.isFinite(nextCue.playbackSeconds)
    ) {
      const playbackAdvance = nextCue.playbackSeconds - previousCue.playbackSeconds;
      const expectedAdvance = elapsedMs / 1_000;
      return (
        playbackAdvance < -2 ||
        playbackAdvance > expectedAdvance + limits.maxPlaybackGapSeconds
      );
    }
    return false;
  }

  function positiveInteger(value, fallback) {
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  function positiveNumber(value, fallback) {
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  const api = {
    normalizeCueText,
    deduplicateLines,
    cleanYouTubeTitle,
    isProgressiveCue,
    mergeOverlappingCueText,
    createCaptionContext,
    selectCurrentPassage,
    selectExplanationCaption
  };
  root.YouTubeLanguageUtils = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(globalThis);
