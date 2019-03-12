export class Shader {
  constructor(gl, type, source, fileName) {
    this.gl = gl;

    if (type.toLowerCase() === 'vertex') {
      this.type = gl.VERTEX_SHADER;
    } else if (type.toLowerCase() === 'fragment') {
      this.type = gl.FRAGMENT_SHADER;
    }

    this.source = source;

    this.fileName = fileName;

    return this;
  }

  compile() {
    const gl = this.gl;
    
    this.shader = gl.createShader(this.type);
    gl.shaderSource(this.shader, this.source);
    gl.compileShader(this.shader);

    const message = gl.getShaderInfoLog(this.shader);
    
    if (message.length > 0) {
      throw message;
    } else {
      return this;
    }
  }
}