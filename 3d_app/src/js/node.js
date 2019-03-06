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

    this.localMatrix = Object.assign(new Mat4(), this.mesh.model);
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
    if (this.parentNode) {
      const worldMatrix = Object.assign(new Mat4(), this.parentNode.mesh.model);
      this.mesh.model = worldMatrix.mul(this.mesh.model);
    }
    console.log(this.mesh.model);
    
    this.children.forEach(child => child.computeWorldMatrix());

    return true;
  };
}