// Runs on the Erasa landing page. Bridges the page's "Delete my data" button to
// the extension's background automation. The page never sees your stored data;
// it only hands the profile you typed to the extension to run locally.
(function () {
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data || e.data.__erasa !== "start") return;
    const profile = e.data.profile || {};
    if (typeof profile.autosubmit !== "boolean") profile.autosubmit = true;
    chrome.storage.local.set({ erasa_profile: profile });
    chrome.runtime.sendMessage({ type: "erasa-start", items: self.ERASA_BROKERS, profile });
    window.postMessage({ __erasa: "started", count: self.ERASA_BROKERS.length }, "*");
  });
  // Announce that the helper is installed so the page shows the automatic flow.
  window.postMessage({ __erasa: "ready", count: self.ERASA_BROKERS.length }, "*");
})();
