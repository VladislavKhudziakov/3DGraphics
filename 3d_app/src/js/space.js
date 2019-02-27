import { Mat4 } from "../../lib/matrix4.js";

export class Projection {
  constructor(gl) {
    this._gl = gl;
    this.projection = new Mat4();

    return this;
  }

  setPerspective(fov, near, far) {
    const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
    this.projection.setPerspective(fov, aspect, near, far);

    return this;
  };

  setOrtho(left, right, top, bottom, near, far) {
    this.projection.setOrtho(left, right, top, bottom, near, far);

    return this;
  };
}