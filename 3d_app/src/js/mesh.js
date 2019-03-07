import { Mat4 } from "../../lib/matrix4.js";

export class Mesh {
  constructor(gl, data, size, program, scene) {
    this.gl = gl;
    this.data = data;
    this.size = size;
    this.program = program;
    this.model = new Mat4();
    this.scene = scene;
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
  };

  setMVP(perspective, view) {
    this.mvp = new Mat4();    
    this.mvp.mul(perspective).mul(view).mul(this.model);
    // console.log(this.mvp);

    return this;
  };

  computeMVP() {
    this.mvp = Object.assign(new Mat4(), this.scene.projectionView);
    this.mvp.mul(this.model);
    // console.log(this.mvp);
    
    return this;
  };

  initBuffers() {
    this.program.initVBO('a_Position', this.data.position, this.size);
    this.program.initVBO('a_Color', this.data.colors, this.size);
  };

  initUniforms() {
    this.program.initUniform('u_MVP', this.mvp, 'matf', 4);
    this.program.initUniform('u_ColorMult', this.colorMult, 'vecf', 3);
    this.program.initUniform('u_ColorOffset', this.colorOffset, 'vecf', 3);
  };
};