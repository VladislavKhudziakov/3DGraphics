import { Mat4 } from "../../lib/matrix4.js";

export class Node {
  constructor(localMesh, parentNode) {
    this.parentNode = parentNode;
    this.localMesh = localMesh;
    if (this.parentNode) {
      this.parentMesh = this.parentNode.localMesh;
      this.worldMatrix = this.parentMesh.model;
    } else {
      this.worldMatrix = this.localMatrix;
    }
    this.localMatrix = this.localMesh.model;
    

    this.children = [];
  };


  setParent(parentNode) {
    if (this.parentNode) {
      const index = this.parentNode.children.indexOf(this);
      if (index) {
        this.parentNode.children.splice(index, 1);
      }
    }
    this.parentNode = parentNode;
    this.parentNode.addChildren(this);
    return this;
  };


  addChildren(childrenNode) {
    this.children.push(childrenNode);
  };


  computeWorldMatrix() {
    if(this.worldMatrix) {
      this.localMatrix.mul(this.worldMatrix);
      console.log(this.localMatrix);
    } else {
      this.worldMatrix = new Mat4();
    }

    this.children.forEach(child => child.computeWorldMatrix());

    return true;
  };
}