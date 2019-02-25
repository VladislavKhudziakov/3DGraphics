import {webglController} from "../../lib/webgl-controller.js";
import {Mat4} from "../../lib/matrix4.js";
import{Vec3} from "../../lib/vector3.js"

export class App {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId); 
    this._gl = canvas.getContext('webgl');
    this.vShaders = {};
    this.fShaders = {};
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

  
  addVertShader(shaderSource, shaderName) {
    const gl = this._gl;
    const shader = webglController.initShader(
      gl, gl.VERTEX_SHADER, shaderSource
    );
    this.vShaders[shaderName] = shader;
  };
  

  addFragShader(shaderSource, shaderName) {
    const gl = this._gl;
    const shader = webglController.initShader(
      gl, gl.FRAGMENT_SHADER, shaderSource
    );
    this.fShaders[shaderName] = shader;
  };


  addMesh(mesh, meshName) {
    this.meshes[meshName] = JSON.parse(mesh);
  };

  
  addProgram(vShader, fShader, programName) {
    const gl = this._gl;
    const program = webglController.initProgram(gl, vShader, fShader);
    this.programs[programName] = program;
  };


  initFloatArrayAttributeBuffer(program, attribute, data, count) {
    const gl = this._gl;
    const floatData = new Float32Array(data);
    this.attributes[attribute] = webglController.initArrayBuffer(
      gl, program, attribute, floatData, count, gl.FLOAT, false
    );
  };


  initMatrixUniform(program, uniform, data, matrixIndex) {
    const gl = this._gl;
    this.uniforms[uniform] = gl.getUniformLocation(program, uniform);
    const floatData = new Float32Array(data);
    console.log();
    
    switch (matrixIndex) {
      case 2:
        gl.uniformMatrix2fv(this.uniforms[uniform], false, floatData);
        break;
      case 3:
        gl.uniformMatrix3fv(this.uniforms[uniform], false, floatData);
        break;
      case 4:
        gl.uniformMatrix4fv(this.uniforms[uniform], false, floatData);
        break;
      default:
        console.error('invalid matrix index');
        break;
    }
  };


  initVectorUniform(program, uniform, data, vectorIndex) {
    const gl = this._gl;
    this.uniforms[uniform] = gl.getUniformLocation(program, uniform);
    const floatData = new Float32Array(data);
    switch (vectorIndex) {
      case 2:
        gl.uniform2fv(this.uniforms[uniform], false, floatData);
        break;
      case 3:
        gl.uniform3fv(this.uniforms[uniform], false, floatData);
        break;
      case 4:
        gl.uniform4fv(this.uniforms[uniform], false, floatData);
        break;
      default:
        console.error('invalid matrix index');
        break;
    }
  };


  initFloatUniform(program, uniform, data) {
    const gl = this._gl;
    this.uniforms[uniform] = gl.getUniformLocation(program, uniform);
    gl.uniform1f(this.uniforms[uniform], false, data);
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


  addUniform(program, uniformName, uniform) {
    const gl = this._gl;
    const u_unif = gl.getUniformLocation(program, uniform);
    this.uniforms[uniformName] = u_unif;
  };


  applyProgram(program) {
    const gl = this._gl;
    gl.useProgram(program);
  };


  drawMeshArr(mesh, len, primitives) {
    const gl = this._gl;
    gl.drawArrays(primitives, 0, mesh.vertices.length / len);
  };


  setPerspective(fov, near, far) {
    const matrix = new Mat4();
    const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
    this.perspective = matrix.setPerspective(fov, aspect, near, far);
  };


  setCameraModel(x, y, z, angleX, angleY, angleZ) {
    const matrix = new Mat4();
    matrix.rotate(angleX, angleY, angleZ).translate(x, -y, z);

    this.cameraModel = matrix;
    this.cameraPosition = new Vec3(
      this.cameraModel.elements[12],
      this.cameraModel.elements[13],
      this.cameraModel.elements[14]
    );
  };


  setCameraTarget(x, y, z) {
    this.cameraTarget = new Vec3(x, y, z);
  };


  setCameraUp(x, y, z) {
    this.cameraUp = new Vec3(x, y, z);
  };
  

  setVew() {
    const matrix = new Mat4();
    this.view = matrix.setLookAt(
      this.cameraPosition, 
      this.cameraTarget, 
      this.cameraUp
    ).inverse();
  };

  
  transformModel(tX, tY, tZ, sX, sY, sZ, aX, aY, aZ) {
    this.model.scale(sX, sY, sZ).rotate(aX, aY, aZ).translate(tX, -tY, tZ);
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