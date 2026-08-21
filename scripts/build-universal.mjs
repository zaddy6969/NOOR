import { spawnSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const command = isVercel
  ? [process.platform === "win32" ? "node_modules/.bin/next.cmd" : "node_modules/.bin/next", "build"]
  : ["bash", "scripts/build-verified.sh"];

const result = spawnSync(command[0], command.slice(1), {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
