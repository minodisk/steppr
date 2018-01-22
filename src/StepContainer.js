// @flow

const chalk = require("chalk");
const { dots } = require("cli-spinners");
const symbols = require("log-symbols");
const Step = require("./Step");
import type {
  OptionalStyles,
  Styles,
  CompiledStyles,
  SignStyle,
  SpinnerStyle
} from "./types";

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
const compileSign = (sign: SignStyle): string => sign.color(sign.sign);
const compileSpinner = (spinner: SpinnerStyle): Array<string> =>
  spinner.frames.map((frame: string): string => spinner.color(frame));

class StepContainer {
  styles: CompiledStyles;
  children: Array<Step>;

  constructor(styles?: OptionalStyles) {
    const {
      indent,
      title,
      log,
      pending,
      running,
      info,
      warn,
      error,
      success,
      skipped
    }: Styles = {
      ...defaultStyles,
      ...styles
    };
    this.styles = {
      indent,
      title,
      log,
      pending: compileSpinner(pending),
      running: compileSpinner(running),
      info: compileSign(info),
      warn: compileSign(warn),
      error: compileSign(error),
      success: compileSign(success),
      skipped: compileSign(skipped)
    };
    this.children = [];
  }

  toString(currentFrame: number): string {
    return this.children.map(child => child.toString(currentFrame)).join("\n");
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

module.exports = StepContainer;
