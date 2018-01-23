const steppr = require("../lib/index");

const s = steppr();
const s1 = s.spawn("foo");
const s11 = s1.spawn("bar");
const s12 = s1.spawn("baz");
const s121 = s12.spawn("qux");

setTimeout(() => s1.start(), 1000);
setTimeout(() => s11.start(), 2000);
setTimeout(() => s11.warn(), 3000);
setTimeout(() => s12.start(), 4000);
setTimeout(() => s121.start(), 5000);
setTimeout(() => s121.error("bad things happened"), 6000);
setTimeout(() => s12.info("something is wrong"), 7000);
setTimeout(() => s1.success(), 8000);
