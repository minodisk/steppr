// @flow

const { EventEmitter } = require("events");
const chalk = require("chalk");
const { dots } = require("cli-spinners");

type State =
  | "pending"
  | "running"
  | "info"
  | "warn"
  | "error"
  | "success"
  | "skipped";

type Sign = {
  color: Color,
  sign: string
};

type Spinner = {
  color: Color,
  frames: Array<string>
};

type Color = (text: string) => string;

type Style = {
  indent: string,
  message: Sign,
  log: Sign,
  pending: Spinner,
  running: Spinner,
  info: Sign,
  warn: Sign,
  error: Sign,
  success: Sign,
  skipped: Sign
};
type StyleOptional = {
  indent?: string,
  message?: Sign,
  log?: Sign,
  pending?: Spinner,
  running?: Spinner,
  info?: Sign,
  warn?: Sign,
  error?: Sign,
  success?: Sign,
  skipped?: Sign
};

const noop = (text: string) => text;
const defaultStyle: Style = {
  indent: " ",
  message: { color: noop, sign: " " },
  log: {
    color: chalk.gray,
    sign: " -> "
  },
  pending: {
    color: chalk.gray,
    frames: dots.frames
  },
  running: {
    color: chalk.cyan,
    frames: dots.frames
  },
  info: {
    color: chalk.blue,
    sign: "i"
  },
  warn: {
    color: chalk.yellow,
    sign: "⚠"
  },
  error: {
    color: chalk.red,
    sign: "✖"
  },
  success: {
    color: chalk.green,
    sign: "✓"
  },
  skipped: {
    color: chalk.gray,
    sign: "↓"
  }
};

export type StateChangedEvent = {
  type: string,
  target: Step,
  state: State,
  shouldBeRendered: boolean
};

const STATE_CHANGED = "STATE_CHANGED";

class Step extends EventEmitter {
  style: Style;
  indent: string;
  message: string;
  logMessage: string;
  state: State;
  children: Array<Step>;

  constructor(title: string = "", style?: StyleOptional) {
    super();
    this.style = {
      ...defaultStyle,
      ...style
    };
    this.indent = "";
    this.logMessage = "";
    this.state = "pending";
    this.children = [];
    this.update(title);
  }

  start(message?: string) {
    this.state = "running";
    this.update(message);
    this.emitStateChanged();
  }

  emitStateChanged() {
    this.emit(STATE_CHANGED, {
      type: STATE_CHANGED,
      target: this,
      state: this.state,
      shouldBeRendered: this.shouldBeRendered()
    });
  }

  bubbleUp(e: Event) {
    this.emit(e.type, e);
  }

  update(message?: string) {
    if (message == null) {
      return;
    }
    this.message = this.style.message.color(this.style.message.sign + message);
  }

  toString(currentFrame: number = 0): string {
    return [
      this.line(currentFrame),
      ...this.children.map(child => child.toString(currentFrame))
    ].join("\n");
  }

  line(currentFrame: number) {
    return `${this.indent}${this.prefix(currentFrame)}${this.message}${
      this.logMessage
    }`;
  }

  shouldBeRendered(): boolean {
    const should = this.state !== "pending" && this.state !== "running";
    return this.children.reduce(
      (s: boolean, child: Step) => s || child.shouldBeRendered(),
      should
    );
  }

  add(child: Step) {
    child.indent = this.indent + this.style.indent;
    this.children.push(child);
    child.on(STATE_CHANGED, e => this.bubbleUp(e));
  }

  spawn(title: string): Step {
    const child = new Step(title, { ...this.style });
    this.add(child);
    return child;
  }

  prefix(currentFrame: number) {
    switch (this.state) {
      default:
        return "";
      case "pending":
        return this.style.pending.color(
          this.style.pending.frames[
            currentFrame % this.style.pending.frames.length
          ]
        );
      case "running":
        return this.style.running.color(
          this.style.running.frames[
            currentFrame % this.style.running.frames.length
          ]
        );
      case "info":
        return this.style.info.color(this.style.info.sign);
      case "warn":
        return this.style.warn.color(this.style.warn.sign);
      case "error":
        return this.style.error.color(this.style.error.sign);
      case "success":
        return this.style.success.color(this.style.success.sign);
      case "skipped":
        return this.style.skipped.color(this.style.skipped.sign);
    }
  }

  log(...messages: Array<string>) {
    const message = messages.join(" ");
    if (message === "") {
      this.logMessage = "";
      return;
    }
    this.logMessage = this.style.log.color(`${this.style.log.sign}${message}`);
  }

  info(message?: string) {
    this.update(message);
    this.state = "info";
    this.log();
    this.emitStateChanged();
  }

  warn(message?: string) {
    this.update(message);
    this.state = "warn";
    this.log();
    this.emitStateChanged();
  }

  error(message?: string) {
    this.update(message);
    this.state = "error";
    this.log();
    this.emitStateChanged();
  }

  success(message?: string) {
    this.update(message);
    this.state = "success";
    this.log();
    this.emitStateChanged();
  }

  skip(message?: string) {
    this.update(message);
    this.state = "skipped";
    this.log();
    this.emitStateChanged();
  }
}

module.exports = { Step, STATE_CHANGED };
