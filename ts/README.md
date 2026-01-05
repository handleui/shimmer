# Shimmer for TypeScript

Shimmering text for terminals.

## Install

```bash
npm install @handleui/shimmer
```

## Usage

```ts
import { run } from "@handleui/shimmer";
run("Loading", "#00D787");
```

### With background task

```ts
import { newSpinner } from "@handleui/shimmer";
await newSpinner("Installing", "#00D787")
  .action(async () => { await exec("npm install"); })
  .run();
```

### With abort signal

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);
await runContext(controller.signal, "Loading", "#00D787");
```

## API

### Functions

| Function | Description |
|----------|-------------|
| `run(text, color, opts?)` | Display shimmer until Ctrl+C |
| `runContext(signal, text, color, opts?)` | Display shimmer with AbortSignal |
| `create(text, color, opts?)` | Create Model instance |
| `newSpinner(text, color, opts?)` | Create spinner with action |

### Options

```ts
interface Options {
  interval?: number;   // Animation speed in ms (default: 50)
  waveWidth?: number;  // Wave size in characters (default: 8)
  wavePause?: number;  // Pause between loops (default: 8)
  peakLight?: number;  // Brightness 0-100 (default: 90)
  direction?: Direction; // Direction.Left or Direction.Right
}
```

### Model

```ts
const model = create("Loading", "#00D787");
model.init();              // start animation
model.stop();              // stop animation
model.view();              // render current frame
model.setText("Done");     // change text
model.setLoading(false);   // stop and render static
model.setOnTick(() => {}); // callback on each frame
```

### Spinner

```ts
newSpinner("Loading", "#00D787")
  .action(async () => { /* work */ })  // runs while animating
  .context(signal)                      // optional AbortSignal
  .run();                               // starts animation
```

## Demo

```bash
npm run demo
```
