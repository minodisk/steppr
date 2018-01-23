// @flow

const Renderer = require("./Renderer");
const StepContainer = require("./StepContainer");
import type { OptionalOptions, OptionalStyles } from "./types";

const steppr = (
  options?: OptionalOptions,
  styles?: OptionalStyles
): StepContainer => {
  const renderer = new Renderer(options);
  const container = new StepContainer(styles);
  renderer.setContainer(container);
  return container;
};

module.exports = steppr;
