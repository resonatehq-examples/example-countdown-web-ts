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

  // Disable button during countdown
  startBtn.disabled = true;
  statusDiv.textContent = `Starting countdown from ${count} with ${delay}s delay...`;
  statusDiv.className = "status active";

  try {
    await resonate.run(
      `countdown-${Date.now()}`,
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
