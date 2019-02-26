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
  };


  setTarget(x, y, z) {
    this.target = new Vec3(x, y, z);
  };

  
  setUp(x, y, z) {
    this.up = new Vec3(x, y, z);
  };


  setModel(tx, ty, tz, ax, ay, az) {
    this.model.translate(tx, ty, tz).rotate(ax, ay, az);
    this.position = new Vec3(
      this.model.elements[12], this.model.elements[13], this.model.elements[14]
    );
  };


  updateView() {
    this.view.setLookAt(this.position, this.target, this.up);
  };
}