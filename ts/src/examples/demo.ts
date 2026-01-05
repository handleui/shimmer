// Run: npm run demo
import { newSpinner } from "../index.js";

async function main() {
  console.log();
  await newSpinner("Shimmering", "#00D787")
    .action(() => new Promise((resolve) => setTimeout(resolve, 5000)))
    .run();
  console.log();
}

main();
