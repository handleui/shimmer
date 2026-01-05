# Shimmer

Shimmering text for terminals. A wave of light sweeps across your text.

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

| Function | Description |
|----------|-------------|
| `run(text, color, opts?)` | Display shimmer until Ctrl+C |
| `runContext(signal, text, color, opts?)` | Display shimmer with AbortSignal |
| `create(text, color, opts?)` | Create shimmer Model |
| `newSpinner(text, color, opts?)` | Create spinner with action |

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `interval` | 50 | Animation speed in ms |
| `waveWidth` | 8 | Wave size in characters |
| `wavePause` | 8 | Pause between loops |
| `peakLight` | 90 | Brightness 0-100 |
| `direction` | Right | `Direction.Left` or `Direction.Right` |

## Demo

```bash
npm run demo
```
