import type { Context } from "@resonatehq/sdk";

export function* countdown(
  ctx: Context,
  count: number,
  delay: number,
) {
  for (let i = count; i > 0; i--) {
    // send browser notification
    yield* ctx.run(notify, `Countdown: ${i}`);
    // sleep
    yield* ctx.sleep(delay * 1000);
  }
  // send the last notification
  yield* ctx.run(notify, `Done`);
}

async function notify(_ctx: Context, msg: string) {
  // Request permission if not already granted
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  // Show notification if permission granted
  if (Notification.permission === "granted") {
    new Notification("Countdown Timer", {
      body: msg,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>⏰</text></svg>",
    });
  } else {
    // Fallback to console if notifications not allowed
    console.log(`Notification: ${msg}`);
  }
}
