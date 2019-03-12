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
    for (let i = 0; i < MaterialsNames.length; i++) {
      const url = `${folderPath}${MaterialsNames[i]}`;
      const file = await this.loadFile(url).catch(console.error);

      const materialObj = JSON.parse(file);

      const vShader = this.shaders.find(
        shader => shader.fileName === materialObj.vertexShader);
      const fShader = this.shaders.find(
        shader => shader.fileName === materialObj.fragmentShader);
      
      const mesh = new Mesh(
        this.gl, materialObj, vShader, fShader, this.scene)
        .compileShaderProgram();
      console.log(mesh.program);
      
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
      const texture = new Texture(gl, img, texturesNames[i])
      .createImageTexture(false);
      this.textures.push(texture);
    }

    return this.textures;
  };

  createScene() {
    this.scene = new Scene(this.gl);
  };
}