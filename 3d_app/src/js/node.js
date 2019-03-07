import { Mat4 } from "../../lib/matrix4.js";
import { Mesh } from "./mesh.js";

export class Node {
  constructor(localData, parentNode) {
    this.children = [];

    if (parentNode) {
      this.parentNode = parentNode;
      this.parentNode.addChild(this);
    }

    if (localData instanceof Mesh) {
      this.mesh = localData;
      this.localMatrix = Object.assign(new Mat4(), this.mesh.model);
      this._localMatrix = Object.assign(new Mat4(), this.mesh.model);
    }

    if (localData instanceof Mat4) {
      this.localMatrix = Object.assign(new Mat4(), localData);
      this._localMatrix = Object.assign(new Mat4(), localData);
    }

    return this;
  };


  setParent(parentNode) {
    if (this.parentNode) {
      const index = this.parentNode.children.indexOf(this);
      if (index) {
        this.parentNode.children.splice(index, 1);
      }
    }
    this.parentNode = parentNode;
    this.parentNode.addChild(this);
    return this;
  };


  addChild(childNode) {
    this.children.push(childNode);
  };


  setTransform(tx, ty, tz, sx, sy, sz, ax, ay, az) {
    this._localMatrix.setTranslate(tx, ty, tz)
    .scale(sx, sy, sz).rotate(ax, ay, az);

    return this;
  };


  computeWorldMatrix() {
    if (this.parentNode) {
      const worldMatrix = Object.assign(new Mat4(), this.parentNode.localMatrix);
      this.localMatrix = worldMatrix.mul(this._localMatrix);
    } else {
      this.localMatrix = this._localMatrix;
    }
    if(this.mesh) {
      this.mesh.setModel(this.localMatrix);
    }
    
    this.children.forEach(child => child.computeWorldMatrix());

    return true;
  };
}