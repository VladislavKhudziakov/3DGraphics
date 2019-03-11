import {Mat4} from "../../lib/matrix4.js";

export class App {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    this._gl = canvas.getContext('webgl');
    this.meshes = {};
    this.drawOrder = [];
    this.lights = {};

    this.projection = null;
    this.camera = null;
    this.projectionView = null;
    this.node = null;
    this.model = new Mat4();
  };


  async loadFiles(vShader, fShader, meshFile) {
    const vShaderSource = await this.loadFile(vShader).catch(console.error);
    const fShaderSource = await this.loadFile(fShader).catch(console.error);
    const mesh = await this.loadFile(meshFile).catch(console.error);

    return {
      vShader: vShaderSource,
      fShader: fShaderSource,
      mesh: mesh
    }
  };


  addMesh(mesh, name) {
    this.meshes[name] = mesh;

    return this;
  };


  addLight(light, name) {
    this.lights[name] = light;

    return this;
  };


  setProjection(projection) {
    this.projection = projection;

    return this;
  };


  setCamera(camera) {
    this.camera = camera;

    return this;
  };


  computeProjectionView() {
    this.projectionView = new Mat4().mul(this.projection.projection).mul(this.camera.view);

    return this;
  };


  setModel(model) {
    this.model = model;

    return this;
  };

  setNode(node) {
    this.node = node;
  }


  clearColor(colorString) {
    const gl = this._gl;
    const color = colorString.split(' ');
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return this;
  };


  clearDepth() {
    const gl = this._gl;
    gl.clear(gl.DEPTH_BUFFER_BIT);

    return this;
  };


  enableDepthTest() {
    const gl = this._gl;
    gl.enable(gl.DEPTH_TEST);

    return this;
  };


  getGl() {
    return this._gl;
  };


  drawScene() {
    for (const key in this.meshes) {
      if (this.meshes.hasOwnProperty(key)) {
        const currMesh = this.meshes[key];
        currMesh.computeMVP();
        currMesh.draw();
      }
    }
  }


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

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => {
        resolve(image);
      });
    });
  }
}