import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics: traces the Tripwise Assistant's Anthropic calls. Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "295d4957-f0d4-4d78-8ba1-18af6f23200d",
  agentId: "lQxpt9vlJli6FLWsUUAE7R8tm-U",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Send the last buffered Pendo events before the process exits.
server.on("close", () => {
  void pendo.shutdown();
});

async function stop(): Promise<void> {
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => {
  void stop();
});
process.on("SIGTERM", () => {
  void stop();
});
