export class ShaderProgram {
  constructor(gl, vShaderSource, fShaderSource) {
    this._gl = gl;
    this.vertexShader = this._initShader(vShaderSource, gl.VERTEX_SHADER);
    this.fragmentShader = this._initShader(fShaderSource, gl.FRAGMENT_SHADER);
    this.program = this._initProgram();
  };


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
    const program = gl.createProgram();
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);

    const message = gl.getProgramInfoLog(program);

    if (message.length > 0) {
      throw message;
    } else {
      return program;
    }
  };
}