// @flow

const Renderer = require("./Renderer");
const { Step } = require("./Step");

const r = new Renderer();
const s = new Step("foo");
r.add(s);
const s1 = s.spawn("bar");
const s2 = s.spawn("baz");
setTimeout(() => s.start(), 1000);
setTimeout(() => s1.start(), 2000);
setTimeout(() => s1.warn(), 3000);
setTimeout(() => s2.start(), 4000);
setTimeout(() => s2.info(), 5000);
setTimeout(() => s.success(), 6000);
// setTimeout(() => r.stop(), 7000);

module.exports = {
  Renderer,
  Step
};
