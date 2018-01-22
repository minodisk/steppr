// @flow

const chalk = require("chalk");
const { dots } = require("cli-spinners");

type Color = (text: string) => string;

type Sign = {
  color: Color,
  sign: string
};
type Spinner = {
  color: Color,
  frames: Array<string>
};

type Styles = {
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
type OptionalStyles = {
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

type State =
  | "pending"
  | "running"
  | "info"
  | "warn"
  | "error"
  | "success"
  | "skipped";

const noop = (text: string) => text;
const defaultStyles: Styles = {
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

const repeat = (text: string, length: number) => {
  let t = "";
  for (let i = 0; i < length; i++) {
    t += text;
  }
  return t;
};

class RootStep {
  styles: Styles;
  children: Array<Step>;

  constructor(styles?: OptionalStyles) {
    this.styles = {
      ...defaultStyles,
      ...styles
    };
    this.children = [];
  }

  toString(currentFrame: number): string {
    return this.childrenLines(currentFrame).join("\n");
  }

  childrenLines(currentFrame: number): Array<string> {
    return this.children.map(child => child.toString(currentFrame));
  }

  add(child: Step) {
    this.children.push(child);
  }

  spawn(title: string): Step {
    const child = new Step(title, { ...this.styles });
    this.add(child);
    return child;
  }

  shouldBeRendered(): boolean {
    for (const child of this.children) {
      if (child.shouldBeRendered()) {
        return true;
      }
    }
    return false;
  }
}

class Step extends RootStep {
  depth: number;
  message: string;
  logMessage: string;
  state: State;

  constructor(title: string = "", styles?: OptionalStyles) {
    super(styles);
    this.depth = 0;
    this.logMessage = "";
    this.state = "pending";
    this.update(title);
  }

  start(message?: string) {
    this.state = "running";
    this.update(message);
  }

  update(message?: string) {
    if (message == null) {
      return;
    }
    this.message = this.styles.message.color(
      this.styles.message.sign + message
    );
  }

  toString(currentFrame: number): string {
    return [this.line(currentFrame), ...this.childrenLines(currentFrame)].join(
      "\n"
    );
  }

  line(currentFrame: number) {
    return `${this.prefix()}${this.sign(currentFrame)}${this.message}${
      this.logMessage
    }`;
  }

  shouldBeRendered(): boolean {
    if (this.state === "pending" || this.state === "running") return true;
    return super.shouldBeRendered();
  }

  add(child: Step) {
    child.depth = this.depth + 1;
    super.add(child);
  }

  prefix(): string {
    return repeat(this.styles.indent, this.depth);
  }

  sign(currentFrame: number) {
    switch (this.state) {
      default:
        return "";
      case "pending":
        return this.styles.pending.color(
          this.styles.pending.frames[
            currentFrame % this.styles.pending.frames.length
          ]
        );
      case "running":
        return this.styles.running.color(
          this.styles.running.frames[
            currentFrame % this.styles.running.frames.length
          ]
        );
      case "info":
        return this.styles.info.color(this.styles.info.sign);
      case "warn":
        return this.styles.warn.color(this.styles.warn.sign);
      case "error":
        return this.styles.error.color(this.styles.error.sign);
      case "success":
        return this.styles.success.color(this.styles.success.sign);
      case "skipped":
        return this.styles.skipped.color(this.styles.skipped.sign);
    }
  }

  log(...messages: Array<string>) {
    const message = messages.join(" ");
    if (message === "") {
      this.logMessage = "";
      return;
    }
    this.logMessage = this.styles.log.color(
      `${this.styles.log.sign}${message}`
    );
  }

  info(message?: string) {
    this.update(message);
    this.state = "info";
    this.log();
  }

  warn(message?: string) {
    this.update(message);
    this.state = "warn";
    this.log();
  }

  error(message?: string) {
    this.update(message);
    this.state = "error";
    this.log();
  }

  success(message?: string) {
    this.update(message);
    this.state = "success";
    this.log();
  }

  skip(message?: string) {
    this.update(message);
    this.state = "skipped";
    this.log();
  }
}

module.exports = { RootStep, Step };
