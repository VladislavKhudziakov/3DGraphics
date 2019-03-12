import { VBO } from "./vbo.js";
import { Uniform } from "./uniform.js";

export class ShaderProgram {
  constructor(gl, vShaderSource, fShaderSource) {
    this._gl = gl;
    this.vertexShader = this._initShader(vShaderSource, gl.VERTEX_SHADER);
    this.fragmentShader = this._initShader(fShaderSource, gl.FRAGMENT_SHADER);
    this._initProgram();

    this.VBOs = {};
    this.uniforms = {};
    return this;
  };

  // constructor(gl, vShader, fShader) {
  //   this._gl = gl;

  //   this.vertexShader = vShader;
  //   this.fragmentShader = fShader;

  //   this.VBOs = {};
  //   this.uniforms = {};
  //   return this;
  // };



  _initShader(shaderSourse, shaderType) {
    const gl = this._gl;
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSourse);
    gl.compileShader(shader);

    const message = gl.getShaderInfoLog(shader);
    
    if (message.length > 0) {
      throw message;
    } else {
      return shader;
    }
  };


  _initProgram() {
    const gl = this._gl;
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);

    const message = gl.getProgramInfoLog(this.program);

    if (message.length > 0) {
      throw message;
    } else {
      return this;
    }
  };


  compile() {
    const gl = this._gl;
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
    const gl = this._gl;
    gl.useProgram(this.program);
    return this;
  };


  initVBO(bufferName, data, size, init = true) {
    const gl = this._gl;
    this.VBOs[bufferName] = new VBO(gl, this.program, bufferName, data, size);
    if (init) {
      this.VBOs[bufferName].init();
    }

    return this;
  };

  initUniform(uniformName, data, type, index, init = true, send = true) {
    const gl = this._gl;
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