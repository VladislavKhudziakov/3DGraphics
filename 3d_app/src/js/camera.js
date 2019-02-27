import {Mat4} from "../../lib/matrix4.js";
import{Vec3} from "../../lib/vector3.js"

export class Camera {
  constructor() {
    this.model = new Mat4();
    this.position = new Vec3(
      this.model.elements[12], this.model.elements[13], this.model.elements[14]
    );
    this.target = new Vec3(0, 0, 0);
    this.up = new Vec3(0, 1, 0);
    this.view = new Mat4();
    this.view.setLookAt(this.position, this.target, this.up);

    return this;
  };


  setTarget(x, y, z) {
    this.target = new Vec3(x, y, z);
    return this;
  };

  
  setUp(x, y, z) {
    this.up = new Vec3(x, y, z);
    return this;
  };


  setModel(tx, ty, tz, ax, ay, az) {
    const matrix = new Mat4();
    matrix.rotate(ax, ay, az).translate(tx, -ty, tz);
    this.model = matrix;
    this.position = new Vec3(
      this.model.elements[12], this.model.elements[13], this.model.elements[14]
    );
    return this;
  };


  updateView() {
    const matrix = new Mat4();
    matrix.setLookAt(this.position, this.target, this.up).inverse();
    this.view = matrix;
    return this;
  };
}