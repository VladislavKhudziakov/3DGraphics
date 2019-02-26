import { Mat4 } from "../../lib/matrix4";

export class Mesh {
  constructor(gl, program, file, size) {
    this.gl = gl;
    this.program = program;
    this.file = file;
    this.size = size;
    this.model = new Mat4();
  };


  draw() {
    const gl = this.gl;
    gl.drawArrays(gl.TRIANGLES, 0, this.file.vertices / this.size);

    return this;
  };


  setTransform(tx, ty, tz, sx, sy, sz, ax, ay, az) {
    this.model.setScale(sx, sy, sz).translate(tx, ty, tz).rotate(ax, ay, az);

    return this;
  };


  transform(tx, ty, tz, sx, sy, sz, ax, ay, az) {
    this.model.scale(sx, sy, sz).translate(tx, ty, tz).rotate(ax, ay, az);

    return this;
  };
  
}