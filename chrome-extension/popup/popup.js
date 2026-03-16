// Cipherium Extension - Popup Script
const DASHBOARD_URL = "http://localhost:3000/dashboard/analyze?source=extension";

const captureBtn = document.getElementById("captureBtn");
const dashboardBtn = document.getElementById("dashboardBtn");
const status = document.getElementById("status");

// Capture screenshot and open dashboard
captureBtn.addEventListener("click", async () => {
  captureBtn.disabled = true;
  status.textContent = "Capturing screenshot...";
  status.className = "status";

  try {
    // Capture visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });

    status.textContent = "Opening dashboard...";

    // Store screenshot in session storage
    await chrome.storage.session.setAccessLevel({
      accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"
    });
    await chrome.storage.session.set({ screenshotData: dataUrl });

    // Open dashboard
    chrome.tabs.create({ url: DASHBOARD_URL });

    status.textContent = "Screenshot sent!";
    status.className = "status success";

    // Close popup after a short delay
    setTimeout(() => window.close(), 500);
  } catch (err) {
    status.textContent = "Error: " + err.message;
    status.className = "status error";
    captureBtn.disabled = false;
  }
});

// Open dashboard
dashboardBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
  window.close();
});
