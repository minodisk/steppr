// @flow

import type { State, CompiledStyles } from "./types";

class Step {
  title: string;
  styles: CompiledStyles;
  children: Array<Step>;
  depth: number;
  logMessage: string;
  state: State;

  constructor(title: string, styles: CompiledStyles) {
    this.styles = styles;
    this.children = [];
    this.depth = 0;
    this.logMessage = "";
    this.state = "pending";
    this.setTitle(title);
  }

  toString(currentFrame: number): string {
    return [
      this.line(currentFrame),
      ...this.children.map(child => child.toString(currentFrame))
    ].join("\n");
  }

  line(currentFrame: number) {
    return `${this.indent()}${this.sign(currentFrame)}${this.title}${
      this.logMessage
    }`;
  }

  indent(): string {
    let indent = "";
    for (let i = 0; i < this.depth; i++) {
      if (i === 0) {
        indent += " ";
        continue;
      }
      indent += "  ";
    }
    return indent;
  }

  sign(currentFrame: number) {
    switch (this.state) {
      default:
        return "";
      case "pending":
        return this.styles.pending[currentFrame % this.styles.pending.length];
      case "running":
        return this.styles.running[currentFrame % this.styles.running.length];
      case "info":
        return this.styles.info;
      case "warn":
        return this.styles.warn;
      case "error":
        return this.styles.error;
      case "success":
        return this.styles.success;
      case "skipped":
        return this.styles.skipped;
    }
  }

  setDepth(depth: number) {
    this.depth = depth;
  }

  add(child: Step) {
    child.setDepth(this.depth + 1);
    this.children.push(child);
  }

  spawn(title: string): Step {
    const child = new Step(title, { ...this.styles });
    this.add(child);
    return child;
  }

  shouldBeRendered(): boolean {
    if (this.state === "pending" || this.state === "running") return true;
    for (const child of this.children) {
      if (child.shouldBeRendered()) {
        return true;
      }
    }
    return false;
  }

  setTitle(title: string) {
    this.title = this.styles.title.color(this.styles.title.sign + title);
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

  start(message?: string = "") {
    this.state = "running";
    this.log(message);
  }

  info(message: string = "") {
    this.state = "info";
    this.log(message);
  }

  warn(message: string = "") {
    this.state = "warn";
    this.log(message);
  }

  error(message: string = "") {
    this.state = "error";
    this.log(message);
  }

  success(message: string = "") {
    this.state = "success";
    this.log(message);
  }

  skip(message: string = "") {
    this.state = "skipped";
    this.log(message);
  }
}

module.exports = Step;
