import chalk from "chalk";

export const DEFAULT_INTERVAL = 50;
export const DEFAULT_PEAK_LIGHT = 90;
export const DEFAULT_WAVE_WIDTH = 8;
export const DEFAULT_WAVE_PAUSE = 8;

export enum Direction {
  Right = 0,
  Left = 1,
}

export interface Options {
  interval?: number;
  peakLight?: number;
  waveWidth?: number;
  wavePause?: number;
  direction?: Direction;
}

export class Model {
  private text: string;
  private baseColor: string;
  private isLoading: boolean;
  private position: number;
  private waveColors: string[];
  private interval: number;
  private peakLight: number;
  private waveWidth: number;
  private wavePause: number;
  private direction: Direction;
  private timer: ReturnType<typeof setInterval> | null = null;
  private onTick: (() => void) | null = null;

  constructor(text: string, baseColor: string, opts: Options = {}) {
    this.text = text;
    this.baseColor = baseColor;
    this.isLoading = true;
    this.position = 0;
    this.interval = opts.interval ?? DEFAULT_INTERVAL;
    this.peakLight = Math.max(0, Math.min(100, opts.peakLight ?? DEFAULT_PEAK_LIGHT));
    this.waveWidth = Math.max(2, opts.waveWidth ?? DEFAULT_WAVE_WIDTH);
    this.wavePause = Math.max(0, opts.wavePause ?? DEFAULT_WAVE_PAUSE);
    this.direction = opts.direction ?? Direction.Right;
    this.waveColors = this.generateWaveColors();
  }

  setOnTick(callback: () => void): void {
    this.onTick = callback;
  }

  init(): void {
    if (this.isLoading && !this.timer) {
      this.timer = setInterval(() => this.tick(), this.interval);
    }
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setText(text: string): this {
    this.text = text;
    return this;
  }

  setLoading(loading: boolean): this {
    this.isLoading = loading;
    if (!loading) {
      this.stop();
    } else if (!this.timer) {
      this.init();
    }
    return this;
  }

  view(): string {
    if (!this.isLoading) {
      return chalk.hex(this.baseColor)(this.text);
    }

    const runes = [...this.text];
    let result = "";

    for (let i = 0; i < runes.length; i++) {
      const color = this.getCharacterColor(i, runes.length);
      result += chalk.hex(color)(runes[i]);
    }

    return result;
  }

  private tick(): void {
    if (!this.isLoading) return;
    const totalLength = [...this.text].length + this.waveColors.length + this.wavePause;
    this.position = (this.position + 1) % totalLength;
    if (this.onTick) {
      this.onTick();
    }
  }

  private getCharacterColor(index: number, textLen: number): string {
    let distance: number;

    if (this.direction === Direction.Left) {
      distance = this.position - (textLen - 1 - index);
    } else {
      distance = this.position - index;
    }

    if (distance >= 0 && distance < this.waveColors.length) {
      return this.waveColors[distance];
    }

    return this.baseColor;
  }

  private generateWaveColors(): string[] {
    const { r, g, b } = parseHexColor(this.baseColor);
    const steps = Math.max(this.waveWidth, 2);
    const colors: string[] = new Array(steps);
    const mid = Math.floor(steps / 2);

    for (let i = 0; i < steps; i++) {
      let ratio: number;
      if (i <= mid) {
        ratio = i / mid;
      } else {
        ratio = (steps - 1 - i) / (steps - 1 - mid);
      }

      const pct = Math.floor(ratio * this.peakLight);
      colors[i] = formatHexColor(lighten(r, pct), lighten(g, pct), lighten(b, pct));
    }

    return colors;
  }
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace(/^#/, "");
  if (hex.length !== 6) {
    return { r: 0, g: 215, b: 135 };
  }
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function formatHexColor(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0").toUpperCase()}${g.toString(16).padStart(2, "0").toUpperCase()}${b.toString(16).padStart(2, "0").toUpperCase()}`;
}

function lighten(value: number, percent: number): number {
  const result = value + ((255 - value) * percent) / 100;
  return Math.min(255, Math.floor(result));
}

export function create(text: string, baseColor: string, opts: Options = {}): Model {
  return new Model(text, baseColor, opts);
}

export { create as New };
