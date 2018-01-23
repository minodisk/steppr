// @flow

const { EventEmitter } = require("events");
const { create } = require("log-update");
import type { Renderable, Options, OptionalOptions } from "./types";

const defaultOptions: Options = {
  stream: process.stdout,
  fps: 12,
  autoStart: true,
  autoStop: true
};

class Renderer extends EventEmitter {
  container: Renderable;
  options: Options;
  write: (text: string) => void;
  currentFrame: number;
  intervalId: number;

  constructor(container: Renderable, options?: OptionalOptions) {
    super();
    this.container = container;
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

  render() {
    const output = this.container.toString(this.currentFrame);
    this.write(output);
    this.emit("rendered", output);
    this.currentFrame++;
  }

  onTick() {
    this.emit("tick");
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
