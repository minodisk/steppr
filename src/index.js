// @flow

const Renderer = require("./Renderer");
const { Step } = require("./Step");

const r = new Renderer();
const root = r.root;
const s = root.spawn("foo");
const s1 = s.spawn("bar");
const s2 = s.spawn("baz");
const s21 = s2.spawn("qux");
setTimeout(() => s.start(), 1000);
setTimeout(() => s1.start(), 2000);
setTimeout(() => s1.warn(), 3000);
setTimeout(() => s2.start(), 4000);
setTimeout(() => s21.start(), 5000);
setTimeout(() => s21.error(), 6000);
setTimeout(() => s2.info(), 7000);
setTimeout(() => s.success(), 8000);

module.exports = {
  Renderer,
  Step
};
