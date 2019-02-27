import {webglController} from "../../lib/webgl-controller.js";
import {Mat4} from "../../lib/matrix4.js";
import{Vec3} from "../../lib/vector3.js"

export class App {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId); 
    this._gl = canvas.getContext('webgl');
    this.meshes = {};
    this.programs = {};

    this.attributes = {};
    this.uniforms = {};

    this.perspective = new Mat4();
    this.cameraModel = new Mat4();
    this.cameraPosition = new Vec3();
    this.cameraTarget = new Vec3();
    this.cameraUp = new Vec3();
    this.model = new Mat4();
    this.mvp = new Mat4();
  };


  async loadFiles(vShader, fShader, meshFile) {
    const vShaderSource = await this.loadFile(vShader).catch(console.log);
    const fShaderSource = await this.loadFile(fShader).catch(console.log);
    const mesh = await this.loadFile(meshFile).catch(console.log);

    return {
      vShader: vShaderSource,
      fShader: fShaderSource,
      mesh: mesh
    }
  };


  addMesh(mesh, meshName) {
    this.meshes[meshName] = JSON.parse(mesh);
  };

  
  addProgram(vShader, fShader, programName) {
    const gl = this._gl;
    const program = webglController.initProgram(gl, vShader, fShader);
    this.programs[programName] = program;
  };


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


  addUniform(uniformName, uniform) {
    const gl = this._gl;
    this.uniforms[uniformName] = uniform;
  };



  setMVP() {
    this.mvp = new Mat4();    
    this.mvp.mul(this.perspective).mul(this.view)
    .mul(this.model);
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