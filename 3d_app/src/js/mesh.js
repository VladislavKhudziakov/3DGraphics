import { Mat4 } from "../../lib/matrix4.js";
import { Vec3 } from "../../lib/vector3.js";

export class Mesh {
  constructor(gl, file, size, program) {
    this.gl = gl;
    this.file = file;
    this.size = size;
    this.program = program;
    this.model = new Mat4();
    this.position = new Vec3(
      this.model.elements[12], this.model.elements[13], this.model.elements[14]
    );
  };


  draw() {
    const gl = this.gl;
    gl.drawArrays(gl.TRIANGLES, 0, this.file.vertices.length / this.size);
    return this;
  };


  setTransform(tx, ty, tz, sx, sy, sz, ax, ay, az) {
    this.model.setTranslate(tx, ty, tz).rotate(ax, ay, az).scale(sx, sy, sz);
    this.position = new Vec3(
      this.model.elements[12], this.model.elements[13], this.model.elements[14]
    );

    return this;
  };


  transform(tx, ty, tz, sx, sy, sz, ax, ay, az) {
    this.model.scale(sx, sy, sz).translate(tx, ty, tz).rotate(ax, ay, az);

    return this;
  };

  setMVP(perspective, view) {
    this.mvp = new Mat4();    
    this.mvp.mul(perspective).mul(view).mul(this.model);

    return this;
  };
  
};