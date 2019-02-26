class ShaderProgram {
  constructor(gl, vShaderSource, fShaderSource) {
    this._gl = gl;
    this.vertexShader = this._initShader(vShaderSource, gl.VERTEX_SHADER);
    this.fragmentShader = this._initShader(vShaderSource, gl.FRAGMENT_SHADER);
    this.program 
  }

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
  }
}