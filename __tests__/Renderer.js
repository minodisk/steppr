// @flow

const Renderer = require("../src/Renderer");

class Container {
  should: boolean;

  constructor(shouldBeRendered: boolean = true) {
    this.should = shouldBeRendered;
  }

  toString(frame: number): string {
    return "foo";
  }

  shouldBeRendered(): boolean {
    return this.should;
  }
}

class NoopStream {
  write(text: string) {
    return true;
  }
}
const noopStream = new NoopStream();

class BufferStream {
  text: string;

  constructor() {
    this.text = "";
  }

  write(text: string): boolean {
    this.text += text;
    return true;
  }

  toString(): string {
    return this.text;
  }
}

const wait = (interval: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, interval));

describe("Renderer", () => {
  describe("stream", () => {
    it("should be written with line break", () => {
      const stream = new BufferStream();
      const renderer = new Renderer(new Container(), { stream });
      renderer.render();
      expect(stream.toString()).toBe(`foo
`);
    });
  });

  describe("fps", () => {
    it("should determine tick interval", async () => {
      const s1 = new BufferStream();
      const r1 = new Renderer(new Container(), { fps: 12, stream: s1 });

      const s2 = new BufferStream();
      const r2 = new Renderer(new Container(), { fps: 24, stream: s2 });

      await wait(100);

      expect(s1.toString().length < s2.toString().length);
    });
  });

  describe("autoStart", () => {
    it("shouldn't start timer automatically when autoStart is false", async () => {
      const renderer = new Renderer(new Container(), {
        stream: noopStream,
        autoStart: false,
      });

      await wait(100);

      expect(renderer.running()).toBe(false);
    });

    it("should start timer automatically when autoStart is true", async () => {
      const renderer = new Renderer(new Container(), {
        stream: noopStream,
        autoStart: true,
      });

      await wait(100);

      expect(renderer.running()).toBe(true);
    });
  });

  describe("autoStop", () => {
    it("shouldn't start timer automatically when autoStop is false", async () => {
      const renderer = new Renderer(new Container(false), {
        stream: noopStream,
        autoStop: false,
      });

      await wait(100);

      expect(renderer.running()).toBe(true);
      renderer.stop();
    });

    it("should start timer automatically when autoStop is true", async () => {
      const renderer = new Renderer(new Container(false), {
        stream: noopStream,
        autoStop: true,
      });

      await wait(100);

      expect(renderer.running()).toBe(false);
    });
  });

  describe("start(), stop(), running()", () => {
    it("should work", () => {
      const renderer = new Renderer(new Container(), {
        stream: noopStream,
        autoStart: false,
        autoStop: false,
      });

      expect(renderer.running()).toBe(false);
      renderer.start();
      expect(renderer.running()).toBe(true);
      renderer.stop();
      expect(renderer.running()).toBe(false);
      renderer.start();
      expect(renderer.running()).toBe(true);
      renderer.start();
      expect(renderer.running()).toBe(true);
      renderer.stop();
      expect(renderer.running()).toBe(false);
      renderer.stop();
      expect(renderer.running()).toBe(false);
    });
  });
});
