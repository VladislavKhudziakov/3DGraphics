export class Mesh {
  constructor(gl, program, file, size) {
    this.gl = gl;
    this.program = program;
    this.file = file;
    this.size = size;
  };

  draw() {
    const gl = this.gl;
    gl.drawArrays(gl.TRIANGLES, 0, this.file.vertices / this.size);
  };
  
}