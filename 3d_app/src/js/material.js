import { Mesh } from "./mesh.js";
<<<<<<< HEAD
import { Mat4 } from "../../lib/matrix4.js";
import { Node } from "./node.js";


export class Material {
  constructor(gl, scene, name) {
    this.gl = gl;
    this.name = name;
    this.scene = scene;
    this.objects = [];
=======

export class Material {
  constructor(scene, name) {
    this.name = name;
    this.scene = scene;
    this.materials = [];
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
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
<<<<<<< HEAD
      this.shaders = this.shaders.concat(shader);
=======
      this.shaders.concat(shader);
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
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
<<<<<<< HEAD
      this.textures = this.textures.concat(texture);
=======
      this.textures.concat(texture);
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
    }

    return this;
  };
  

  setScene(scene) {
    this.scene = scene;

<<<<<<< HEAD
    this.scene.addMaterial(this);
=======
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
    return this;
  };


  setMeshes(meshes) {
    this.meshes = meshes;

    return this;
  };


  addMesh(mesh) {
    this.meshes.push(mesh);
  };


<<<<<<< HEAD
  setMeshTexture(meshName, texture) {
    const mesh = this.getMesh(meshName);
    
    if (mesh) {
      mesh.setTexture(texture);
    }
=======
  setMaterials(materials) {
    this.materials = materials;
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7

    return this;
  };


<<<<<<< HEAD
  getMesh(name) {
    return this.meshes.find(mesh => mesh.name === name);
  };


  getNode(name) {
    return this.nodes.find(node => node.name === name);
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
=======
  addMaterial(material) {
    this.materials.push(material);
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7

    return this;
  };


  initMeshes() {
<<<<<<< HEAD
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
=======
    for (let i = 0; i < this.materials.length; i++) {
      const material = this.materials[i];

      const vShader = this.shaders.find(
        shader => shader.fileName === material.vertexShader);

      const fShader = this.shaders.find(
        shader => shader.fileName === material.fragmentShader);

      let texture;

      if (material.textureSampler) {
        texture = this.textures.find(
          currTexture => currTexture.fileName === material.textureSampler);
      }

      const mesh = new Mesh(
        gl, material, vShader, fShader, this.scene).compileShaderProgram();
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7

      if (texture) {
          mesh.setTexture(texture);
      }

<<<<<<< HEAD
      let [tx, ty, tz, sx, sy, sz, ax, ay, az] = object.defTransform;
=======
      let [tx, ty, tz, sx, sy, sz, ax, ay, az] = material.defTransform;
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7

      const modelMatrix = new Mat4().setTransform(
        tx, ty, tz, 1, 1, 1, ax, ay, az);
      
      mesh.setTransform(0, 0, 0, sx, sy, sz, 0, 0, 0);

<<<<<<< HEAD
      const modelNode = new Node(modelMatrix, null, object.name + "-Model");
      const meshNode = new Node(mesh, modelNode, object.name);
=======
      const modelNode = new Node(modelMatrix, null, material.name + "Model");
      const meshNode = new Node(mesh, modelNode, material.name);
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
      
      this.nodes.push(modelNode);
      this.nodes.push(meshNode);
      this.meshes.push(mesh);
    }
<<<<<<< HEAD
    
=======

>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
    return this;
  };


  createNodesTree() {
<<<<<<< HEAD
    const rootNode = new Node(new Mat4(), null, 'root-Model');
    this.nodes.push(rootNode);

    this.objects.forEach(object => {
      const parentModelNode = this.nodes.find(
        node => object.parentNode + "-Model" === node.name);
      
      const currModelNode = this.nodes.find(
        node => object.thisNode + "-Model" === node.name);
=======
    const rootNode = new Node(new Mat4(), null, 'rootModel');
    this.nodes.push(rootNode);

    this.materials.forEach(material => {
      const parentModelNode = this.nodes.find(
        node => material.parentNode + "Model" === node.name);
      
      const currModelNode = this.nodes.find(
        node => material.thisNode + "Model" === node.name);
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
      
      currModelNode.setParent(parentModelNode);
    });
  };


  getNode(name) {
    return this.nodes.find(node => node.name === name);
  };


  drawMaterial() {
<<<<<<< HEAD
    const root = this.getNode('root-Model');
    root.computeWorldMatrix();
    
=======
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
    this.meshes.forEach(mesh => {
      mesh.useTexture();
      mesh.useShaderProgram();
      mesh.computeMVP();
      mesh.draw();
    });

    return this;
<<<<<<< HEAD
  };
=======
  }
>>>>>>> 454b7b25b460646d09817ff67d0513167ab7a1a7
}