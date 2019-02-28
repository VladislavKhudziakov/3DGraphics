import {Mat4} from "../../lib/matrix4.js";

export class App {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    this._gl = canvas.getContext('webgl');
    this.meshes = {};

    this.perspective = new Mat4();
    this.view = new Mat4();
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


  addMesh(mesh, meshName) {
    this.meshes[meshName] = mesh;
  };


  // set perspective(perspective) {
  //   this.perspective = perspective;

  // };


  // set view(view) {
  //   this.view = view;
  // };


  // set model(model) {
  //   this.model = model;
  // };


  clearColor(colorString) {
    const gl = this._gl;
    const color = colorString.split(' ');
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };


  clearDepth() {
    const gl = this._gl;
    gl.clear(gl.DEPTH_BUFFER_BIT);
  };


  enableDepthTest() {
    const gl = this._gl;
    gl.enable(gl.DEPTH_TEST);
  };


  getGl() {
    return this._gl;
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
}