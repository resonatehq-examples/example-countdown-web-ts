import { Resonate } from "@resonatehq/sdk";
import { countdown } from "./count";

const resonate = new Resonate({
  url: "http://localhost:8001",
});

resonate.register("countdown", countdown);

// UI event handlers
const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const countInput = document.getElementById("count") as HTMLInputElement;
const delayInput = document.getElementById("delay") as HTMLInputElement;
const statusDiv = document.getElementById("status") as HTMLDivElement;
const promiseIdDiv = document.getElementById("promiseId") as HTMLDivElement;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;

// Get promise ID from URL hash or generate new one
function getPromiseId(): string {
  const hash = window.location.hash.substring(1);
  return hash || `countdown-${Date.now()}`;
}

// Update URL hash with promise ID
function updateUrlHash(promiseId: string) {
  window.location.hash = promiseId;
  promiseIdDiv.textContent = promiseId;
  copyBtn.style.display = "inline-block";
}

// Copy URL to clipboard
copyBtn.addEventListener("click", () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  const originalText = copyBtn.textContent;
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = originalText;
  }, 2000);
});

// Check if we're resuming an existing countdown
async function resumeCountdown() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  // Request notification permission
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  promiseIdDiv.textContent = hash;
  copyBtn.style.display = "inline-block";
  startBtn.disabled = true;
  statusDiv.textContent = `Resuming countdown ${hash}...`;
  statusDiv.className = "status active";

  try {
    // Attach to existing promise - just need to get it to continue running
    await resonate.run(hash, countdown, 0, 0);
    statusDiv.textContent = "Countdown completed!";
  } catch (error) {
    statusDiv.textContent = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  } finally {
    startBtn.disabled = false;
  }
}

startBtn.addEventListener("click", async () => {
  const count = parseInt(countInput.value);
  const delay = parseInt(delayInput.value);

  if (!count || !delay || count < 1 || delay < 1) {
    statusDiv.textContent = "Please enter valid positive numbers";
    statusDiv.className = "status active";
    return;
  }

  // Request notification permission
  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      statusDiv.textContent =
        "Notifications permission denied. Please enable notifications to use this app.";
      statusDiv.className = "status active";
      return;
    }
  }

  const promiseId = getPromiseId();
  updateUrlHash(promiseId);

  // Disable button during countdown
  startBtn.disabled = true;
  statusDiv.textContent = `Starting countdown from ${count} with ${delay}s delay...`;
  statusDiv.className = "status active";

  try {
    await resonate.run(
      promiseId,
      countdown,
      count,
      delay,
    );
    statusDiv.textContent = "Countdown completed!";
  } catch (error) {
    statusDiv.textContent = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  } finally {
    startBtn.disabled = false;
  }
});

// Resume countdown on page load if hash is present
if (window.location.hash) {
  resumeCountdown();
}
