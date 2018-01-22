// @flow

import type { Styles, CompiledStyles, SignStyle, SpinnerStyle } from "./types";

const compileStyles = (styles: Styles): CompiledStyles => {
  return {
    indent: styles.indent,
    title: styles.title,
    log: styles.log,
    pending: compileSpinner(styles.pending),
    running: compileSpinner(styles.running),
    info: compileSign(styles.info),
    warn: compileSign(styles.warn),
    error: compileSign(styles.error),
    success: compileSign(styles.success),
    skipped: compileSign(styles.skipped),
  };
};

const compileSign = (sign: SignStyle): string => sign.color(sign.sign);

const compileSpinner = (spinner: SpinnerStyle): Array<string> =>
  spinner.frames.map((frame: string): string => spinner.color(frame));

module.exports = { compileStyles, compileSign, compileSpinner };
