// @flow

const chalk = require("chalk");
const { dots } = require("cli-spinners");
const symbols = require("log-symbols");
const Step = require("./Step");
const { compileStyles } = require("./utils");
import type { OptionalStyles, Styles, CompiledStyles } from "./types";

const noop = (text: string) => text;
const defaultStyles: Styles = {
  indent: "  ",
  title: { color: noop, sign: " " },
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
    sign: symbols.info
  },
  warn: {
    color: chalk.yellow,
    sign: symbols.warning
  },
  error: {
    color: chalk.red,
    sign: symbols.error
  },
  success: {
    color: chalk.green,
    sign: symbols.success
  },
  skipped: {
    color: chalk.gray,
    sign: "↓"
  }
};

class StepContainer {
  styles: CompiledStyles;
  children: Array<Step>;

  constructor(styles?: OptionalStyles) {
    this.styles = compileStyles({
      ...defaultStyles,
      ...styles
    });
    this.children = [];
  }

  toString(currentFrame: number): string {
    return this.children.map(child => child.toString(currentFrame)).join("\n");
  }

  add(child: Step) {
    this.children.push(child);
  }

  spawn(title: string = ""): Step {
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

module.exports = StepContainer;
