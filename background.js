const MAX_TEXT_LENGTH = 1_000;
const MAX_TITLE_LENGTH = 200;
const MAX_ID_LENGTH = 100;

let storageWriteQueue = Promise.resolve();

void restrictStorageAccess();

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  void restrictStorageAccess();
});

chrome.runtime.onStartup.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  void restrictStorageAccess();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message?.type === "SUBTITLE_CUE" &&
    isTrustedYouTubeSender(sender) &&
    isValidCue(message.cue)
  ) {
    const pendingWrite = storageWriteQueue.then(() => storeCue(message.cue));
    storageWriteQueue = pendingWrite.catch(() => undefined);
    pendingWrite.then(
      () => sendResponse({ stored: true }),
      () => sendResponse({ stored: false })
    );
    return true;
  }

  return false;
});

async function restrictStorageAccess() {
  await Promise.all([
    chrome.storage.local.setAccessLevel({ accessLevel: "TRUSTED_CONTEXTS" }),
    chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_CONTEXTS" }),
    chrome.storage.session.remove("cueHistory")
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
    (cue.videoKey === undefined ||
      (typeof cue.videoKey === "string" && cue.videoKey.length <= MAX_ID_LENGTH)) &&
    (cue.playbackSeconds === null ||
      (Number.isFinite(cue.playbackSeconds) && cue.playbackSeconds >= 0)) &&
    Number.isFinite(cue.capturedAt) &&
    cue.capturedAt > 0
  );
}

async function storeCue(cue) {
  await chrome.storage.session.set({ latestCue: cue });
}
