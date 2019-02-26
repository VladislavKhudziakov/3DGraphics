import { Mat4 } from "../../lib/matrix4";

export class Projection {
  constructor() {
    this.projection = new Mat4();
  }

  setPerspective(fov, aspect, near, far) {
    this.projection.setPerspective(fov, aspect, near, far);

    return this;
  };

  setOrtho(left, right, top, bottom, near, far) {
    this.projection.setOrtho(left, right, top, bottom, near, far);

    return this;
  };
}