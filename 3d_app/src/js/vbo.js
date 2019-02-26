export class VBO {
  constructor(gl, program, attrName, data, size) {
    this.gl = gl;
    this.program = program;
    this.attrName = attrName;
    this.attribute = null;
    this.buffer = null;
    this.data = data;
    this.size = size;
  }

  init(normalized = false, type = this.gl.FLOAT) {
    const gl = this.gl;
    this.attribute = gl.getAttribLocation(this.program, this.attrName);
    this.buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.attribute);
    gl.vertexAttribPointer(this.attribute, this.size, type, normalized, 0, 0);

    return this;
  }
}