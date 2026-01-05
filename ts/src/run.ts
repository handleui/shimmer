import { Model, Options, create } from "./shimmer.js";

export async function run(text: string, color: string, opts: Options = {}): Promise<void> {
  return runContext(undefined, text, color, opts);
}

export async function runContext(
  signal: AbortSignal | undefined,
  text: string,
  color: string,
  opts: Options = {}
): Promise<void> {
  const model = create(text, color, opts);

  return new Promise<void>((resolve) => {
    const cleanup = () => {
      model.stop();
      process.stdout.write("\n");
      resolve();
    };

    const handleSigint = () => cleanup();
    process.on("SIGINT", handleSigint);

    if (signal) {
      signal.addEventListener("abort", cleanup, { once: true });
    }

    const render = () => {
      process.stdout.write(`\r${model.view()}`);
    };

    model.setOnTick(render);
    model.init();
    render();
  });
}

export class Spinner {
  private text: string;
  private color: string;
  private opts: Options;
  private actionFn: (() => void | Promise<void>) | null = null;
  private signal: AbortSignal | undefined;

  constructor(text: string, color: string, opts: Options = {}) {
    this.text = text;
    this.color = color;
    this.opts = opts;
  }

  action(fn: () => void | Promise<void>): this {
    this.actionFn = fn;
    return this;
  }

  context(signal: AbortSignal): this {
    this.signal = signal;
    return this;
  }

  async run(): Promise<void> {
    if (!this.actionFn) {
      return runContext(this.signal, this.text, this.color, this.opts);
    }

    const model = create(this.text, this.color, this.opts);

    return new Promise<void>((resolve) => {
      let completed = false;

      const cleanup = () => {
        if (completed) return;
        completed = true;
        model.stop();
        process.stdout.write("\n");
        resolve();
      };

      const handleSigint = () => cleanup();
      process.on("SIGINT", handleSigint);

      if (this.signal) {
        this.signal.addEventListener("abort", cleanup, { once: true });
      }

      const render = () => {
        process.stdout.write(`\r${model.view()}`);
      };

      model.setOnTick(render);
      model.init();
      render();

      const actionResult = this.actionFn!();
      if (actionResult instanceof Promise) {
        actionResult.finally(() => {
          process.removeListener("SIGINT", handleSigint);
          cleanup();
        });
      } else {
        process.removeListener("SIGINT", handleSigint);
        cleanup();
      }
    });
  }
}

export function newSpinner(text: string, color: string, opts: Options = {}): Spinner {
  return new Spinner(text, color, opts);
}

export { newSpinner as NewSpinner };
