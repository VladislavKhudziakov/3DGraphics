import { Framebuffer } from "./framebuffer.js";
import { Texture } from "./texture.js";
import { Renderbuffer } from "./renderbuffer.js";
import { Scene } from "./scene.js";

export class FramebufferScene  extends Scene {
  constructor(app, name, width, height) {
    super(app, name);
    this.app = app;
    this.gl = this.app.getGl();

    this.depthbuffer = new Renderbuffer(this.gl).create();
    this.colorbuffer = new Texture(this.gl)
    .createEmptyTexture(width, height, 0, 0);
    this.framebuffer = new Framebuffer(this.gl)
    .create()
    .setTexture(this.colorbuffer)
    .setRenderbuffer(this.depthbuffer);

    return this;
  };


  create() {
    this.framebuffer.create();

    return this;
  };


  renderIn() {
    this.depthbuffer.bind();
    this.framebuffer.bind();

    return this;
  };
  

  stopRenderIn() {
    this.depthbuffer.unbind();
    this.framebuffer.unbind();

    return this;
  };


  bindColorBufferAsTexture() {
    this.colorbuffer.bind();

    return this;
  };


  getColorbuffer() {
    return this.colorbuffer;
  };


  clearColorBuffer(r, g, b, a) {
    const gl = this.gl;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return this;
  };
}