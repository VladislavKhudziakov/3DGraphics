import { Scene } from "./scene.js";
import { Shader } from "./shader.js";
import { Mesh } from "./mesh.js";
import { Texture } from "./texture.js";

export class App {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    this.gl = canvas.getContext('webgl');
    this.files = [];

    this.shaders = [];
    this.textures = [];
    this.meshes = [];
    
    this.scene = undefined;
    
    return this;
  };


  loadFile(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.send();

      xhr.onload = function() {
        if (xhr.status !== 200) {
          reject(`error: ${xhr.status} ${xhr.statusText}`);
        } else {
          resolve(xhr.responseText);
        }
      };

      xhr.onerror = function() {
        reject(`error: ${xhr.status} ${xhr.statusText}`);
      };

    });
  };


  async loadShaders(shadersNames, folderPath, type) {
    const gl = this.gl;

    for (let i = 0; i < shadersNames.length; i++) {
      const url = `${folderPath}${shadersNames[i]}`;
      const file = await this.loadFile(url).catch(console.error);
      const shader = new Shader(gl, type, file, shadersNames[i]).compile();
      this.shaders.push(shader);
    }

    return this.shaders;
  };


  async loadMaterials(MaterialsNames, folderPath) {
    const gl = this.gl;

    for (let i = 0; i < MaterialsNames.length; i++) {
      const url = `${folderPath}${MaterialsNames[i]}`;
      const file = await this.loadFile(url).catch(console.error);

      const material = JSON.parse(file);

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
      
      // console.log(material.defTransform);
      let [tx, ty, tz, sx, sy, sz, ax, ay, az] = material.defTransform;

      mesh.setTransform(tx, ty, tz, sx, sy, sz, ax, ay, az);
      this.meshes.push(mesh);
    }

    return this.meshes;
  };


  loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => {
        resolve(image);
      });
    });
  };


  async loadTextures(texturesNames, folderPath) {
    const gl = this.gl;
    for (let i = 0; i < texturesNames.length; i++) {
      const url = `${folderPath}${texturesNames[i]}`;

      const img = await this.loadImage(url).catch(console.error);

      const texture = new Texture(
        gl, img, texturesNames[i]).createImageTexture();

      this.textures.push(texture);
    }

    return this.textures;
  };


  getGl() {
    return this.gl;
  };


  createScene() {
    this.scene = new Scene(this);

    return this;
  };


  setScenePerspective(fov, near, far) {
    this.scene.setPerspectiveProjection(fov, near, far);

    return this;
  };


  setSceneOrtho(left, right, top, bottom, near, far) {
    this.scene.setOrthographicProjection(left, right, top, bottom, near, far);

    return this;
  };


  setSceneCamera(
    cX, cY, cZ, cAX, cAY, cAZ, tX, tY, tZ, upX, upY, upZ) {
    this.scene.setCamera(cX, cY, cZ, cAX, cAY, cAZ, tX, tY, tZ, upX, upY, upZ);
    
    return this;
  };


  setSceneLight() {
    this.scene.setLight(x, y, z, r, g, b, p);

    return this;
  };


  computeSceneProjectionView() {
    this.scene.computeProjectionView();

    return this;
  };


  clearSceneColor(r = 0, g = 0, b = 0, a = 1) {
    this.scene.clearColor(r, g, b, a);

    return this;
  };


  clearSceneDepth() {
    this.scene.enableDepthTest();
    this.scene.clearDepth();

    return this;
  };


  clearSceneBuffers() {
    this.clearSceneColor();
    this.clearSceneDepth();

    return this;
  };


  drawScene() {
    this.scene.drawScene();

    return this;
  };


  getMesh(name) {
    return this.meshes.find(mesh => mesh.name === name);
  };


  getScene() {
    return this.scene;
  };
}