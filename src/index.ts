import { Resonate } from "@resonatehq/sdk";
import { countdown } from "./count";

const resonate = new Resonate({
  url: "http://localhost:8001",
});

resonate.register("countdown", countdown);

// Request notification permission on load
if (Notification.permission === "default") {
  Notification.requestPermission();
}
