// @flow

export type OptionalOptions = {
  stream?: WritableStream,
  fps?: number,
  autoStart?: boolean
};
export type Options = {
  stream: WritableStream,
  fps: number,
  autoStart: boolean
};

export type WritableStream = {
  write(chunk: string): boolean
};

export type Color = (text: string) => string;

export type SignStyle = {
  color: Color,
  sign: string
};
export type SpinnerStyle = {
  color: Color,
  frames: Array<string>
};

export type OptionalStyles = {
  indent?: string,
  title?: SignStyle,
  log?: SignStyle,
  pending?: SpinnerStyle,
  running?: SpinnerStyle,
  info?: SignStyle,
  warn?: SignStyle,
  error?: SignStyle,
  success?: SignStyle,
  skipped?: SignStyle
};
export type Styles = {
  indent: string,
  title: SignStyle,
  log: SignStyle,
  pending: SpinnerStyle,
  running: SpinnerStyle,
  info: SignStyle,
  warn: SignStyle,
  error: SignStyle,
  success: SignStyle,
  skipped: SignStyle
};
export type CompiledStyles = {
  indent: string,
  title: SignStyle,
  log: SignStyle,
  pending: Array<string>,
  running: Array<string>,
  info: string,
  warn: string,
  error: string,
  success: string,
  skipped: string
};

export type State =
  | "pending"
  | "running"
  | "info"
  | "warn"
  | "error"
  | "success"
  | "skipped";
