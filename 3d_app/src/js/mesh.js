import { Mat4 } from "../../lib/matrix4.js";
import { ShaderProgram } from "./shaderProgram.js";

export class Mesh {

  constructor(gl, dataObj, vShader, fShader, scene) {
    this.gl = gl;
    this.data = dataObj.data;
    this.size = dataObj.size;
    this.name = dataObj.name;
    this.vertexShader = vShader;
    this.fragmentShader = fShader;
    this.program = undefined;
    this.model = new Mat4();
    this.scene = scene;
    this.texture = undefined;

    return this;
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


  useTexture() {
    this.texture.bind();
    
    return this;
  };


  compileShaderProgram() {
    const gl = this.gl;

    this.program = new ShaderProgram(
      gl, this.vertexShader, this.fragmentShader).compile();

    return this;
  };

  
  useShaderProgram() {
    this.program.use();

    return this;
  };


  computeMVP() {
    this.mvp = Object.assign(new Mat4(), this.scene.projectionView);
    this.mvp.mul(this.model);
    
    return this;
  };


  initBuffers() {
    if (this.data.vertices) {
      this.program.initVBO('a_Position', this.data.vertices, this.size);
    }

    if (this.data.colors) {
      this.program.initVBO('a_Color', this.data.colors, this.size);
    }

    if (this.data.normals) {
      this.program.initVBO('a_uv', this.data.normals, 3);
    }

    if (this.data.uv) {
      this.program.initVBO('a_uv', this.data.uv, 2);
    }

    return this;
  };


  initUniforms() {
    if (this.mvp) {
      this.program.initUniform('u_MVP', this.mvp, 'matf', 4);
    }

    if (this.texture) {
      this.program.initUniform('u_texture', 0, 'i');
    }

    if (this.scene.light) {
      this.program.initUniform('u_texture', this.scene.light.position, 'vecf', 3);
      this.program.initUniform('u_texture', this.scene.light.color, 'vecf', 3);
      this.program.initUniform('u_texture', this.scene.light.power, 'f');
    }
    
    return this;
  };
};