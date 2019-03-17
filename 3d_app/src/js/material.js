import { Mesh } from "./mesh.js";

export class Material {
  constructor(scene, name) {
    this.name = name;
    this.scene = scene;
    this.materials = [];
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
      this.shaders.concat(shader);
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
      this.textures.concat(texture);
    }

    return this;
  };
  

  setScene(scene) {
    this.scene = scene;

    return this;
  };


  setMeshes(meshes) {
    this.meshes = meshes;

    return this;
  };


  addMesh(mesh) {
    this.meshes.push(mesh);
  };


  setMaterials(materials) {
    this.materials = materials;

    return this;
  };


  addMaterial(material) {
    this.materials.push(material);

    return this;
  };


  initMeshes() {
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

      if (texture) {
          mesh.setTexture(texture);
      }

      let [tx, ty, tz, sx, sy, sz, ax, ay, az] = material.defTransform;

      const modelMatrix = new Mat4().setTransform(
        tx, ty, tz, 1, 1, 1, ax, ay, az);
      
      mesh.setTransform(0, 0, 0, sx, sy, sz, 0, 0, 0);

      const modelNode = new Node(modelMatrix, null, material.name + "Model");
      const meshNode = new Node(mesh, modelNode, material.name);
      
      this.nodes.push(modelNode);
      this.nodes.push(meshNode);
      this.meshes.push(mesh);
    }

    return this;
  };


  createNodesTree() {
    const rootNode = new Node(new Mat4(), null, 'rootModel');
    this.nodes.push(rootNode);

    this.materials.forEach(material => {
      const parentModelNode = this.nodes.find(
        node => material.parentNode + "Model" === node.name);
      
      const currModelNode = this.nodes.find(
        node => material.thisNode + "Model" === node.name);
      
      currModelNode.setParent(parentModelNode);
    });
  };


  getNode(name) {
    return this.nodes.find(node => node.name === name);
  };


  drawMaterial() {
    this.meshes.forEach(mesh => {
      mesh.useTexture();
      mesh.useShaderProgram();
      mesh.computeMVP();
      mesh.draw();
    });

    return this;
  }
}