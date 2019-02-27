import { Vec3 } from "../../lib/vector3.js";

export class LightSource {
  constructor(x, y, z, r, g, b, p) {
    this.position = new Vec3(x, y, z);
    this.color = new Vec3(r, g, b);
    this.power = p;
  }
}