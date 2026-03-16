const DASHBOARD_URL = "http://localhost:3000/dashboard?source=extension";

const captureBtn = document.getElementById("captureBtn");
const status = document.getElementById("status");

captureBtn.addEventListener("click", async () => {
  captureBtn.disabled = true;
  status.textContent = "Capturing screenshot...";

  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });

    status.textContent = "Opening dashboard...";
    await chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });
    await chrome.storage.session.set({ screenshotData: dataUrl });

    chrome.tabs.create({ url: DASHBOARD_URL });
    window.close();
  } catch (err) {
    status.textContent = "Error: " + err.message;
    captureBtn.disabled = false;
  }
});
