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

  const api = { normalizeCueText, deduplicateLines, cleanYouTubeTitle };
  root.YouTubeLanguageUtils = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(globalThis);
