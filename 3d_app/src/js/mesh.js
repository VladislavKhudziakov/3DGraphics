import { Mat4 } from "../../lib/matrix4.js";

export class Mesh {
  constructor(gl, data, size, program, scene) {
    this.gl = gl;
    this.data = data;
    this.size = size;
    this.program = program;
    this.model = new Mat4();
    this.scene = scene;
    this.texture = undefined;
  };


  draw() {
    const gl = this.gl;
    this.initBuffers();
    this.initUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, this.data.vertices.length / this.size);
    return this;
  };


  setTransform(tx, ty, tz, sx, sy, sz, ax, ay, az) {
    this.model.setTranslate(tx, ty, tz).rotate(ax, ay, az).scale(sx, sy, sz);

    return this;
  };

  setModel(model) {
    this.model = model;

    return this;
  };

  setTexture(texture) {
    this.texture = texture;

    return this;
  };

  computeMVP() {
    this.mvp = Object.assign(new Mat4(), this.scene.projectionView);
    this.mvp.mul(this.model);
    
    return this;
  };

  initBuffers() {
    this.program.initVBO('a_Position', this.data.vertices, this.size);
    // this.program.initVBO('a_Color', this.data.colors, this.size);
    this.program.initVBO('a_uv', this.data.uv, 2);
  };

  initUniforms() {
    this.program.initUniform('u_MVP', this.mvp, 'matf', 4);
    this.program.initUniform('u_texture', 0, 'i');
  };
};