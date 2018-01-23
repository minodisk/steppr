// @flow

const Renderer = require("./Renderer");
const StepContainer = require("./StepContainer");
import type { OptionalOptions, OptionalStyles } from "./types";

const steppr = (
  options?: OptionalOptions,
  styles?: OptionalStyles
): StepContainer => {
  const container = new StepContainer(styles);
  const renderer = new Renderer(container, options);
  return container;
};

module.exports = steppr;
