// @flow

const Step = require("../src/Step");
const chalk = require("chalk");
import type { CompiledStyles } from "../src/types";

const noopColor = (text: string): string => text;

const styles: CompiledStyles = {
  indent: "  ",
  title: { color: noopColor, sign: " " },
  log: { color: noopColor, sign: " -> " },
  pending: ["P:", "E:", "N:", "D:", "I:", "N:", "G:"],
  running: ["R:", "U:", "N:", "N:", "I:", "N:", "G:"],
  info: "I:",
  warn: "W:",
  error: "E:",
  success: "S:",
  skipped: "-:",
};

describe("Step", () => {
  describe("shouldBeRendered()", () => {
    it("should be true when pending", () => {
      const step = new Step("", styles);
      expect(step.shouldBeRendered()).toBe(true);
    });

    it("should be true when running", () => {
      const step = new Step("", styles);
      step.start();
      expect(step.shouldBeRendered()).toBe(true);
    });

    it("should be false when info", () => {
      const step = new Step("", styles);
      step.info();
      expect(step.shouldBeRendered()).toBe(false);
    });

    it("should be false when warn", () => {
      const step = new Step("", styles);
      step.warn();
      expect(step.shouldBeRendered()).toBe(false);
    });

    it("should be false when error", () => {
      const step = new Step("", styles);
      step.error();
      expect(step.shouldBeRendered()).toBe(false);
    });

    it("should be false when success", () => {
      const step = new Step("", styles);
      step.success();
      expect(step.shouldBeRendered()).toBe(false);
    });

    it("should be false when skip", () => {
      const step = new Step("", styles);
      step.skip();
      expect(step.shouldBeRendered()).toBe(false);
    });

    it("should be false when all children shouldn't be rendered", () => {
      const s1 = new Step("", styles);
      s1.success();
      const s2 = s1.spawn("");
      s2.success();
      const s3 = s1.spawn("");
      s3.success();
      expect(s1.shouldBeRendered()).toBe(false);
    });

    it("should be true when at least one child should be rendered", () => {
      const s1 = new Step("", styles);
      s1.success();
      const s2 = s1.spawn("");
      const s3 = s1.spawn("");
      s3.success();
      expect(s1.shouldBeRendered()).toBe(true);
    });

    it("should be true when at least one descendant should be rendered", () => {
      const s1 = new Step("", styles);
      s1.success();
      const s2 = s1.spawn("");
      s2.success();
      const s21 = s2.spawn("");
      s21.success();
      const s211 = s21.spawn("");
      const s3 = s1.spawn("");
      s3.success();
      expect(s1.shouldBeRendered()).toBe(true);
    });
  });

  describe("add()", () => {
    it("should increase depth", () => {
      const s1 = new Step("foo", styles);
      const s2 = new Step("bar", styles);
      const s3 = new Step("baz", styles);

      expect(s2.depth).toBe(0);
      s1.add(s2);
      expect(s2.depth).toBe(1);

      expect(s3.depth).toBe(0);
      s2.add(s3);
      expect(s3.depth).toBe(2);
    });
  });

  describe("sign()", () => {
    it("should throw error with unexpected state", () => {
      const step = new Step("foo", styles);
      // $FlowFixMe
      step.state = "bad";
      expect(() => step.sign(0)).toThrow();
    });
  });

  describe("toString()", () => {
    [
      {
        name: "pending",
        exec: (step: Step) => {},
        want: "P: foo",
      },
      {
        name: "running",
        exec: (step: Step) => {
          step.start();
        },
        want: "R: foo",
      },
      {
        name: "info",
        exec: (step: Step) => {
          step.info();
        },
        want: "I: foo",
      },
      {
        name: "warn",
        exec: (step: Step) => {
          step.warn();
        },
        want: "W: foo",
      },
      {
        name: "error",
        exec: (step: Step) => {
          step.error();
        },
        want: "E: foo",
      },
      {
        name: "success",
        exec: (step: Step) => {
          step.success();
        },
        want: "S: foo",
      },
      {
        name: "skip",
        exec: (step: Step) => {
          step.skip();
        },
        want: "-: foo",
      },
    ].forEach(({ name, exec, want }) => {
      it(name, () => {
        const step = new Step("foo", styles);
        exec(step);
        expect(step.toString(0)).toBe(want);
      });
    });

    it("should express nested steps", () => {
      const s1 = new Step("foo", styles);
      const s2 = s1.spawn("bar");
      const s3 = s2.spawn("baz");
      expect(s1.toString(0)).toBe(`P: foo
 P: bar
   P: baz`);
    });
  });

  describe("pending status", () => {
    it("should turn pending spinner", () => {
      const step = new Step("foo", styles);
      const wants = [
        "P: foo",
        "E: foo",
        "N: foo",
        "D: foo",
        "I: foo",
        "N: foo",
        "G: foo",
      ].forEach((want, frame) => {
        expect(step.toString(frame)).toBe(want);
      });
    });
  });

  describe("log()", () => {
    it("should append log message", () => {
      const step = new Step("foo", styles);
      step.log("bar");
      expect(step.toString(0)).toBe("P: foo -> bar");
    });
  });

  describe("start()", () => {
    it("should turn running spinner", () => {
      const step = new Step("foo", styles);
      step.start();
      const wants = [
        "R: foo",
        "U: foo",
        "N: foo",
        "N: foo",
        "I: foo",
        "N: foo",
        "G: foo",
      ].forEach((want, frame) => {
        expect(step.toString(frame)).toBe(want);
      });
    });

    it("should append log message", () => {
      const step = new Step("foo", styles);
      step.start("bar");
      expect(step.toString(0)).toBe("R: foo -> bar");
    });
  });
});
