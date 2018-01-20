// @flow

const { EventEmitter } = require("events");
const { create } = require("log-update");
const Step = require("./Step");

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
    this.stop();
    this.currentFrame = 0;
    this.intervalId = setInterval(() => this.render(), this.mspf);
  }

  stop() {
    if (!this.intervalId == null) return;
    clearInterval(this.intervalId);
    delete this.intervalId;
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
  }
}

module.exports = Renderer;
