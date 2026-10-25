(function exposeTranslationControl(root) {
  function getTranslationControlView(enabled) {
    if (enabled) {
      return {
        active: true,
        actionLabel: "Stop live translation",
        statusLabel: null,
        translationMessage: null
      };
    }

    return {
      active: false,
      actionLabel: "Start live translation",
      statusLabel: "Paused",
      translationMessage: "Translation paused."
    };
  }

  function shouldStartAutomaticTranslation(enabled, hasTranslator, hasCue) {
    return Boolean(enabled && hasTranslator && hasCue);
  }

  const api = Object.freeze({
    getTranslationControlView,
    shouldStartAutomaticTranslation
  });
  root.YouTubeLanguageTranslationControl = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(globalThis);
