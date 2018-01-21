// @flow

const { EventEmitter } = require("events");
const { create } = require("log-update");
const { Step, STATE_CHANGED } = require("./Step");
import type { StateChangedEvent } from "./Step";

type Options = {
  stream: WritableStream,
  fps: number,
  autoStart: boolean
};
type OptionsOptional = {
  stream?: WritableStream,
  fps?: number,
  autoStart?: boolean
};
type WritableStream = {
  write(chunk: string): boolean
};

const defaultOptions: Options = {
  stream: process.stdout,
  fps: 12,
  autoStart: true
};

class Renderer extends EventEmitter {
  mspf: number;
  write: (text: string) => void;
  currentFrame: number;
  intervalId: number;
  children: Array<Step>;

  constructor(options?: OptionsOptional) {
    super();
    const opts: Options = {
      ...defaultOptions,
      ...options
    };
    this.mspf = 1000 / opts.fps;
    this.write = create(opts.stream);
    this.currentFrame = 0;
    this.children = [];
    if (opts.autoStart) {
      this.start();
    }
  }

  start() {
    if (this.rendering()) this.stop();
    this.intervalId = setInterval(() => this.onTick(), this.mspf);
  }

  stop() {
    clearInterval(this.intervalId);
    delete this.intervalId;
  }

  rendering() {
    return this.intervalId != null;
  }

  render() {
    const output = this.children
      .map(child => child.toString(this.currentFrame))
      .join("\n");
    this.write(output);
    this.emit("rendered", output);
    this.currentFrame++;
    return output;
  }

  add(child: Step) {
    this.children.push(child);
    child.on(STATE_CHANGED, e => this.onStateChanged(e));
  }

  onTick() {
    this.render();
    const shouldBeRendered = this.children.reduce(
      (s: boolean, child: Step): boolean => s || child.shouldBeRendered(),
      false
    );
    if (!shouldBeRendered) {
      this.stop();
    }
  }

  onStateChanged(e: StateChangedEvent) {
    if (e.complete || this.rendering()) return;
    this.start();
  }
}

module.exports = Renderer;
