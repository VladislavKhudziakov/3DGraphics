import { Framebuffer } from "./framebuffer";
import { Texture } from "./texture";
import { Renderbuffer } from "./renderbuffer";

export class FramebufferScene {
  constructor(gl, width, height) {
    this.gl = gl;

    this.depthbuffer = new Renderbuffer(this.gl).create();
    this.colorbuffer = new Texture(this.gl)
    .createEmptyTexture(width, height, 0, 0);
    this.framebuffer = new Framebuffer(this.gl)
    .setRenderbuffer(this.depthbuffer)
    .setTexture(this.colorbuffer);

    return this;
  };


  create() {
    this.framebuffer.create();

    return this;
  };


  renderIn() {
    this.colorbuffer.bind();
    this.depthbuffer.bind();
    this.framebuffer.bind();

    return this;
  };
  

  StopRenderIn() {
    this.colorbuffer.unbind();
    this.depthbuffer.unbind();
    this.framebuffer.unbind();

    return this;
  };


  clearColorBuffer(r, g, b, a) {
    const gl = this.gl;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return this;
  };
}