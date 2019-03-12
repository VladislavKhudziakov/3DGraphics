export class Renderbuffer {
  constructor(gl) {
    this.gl = gl;
    this.renderbuffer = undefined;

    return this;
  }

  create() {
    const gl = this.gl;

    this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);

    return this;
  }

  bind() {
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);

    return this;
  }
}