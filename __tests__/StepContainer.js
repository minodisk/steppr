// @flow

const StepContainer = require("../src/StepContainer");
const Step = require("../src/Step");

const noop = (text: string): string => text;

describe("StepContainer", () => {
  describe("constructor()", () => {
    it("should compile style", () => {
      const wrap = (text: string): string => `[${text}]`;
      const container = new StepContainer({
        indent: "indent",
        title: { color: wrap, sign: "title" },
        log: { color: wrap, sign: "log" },
        pending: { color: wrap, frames: ["p", "e", "n", "d", "i", "n", "g"] },
        running: { color: wrap, frames: ["r", "u", "n", "n", "i", "n", "g"] },
        info: { color: wrap, sign: "info" },
        warn: { color: wrap, sign: "warn" },
        error: { color: wrap, sign: "error" },
        success: { color: wrap, sign: "success" },
        skipped: { color: wrap, sign: "skipped" },
      });
      expect(container.styles).toEqual({
        indent: "indent",
        title: { color: wrap, sign: "title" },
        log: { color: wrap, sign: "log" },
        pending: ["[p]", "[e]", "[n]", "[d]", "[i]", "[n]", "[g]"],
        running: ["[r]", "[u]", "[n]", "[n]", "[i]", "[n]", "[g]"],
        info: "[info]",
        warn: "[warn]",
        error: "[error]",
        success: "[success]",
        skipped: "[skipped]",
      });
    });
  });

  describe("add()", () => {
    it("should push to children", () => {
      const container = new StepContainer();
      const steps = [
        new Step("foo", container.styles),
        new Step("bar", container.styles),
        new Step("baz", container.styles),
      ];
      steps.forEach(step => container.add(step));
      expect(container.children).toEqual(steps);
    });
  });

  describe("spawn()", () => {
    const container = new StepContainer({
      title: {
        color: noop,
        sign: "",
      },
    });
    const step = container.spawn("foo");

    it("should pass title", () => {
      expect(step.compiledTitle).toBe("foo");
    });

    it("should share styles", () => {
      expect(step.styles).toEqual(container.styles);
    });

    it("should add child", () => {
      expect(container.children.length).toBe(1);
      expect(container.children[0]).toBe(step);
    });
  });

  describe("shouldBeRendered()", () => {
    it("should be false with no child", () => {
      const container = new StepContainer();
      expect(container.shouldBeRendered()).toBe(false);
    });

    it("should be false when all children shouldn't be rendered", () => {
      const container = new StepContainer();
      const s1 = container.spawn("");
      s1.success();
      const s2 = container.spawn("");
      s2.success();
      const s3 = container.spawn("");
      s3.success();
      expect(container.shouldBeRendered()).toBe(false);
    });

    it("should be true when at least one child should be rendered", () => {
      const container = new StepContainer();
      const s1 = container.spawn("");
      s1.success();
      const s2 = container.spawn("");
      const s3 = container.spawn("");
      s3.success();
      expect(container.shouldBeRendered()).toBe(true);
    });

    it("should be true when at least one descendant should be rendered", () => {
      const container = new StepContainer();
      const s1 = container.spawn("");
      s1.success();
      container.add(s1);
      const s2 = container.spawn("");
      s2.success();
      const s21 = s2.spawn("");
      s21.success();
      const s211 = s21.spawn("");
      const s3 = container.spawn("");
      s3.success();
      expect(container.shouldBeRendered()).toBe(true);
    });
  });

  describe("toString()", () => {
    it("should return empty string without children", () => {
      const container = new StepContainer();
      expect(container.toString(0)).toBe("");
    });

    it("should return string with children", () => {
      const container = new StepContainer({
        title: {
          color: noop,
          sign: "",
        },
        pending: {
          color: noop,
          frames: [""],
        },
      });
      const s1 = container.spawn("foo");
      const s2 = container.spawn("bar");
      expect(container.toString(0)).toBe(`foo
bar`);
    });
  });
});
