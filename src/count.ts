import type { Context } from "@resonatehq/sdk";

export function* countdown(ctx: Context, count: number, delay: number) {
  for (let i = count; i > 0; i--) {
    // send browser notification
    yield* ctx.run(notify, `Countdown: ${i}`);
    // sleep (delay is in minutes)
    yield* ctx.sleep(delay * 60 * 1000);
  }
  // send the last notification
  yield* ctx.run(notify, `Done`);
}

async function notify(_ctx: Context, msg: string) {
  if (Notification.permission === "granted") {
    new Notification("Countdown Timer", {
      body: msg,
      icon: "/echo.png",
    });
  } else {
    console.log(`Notification: ${msg}`);
  }
}
