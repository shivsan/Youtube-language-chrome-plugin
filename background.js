const MAX_CUES = 60;
const MAX_TEXT_LENGTH = 1_000;
const MAX_TITLE_LENGTH = 200;
const MAX_ID_LENGTH = 100;

void restrictStorageAccess();

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  void restrictStorageAccess();
});

chrome.runtime.onStartup.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  void restrictStorageAccess();
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (
    message?.type === "SUBTITLE_CUE" &&
    isTrustedYouTubeSender(sender) &&
    isValidCue(message.cue)
  ) {
    void storeCue(message.cue);
  }
});

async function restrictStorageAccess() {
  await Promise.all([
    chrome.storage.local.setAccessLevel({ accessLevel: "TRUSTED_CONTEXTS" }),
    chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_CONTEXTS" })
  ]);
}

function isTrustedYouTubeSender(sender) {
  if (sender?.id !== chrome.runtime.id || !sender.tab?.url) {
    return false;
  }

  try {
    const url = new URL(sender.tab.url);
    return (
      url.protocol === "https:" &&
      url.hostname === "www.youtube.com" &&
      (url.pathname === "/watch" || url.pathname.startsWith("/shorts/"))
    );
  } catch {
    return false;
  }
}

function isValidCue(cue) {
  return (
    cue &&
    typeof cue.id === "string" &&
    cue.id.length > 0 &&
    cue.id.length <= MAX_ID_LENGTH &&
    typeof cue.text === "string" &&
    cue.text.length > 0 &&
    cue.text.length <= MAX_TEXT_LENGTH &&
    typeof cue.title === "string" &&
    cue.title.length <= MAX_TITLE_LENGTH &&
    (cue.playbackSeconds === null ||
      (Number.isFinite(cue.playbackSeconds) && cue.playbackSeconds >= 0)) &&
    Number.isFinite(cue.capturedAt) &&
    cue.capturedAt > 0
  );
}

async function storeCue(cue) {
  const { cueHistory = [] } = await chrome.storage.session.get("cueHistory");
  const previous = cueHistory.at(-1);

  if (previous?.text === cue.text && previous?.title === cue.title) {
    return;
  }

  const nextHistory = [...cueHistory, cue].slice(-MAX_CUES);
  await chrome.storage.session.set({ cueHistory: nextHistory, latestCue: cue });
}
