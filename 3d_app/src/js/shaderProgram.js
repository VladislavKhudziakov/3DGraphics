import { VBO } from "./vbo.js";
import { Uniform } from "./uniform.js";

export class ShaderProgram {

  constructor(gl, vShader, fShader) {
    this.gl = gl;

    this.vertexShader = vShader;
    this.fragmentShader = fShader;

    this.VBOs = {};
    this.uniforms = {};
    return this;
  };
  

  compile() {
    const gl = this.gl;
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader.shader);
    gl.attachShader(this.program, this.fragmentShader.shader);
    gl.linkProgram(this.program);

    const message = gl.getProgramInfoLog(this.program);

    if (message.length > 0) {
      throw message;
    } else {
      return this;
    }
  };


  use() {
    const gl = this.gl;
    gl.useProgram(this.program);
    return this;
  };


  initVBO(bufferName, data, size, init = true) {
    const gl = this.gl;
    this.VBOs[bufferName] = new VBO(gl, this.program, bufferName, data, size);
    if (init) {
      this.VBOs[bufferName].init();
    }

    return this;
  };

  
  initUniform(uniformName, data, type, index, init = true, send = true) {
    const gl = this.gl;
    this.uniforms[uniformName] = new Uniform(
      gl, this.program, uniformName, data);

    if (init) {
      this.uniforms[uniformName].init();
    }

    if (send) {
      switch (type.toLowerCase()) {
        case 'matf':
          this.uniforms[uniformName].sendFloatMatrix(index);
          break;
        case 'vecf':
          this.uniforms[uniformName].sendFloatVector(index);
          break;
        case 'f':
          this.uniforms[uniformName].sendFloat();
          break;
        case 'i':
          this.uniforms[uniformName].sendInt();
          break;
        default:
          break;
      };
    }

    return this;
  };
}