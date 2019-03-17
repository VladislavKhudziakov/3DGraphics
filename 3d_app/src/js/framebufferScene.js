import { Framebuffer } from "./framebuffer.js";
import { Texture } from "./texture.js";
import { Renderbuffer } from "./renderbuffer.js";
import { Scene } from "./scene.js";

export class FramebufferScene  extends Scene {
  constructor(app, width, height, materials) {
    super(app, materials);
    this.app = app;
    this.gl = gl;

    this.depthbuffer = new Renderbuffer(this.gl).create();
    this.colorbuffer = new Texture(this.gl)
    .createEmptyTexture(width, height, 0, 0);
    this.framebuffer = new Framebuffer(this.gl)
    .setRenderbuffer(this.depthbuffer)
    .setTexture(this.colorbuffer);

    this.drawOrder = [];
    this.lights = {};
    this.materials = materials;

    this.projection = null;
    this.camera = null;
    this.projectionView = null;
    this.node = null;

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
  

  StopRenderIn() {
    this.depthbuffer.unbind();
    this.framebuffer.unbind();

    return this;
  };


  bindColorBufferAsTexture() {
    this.colorbuffer.bind();

    return this;
  };


  clearColorBuffer(r, g, b, a) {
    const gl = this.gl;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return this;
  };
}