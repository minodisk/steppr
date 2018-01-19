// @flow

const { EventEmitter } = require("events");
const render = require("log-update");
const { dots } = require("cli-spinners");

type Spinner = {
  interval: number,
  frames: Array<string>
};

class Stepr {
  constructor(spinner: Spinner = dots) {
    this.spinner = spinner;
    this.indent = "";
    this.currentFrame = 0;
    this.subs = [];
  }

  start(message: string = "") {
    this.stop();
    this.currentFrame = 0;
    this.intervalId = setInterval(
      () => render(this.render(message)),
      this.spinner.interval
    );
  }

  update(message: string = "") {
    this.message = "";
  }

  stop() {
    if (!this.running()) return;
    clearInterval(this.intervalId);
    delete this.intervalId;
  }

  running() {
    return this.intervalId != null;
  }

  render(message: string) {
    const frame = this.spinner.frames[
      this.currentFrame % this.spinner.frames.length
    ];
    this.currentFrame++;
    return [
      `${this.indent}${frame} ${message}`,
      ...this.subs.map(sub => sub.render())
    ].join("\n");
  }

  sub() {
    const sub = new SubStepr(this.spinner);
    sub.indent = this.indent + "  ";
    this.subs.push(sub);
    return sub;
  }
}

class SubStepr {
  constructor(spinner: Spinner = dots) {
    this.spinner = spinner;
    this.indent = "";
    this.currentFrame = 0;
  }

  start(message: string = "") {
    this.message = message;
    this._running = true;
  }

  update(message: string) {
    this.message = message;
  }

  stop() {
    this._running = false;
  }

  running() {
    return this._running;
  }

  render() {
    const frame = this.spinner.frames[
      this.currentFrame % this.spinner.frames.length
    ];
    this.currentFrame++;
    return `${this.indent}${frame} ${this.message}`;
  }
}

const stepr = new Stepr();
stepr.start("foooo");
const sub = stepr.sub();
sub.start("bar");
