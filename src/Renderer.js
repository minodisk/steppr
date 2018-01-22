// @flow

const { EventEmitter } = require("events");
const { create } = require("log-update");
const { RootStep, Step } = require("./Step");

type Options = {
  stream: WritableStream,
  fps: number,
  autoStart: boolean
};
type OptionalOptions = {
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
  autoStart: true,
  autoStop: true
};

class Renderer extends EventEmitter {
  options: Options;
  write: (text: string) => void;
  currentFrame: number;
  intervalId: number;
  root: RootStep;

  constructor(options?: OptionalOptions) {
    super();
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.write = create(this.options.stream);
    this.currentFrame = 0;
    this.root = new RootStep();
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

  running() {
    return this.intervalId != null;
  }

  render() {
    const output = this.root.toString(this.currentFrame);
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
      !this.root.shouldBeRendered()
    ) {
      this.stop();
    }
  }
}

module.exports = Renderer;
