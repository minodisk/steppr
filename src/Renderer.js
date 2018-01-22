// @flow

const { EventEmitter } = require("events");
const { create } = require("log-update");
const StepContainer = require("./StepContainer");
import type { Options, OptionalOptions } from "./types";

const defaultOptions: Options = {
  stream: process.stdout,
  fps: 12,
  autoStart: true,
  autoStop: true
};

class Renderer extends EventEmitter {
  options: Options;
  write: (text: string) => void;
  currentFrame: number;
  intervalId: number;
  container: StepContainer;

  constructor(options?: OptionalOptions) {
    super();
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.write = create(this.options.stream);
    this.currentFrame = 0;
    if (this.options.autoStart) {
      this.start();
    }
  }

  setContainer(container: StepContainer) {
    this.container = container;
  }

  start() {
    if (this.running()) this.stop();
    this.intervalId = setInterval(() => this.onTick(), 1000 / this.options.fps);
  }

  stop() {
    clearInterval(this.intervalId);
    delete this.intervalId;
  }

  running(): boolean {
    return this.intervalId != null;
  }

  render(): string {
    const output = this.container.toString(this.currentFrame);
    this.write(output);
    this.emit("rendered", output);
    this.currentFrame++;
    return output;
  }

  onTick() {
    this.render();
    if (
      this.options.autoStop &&
      this.running() &&
      !this.container.shouldBeRendered()
    ) {
      this.stop();
    }
  }
}

module.exports = Renderer;
