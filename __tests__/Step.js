// @flow

const { Step } = require("../src");
const chalk = require("chalk");

describe("step", () => {
  describe("style", () => {
    describe("default", () => {
      [
        {
          name: "info",
          exec: (step: Step) => {
            step.info("foo");
          },
          want: `${chalk.blue("ⓘ")} foo`,
        },
        {
          name: "warn",
          exec: (step: Step) => {
            step.warn("foo");
          },
          want: `${chalk.yellow("⚠")} foo`,
        },
        {
          name: "error",
          exec: (step: Step) => {
            step.error("foo");
          },
          want: `${chalk.red("✖")} foo`,
        },
        {
          name: "success",
          exec: (step: Step) => {
            step.success("foo");
          },
          want: `${chalk.green("✓")} foo`,
        },
        {
          name: "skip",
          exec: (step: Step) => {
            step.skip("foo");
          },
          want: `${chalk.gray("↓")} foo`,
        },
      ].forEach(({ name, exec, want }) => {
        it(name, () => {
          const step = new Step();
          exec(step);
          expect(step.toString()).toBe(want);
        });
      });
    });
  });
});
