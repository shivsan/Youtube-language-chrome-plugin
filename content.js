(() => {
  const { normalizeCueText, deduplicateLines, cleanYouTubeTitle } =
    globalThis.YouTubeLanguageUtils;

  const PRIMARY_SELECTOR = ".ytp-caption-segment";
  const FALLBACK_SELECTORS = [
    ".caption-visual-line",
    ".ytp-caption-window-container"
  ];

  let lastSentText = "";
  let scanTimer = null;

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  document.addEventListener("timeupdate", scheduleScan, true);
  document.addEventListener("play", scheduleScan, true);
  document.addEventListener("seeked", scheduleScan, true);
  scheduleScan();

  function scheduleScan() {
    if (scanTimer !== null) {
      return;
    }

    scanTimer = window.setTimeout(() => {
      scanTimer = null;
      captureVisibleCue();
    }, 80);
  }

  function captureVisibleCue() {
    if (!isSupportedLocation()) {
      lastSentText = "";
      return;
    }

    const text = findVisibleSubtitle();

    if (!text) {
      lastSentText = "";
      return;
    }

    if (text === lastSentText) {
      return;
    }
    lastSentText = text;

    const video = document.querySelector("video");
    const cue = {
      id: crypto.randomUUID(),
      text,
      title: findTitle(),
      playbackSeconds: Number.isFinite(video?.currentTime)
        ? Math.round(video.currentTime * 10) / 10
        : null,
      capturedAt: Date.now()
    };

    chrome.runtime.sendMessage({ type: "SUBTITLE_CUE", cue }).catch(() => {
      // The extension may have been reloaded while the YouTube tab stayed open.
    });
  }

  function findVisibleSubtitle() {
    const primaryNodes = [...document.querySelectorAll(PRIMARY_SELECTOR)].filter(isVisible);
    if (primaryNodes.length > 0) {
      return deduplicateLines(primaryNodes.map(readNodeText)).join("\n");
    }

    for (const selector of FALLBACK_SELECTORS) {
      const nodes = [...document.querySelectorAll(selector)].filter(
        (node) => isVisible(node) && !node.querySelector(selector)
      );
      const text = deduplicateLines(nodes.map(readNodeText)).join("\n");
      if (text) {
        return text;
      }
    }

    return "";
  }

  function readNodeText(node) {
    return normalizeCueText(node.innerText || node.textContent || "");
  }

  function isVisible(node) {
    if (!(node instanceof HTMLElement) || node.getClientRects().length === 0) {
      return false;
    }

    const style = getComputedStyle(node);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number.parseFloat(style.opacity || "1") > 0 &&
      node.getAttribute("aria-hidden") !== "true"
    );
  }

  function findTitle() {
    const titleSelectors = [
      "h1.ytd-watch-metadata yt-formatted-string",
      "#title h1 yt-formatted-string",
      "h2.ytd-reel-player-header-renderer",
      "#overlay h2"
    ];
    const playerTitle = titleSelectors
      .map((selector) => document.querySelector(selector))
      .find((node) => normalizeCueText(node?.textContent || ""));
    return cleanYouTubeTitle(playerTitle?.textContent || document.title || "YouTube");
  }

  function isSupportedLocation() {
    return location.pathname === "/watch" || location.pathname.startsWith("/shorts/");
  }
})();
