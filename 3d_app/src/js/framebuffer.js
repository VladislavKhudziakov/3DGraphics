export class Framebuffer {
  constructor(gl) {
    this.gl = gl;
    this.framebuffer = undefined;

    return this;
  }

  create() {
    const gl = this.gl;

    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    return this;
  }

  bind() {
    const gl = this.gl;
    gl.viewport(0, 0, this.texture.width, this.texture.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    return this;
  }
  
  setTexture(texture, apply = true) {
    const gl = this.gl;
    this.texture = texture;

    if (apply) {
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
        this.texture.texture, this.texture.level);
    }

    gl.viewport(0, 0, this.texture.width, this.texture.height);
    return this;
  }

  applyTexture() {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
      this.texture, this.texture.level);
    
    gl.viewport(0, 0, this.texture.width, this.texture.height);
    return this;
  }
}