import { Mesh } from "./mesh.js";
import { Mat4 } from "../../lib/matrix4.js";
import { Node } from "./node.js";


export class Material {
  constructor(gl, scene, name) {
    this.gl = gl;
    this.name = name;
    this.scene = scene;
    this.objects = [];
    this.shaders = [];
    this.nodes = [];
    this.meshes = [];
    this.textures = [];
  };


  setShaders(shaders) {
    this.shaders = shaders;

    return this;
  };


  addShader(shader) {
    if (!(shader instanceof Array)) {
      this.shaders.push(shader);
    } else {
      this.shaders = this.shaders.concat(shader);
    }
    
    return this;
  };


  setTextures(textures) {
    this.textures = textures;

    return this;
  };


  addTexture(texture) {
    if (!(texture instanceof Array)) {
      this.textures.push(texture);
    } else {
      this.textures = this.textures.concat(texture);
    }

    return this;
  };
  

  setScene(scene) {
    this.scene = scene;

    this.scene.addMaterial(this);
    return this;
  };


  setMeshes(meshes) {
    this.meshes = meshes;

    return this;
  };


  addMesh(mesh) {
    this.meshes.push(mesh);
  };


  setObjects(objects) {
    this.objects = objects;

    return this;
  };


  addObject(object) {
    if (!(object instanceof Array)) {
      this.object.push(object);
    } else {
      this.objects = this.objects.concat(object);
    }

    return this;
  };


  initMeshes() {
    const gl = this.gl;

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];

      const vShader = this.shaders.find(
        shader => shader.fileName === object.vertexShader);

      const fShader = this.shaders.find(
        shader => shader.fileName === object.fragmentShader);

      let texture;

      if (object.textureSampler) {
        texture = this.textures.find(
          currTexture => currTexture.fileName === object.textureSampler);
      }

      const mesh = new Mesh(
        gl, object, vShader, fShader, this.scene).compileShaderProgram();

      if (texture) {
          mesh.setTexture(texture);
      }

      let [tx, ty, tz, sx, sy, sz, ax, ay, az] = object.defTransform;

      const modelMatrix = new Mat4().setTransform(
        tx, ty, tz, 1, 1, 1, ax, ay, az);
      
      mesh.setTransform(0, 0, 0, sx, sy, sz, 0, 0, 0);

      const modelNode = new Node(modelMatrix, null, object.name + "-Model");
      const meshNode = new Node(mesh, modelNode, object.name);
      
      this.nodes.push(modelNode);
      this.nodes.push(meshNode);
      this.meshes.push(mesh);
    }
    
    return this;
  };


  createNodesTree() {
    const rootNode = new Node(new Mat4(), null, 'root-Model');
    this.nodes.push(rootNode);

    this.objects.forEach(object => {
      const parentModelNode = this.nodes.find(
        node => object.parentNode + "-Model" === node.name);
      
      const currModelNode = this.nodes.find(
        node => object.thisNode + "-Model" === node.name);
      
      currModelNode.setParent(parentModelNode);
    });
  };


  getNode(name) {
    return this.nodes.find(node => node.name === name);
  };


  drawMaterial() {
    const root = this.getNode('root-Model');
    root.computeWorldMatrix();
    
    this.meshes.forEach(mesh => {
      mesh.useTexture();
      mesh.useShaderProgram();
      mesh.computeMVP();
      mesh.draw();
    });

    return this;
  }
}