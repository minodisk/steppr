// @flow

const { Renderer, Step } = require("../src");
const chalk = require("chalk");

class Noop {
  write(text: string) {
    return true;
  }
}

const noop = new Noop();

describe("Renderer", () => {
  describe("options", () => {
    describe("stream", () => {
      class Buffer {
        text: string;

        constructor() {
          this.text = "";
        }

        write(text: string): boolean {
          this.text += text;
          return true;
        }

        toString(): string {
          return this.text;
        }
      }

      [
        {
          name: "info",
          exec: (step: Step) => {
            step.info("foo");
          },
          want: `${chalk.blue("ⓘ")} foo
`,
        },
        {
          name: "warn",
          exec: (step: Step) => {
            step.warn("foo");
          },
          want: `${chalk.yellow("⚠")} foo
`,
        },
        {
          name: "error",
          exec: (step: Step) => {
            step.error("foo");
          },
          want: `${chalk.red("✖")} foo
`,
        },
        {
          name: "success",
          exec: (step: Step) => {
            step.success("foo");
          },
          want: `${chalk.green("✓")} foo
`,
        },
        {
          name: "skip",
          exec: (step: Step) => {
            step.skip("foo");
          },
          want: `${chalk.gray("↓")} foo
`,
        },
      ].forEach(({ name, exec, want }) => {
        it(name, () => {
          const stream = new Buffer();
          const renderer = new Renderer({ stream });
          const step = new Step();
          renderer.add(step);
          exec(step);
          renderer.render();
          expect(stream.toString()).toBe(want);
        });
      });
    });
  });

  describe(`pending`, () => {
    it("should render spinner", () =>
      new Promise(resolve => {
        const renderer = new Renderer({ stream: noop });
        const step = new Step("foo");
        renderer.add(step);
        const wants = [
          `${chalk.gray("⠋")} foo`,
          `${chalk.gray("⠙")} foo`,
          `${chalk.gray("⠹")} foo`,
          `${chalk.gray("⠸")} foo`,
          `${chalk.gray("⠼")} foo`,
          `${chalk.gray("⠴")} foo`,
          `${chalk.gray("⠦")} foo`,
          `${chalk.gray("⠧")} foo`,
          `${chalk.gray("⠇")} foo`,
          `${chalk.gray("⠏")} foo`,
          `${chalk.gray("⠋")} foo`,
          `${chalk.gray("⠙")} foo`,
          `${chalk.gray("⠹")} foo`,
          `${chalk.gray("⠸")} foo`,
          `${chalk.gray("⠼")} foo`,
          `${chalk.gray("⠴")} foo`,
          `${chalk.gray("⠦")} foo`,
          `${chalk.gray("⠧")} foo`,
          `${chalk.gray("⠇")} foo`,
          `${chalk.gray("⠏")} foo`,
        ];
        renderer.on("rendered", (output: string) => {
          const want = wants.shift();
          if (want == null) {
            resolve();
            return;
          }
          expect(output).toBe(want);
        });
        renderer.start();
      }));
  });

  describe(`start`, () => {
    it("should render spinner", () =>
      new Promise(resolve => {
        const renderer = new Renderer({ stream: noop });
        const step = new Step("foo");
        renderer.add(step);
        const wants = [
          `${chalk.cyan("⠋")} foo`,
          `${chalk.cyan("⠙")} foo`,
          `${chalk.cyan("⠹")} foo`,
          `${chalk.cyan("⠸")} foo`,
          `${chalk.cyan("⠼")} foo`,
          `${chalk.cyan("⠴")} foo`,
          `${chalk.cyan("⠦")} foo`,
          `${chalk.cyan("⠧")} foo`,
          `${chalk.cyan("⠇")} foo`,
          `${chalk.cyan("⠏")} foo`,
          `${chalk.cyan("⠋")} foo`,
          `${chalk.cyan("⠙")} foo`,
          `${chalk.cyan("⠹")} foo`,
          `${chalk.cyan("⠸")} foo`,
          `${chalk.cyan("⠼")} foo`,
          `${chalk.cyan("⠴")} foo`,
          `${chalk.cyan("⠦")} foo`,
          `${chalk.cyan("⠧")} foo`,
          `${chalk.cyan("⠇")} foo`,
          `${chalk.cyan("⠏")} foo`,
        ];
        renderer.on("rendered", (output: string) => {
          const want = wants.shift();
          if (want == null) {
            resolve();
            return;
          }
          expect(output).toBe(want);
        });
        renderer.start();
        step.start();
      }));
  });

  describe(`end with info`, () => {
    it("should render spinner", () =>
      new Promise(resolve => {
        const renderer = new Renderer({ stream: noop });
        const step = new Step("foo");
        renderer.add(step);
        const cases = [
          {
            exec: () => {},
            want: `${chalk.gray("⠋")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.gray("⠙")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.gray("⠹")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.gray("⠸")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.gray("⠼")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠴")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠦")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠧")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠇")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠏")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠋")} foo${chalk.gray(" -> bar")}`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠙")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠹")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠸")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠼")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠴")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠦")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠧")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠇")} foo`,
          },
          {
            exec: () => {},
            want: `${chalk.cyan("⠏")} foo`,
          },
        ];
        renderer.on("rendered", (output: string) => {
          const want = wants.shift();
          if (want == null) {
            resolve();
            return;
          }
          expect(output).toBe(want);
        });
        renderer.start();
        step.start();
      }));
  });
});
