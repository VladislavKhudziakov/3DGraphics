import { Mat4 } from "../../lib/matrix4.js";

export class Node {
  /**
   * продумать взаимодействие с моделью + отправку все в буферы и униформы
   * переделать нахуй всю прилагу?????
   * передаем меш, родительский нод
   * меш нужен для получения данных о вершине
   * нужен вспомогательный класс для модели???
   * 
   */
  constructor(localMesh, parentNode) {
    this.parentNode = parentNode;
    this.mesh = localMesh;
    if (this.parentNode) {
      this.worldMatrix = this.parentNode.mesh.model;
    }
    this.localMatrix = Object.assign(new Mat4(), this.mesh.model);
    this.localMatrix_ = Object.assign(new Mat4(), this.mesh.model);
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
    if (this.worldMatrix) {
      const worldMatrix = Object.assign(new Mat4(), this.worldMatrix);
      this.localMatrix = worldMatrix.mul(this.localMatrix_);
      this.mesh.model = this.localMatrix;
    }
    
    this.children.forEach(child => {
      child.worldMatrix = this.mesh.model;
      child.computeWorldMatrix();
    });

    return true;
  };
}