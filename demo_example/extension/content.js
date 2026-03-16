if (window.location.search.includes("source=extension")) {
  let attempts = 0;

  function tryReadScreenshot() {
    chrome.storage.session.get("screenshotData", (result) => {
      if (result.screenshotData) {
        window.postMessage(
          { type: "cipherium-screenshot", imageDataUrl: result.screenshotData },
          "*"
        );
        chrome.storage.session.remove("screenshotData");
      } else if (attempts < 10) {
        attempts++;
        setTimeout(tryReadScreenshot, 200);
      }
    });
  }

  tryReadScreenshot();
}
