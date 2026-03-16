// Cipherium Extension - Content Script
// Reads screenshot from extension storage and passes it to the dashboard

if (window.location.search.includes("source=extension")) {
  let messageAcknowledged = false;
  let postAttempts = 0;
  const MAX_POST_ATTEMPTS = 20;

  // Listen for acknowledgment from the page
  window.addEventListener("message", function (event) {
    if (event.data?.type === "cipherium-ack") {
      messageAcknowledged = true;
      chrome.storage.session.remove("screenshotData");
      console.log("[Cipherium] Screenshot acknowledged by dashboard.");
    }
  });

  function postScreenshot(dataUrl) {
    if (messageAcknowledged || postAttempts >= MAX_POST_ATTEMPTS) return;
    postAttempts++;
    window.postMessage({ type: "cipherium-screenshot", imageDataUrl: dataUrl }, "*");
    // Retry every 200ms until acknowledged
    setTimeout(() => postScreenshot(dataUrl), 200);
  }

  function tryReadScreenshot() {
    chrome.storage.session.get("screenshotData", function (result) {
      if (result.screenshotData) {
        postScreenshot(result.screenshotData);
      } else if (postAttempts === 0) {
        // Data not in storage yet, retry reading
        setTimeout(tryReadScreenshot, 100);
      }
    });
  }

  // Start reading immediately
  tryReadScreenshot();
}
