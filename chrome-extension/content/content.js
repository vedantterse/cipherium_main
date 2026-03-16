// Cipherium Extension - Content Script
// Reads screenshot from extension storage and passes it to the dashboard

// Check if we're on the dashboard with extension source
if (window.location.search.includes("source=extension")) {
  let attempts = 0;

  function tryReadScreenshot() {
    chrome.storage.session.get("screenshotData", (result) => {
      if (result.screenshotData) {
        // Post message to the page
        window.postMessage(
          { type: "cipherium-screenshot", imageDataUrl: result.screenshotData },
          "*"
        );
        // Clear the stored screenshot
        chrome.storage.session.remove("screenshotData");
        console.log("[Cipherium] Screenshot data sent to dashboard");
      } else if (attempts < 10) {
        attempts++;
        setTimeout(tryReadScreenshot, 200);
      }
    });
  }

  // Wait a bit for the page to be ready
  setTimeout(tryReadScreenshot, 300);
}
