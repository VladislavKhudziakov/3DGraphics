import {Mat4} from "../../lib/matrix4.js";

export class Scene {
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


  initMeshes() {
    for (let i = 0; i < this.app.materials.length; i++) {
      const material = this.app.materials[i];
    }
  }


  addLight(light, name) {
    this.lights[name] = light;

    return this;
  };


  setProjection(projection) {
    this.projection = projection;

    return this;
  };


  // setPerspectiveProjection(fov, near, far) {
  //   this.projection = new Projection(gl).setPerspective(fov, near, far);

  //   return this;
  // };


  setCamera(camera) {
    this.camera = camera;
    
    return this;
  };

  
  // setCamera(
  //   cX, cY, cZ, cAX, cAY, cAZ, tX, tY, tZ, upX, upY, upZ) {
  //   this.camera = new Camera().setModel(cX, cY, cZ, cAX, cAY, cAZ)
  //   .setTarget(tX, tY, tZ).setUp(upX, upY, upZ).updateView();
    
  //   return this;
  // }

  computeProjectionView() {
    this.projectionView = new Mat4().mul(this.projection.projection).mul(this.camera.view);

    return this;
  };


  setNode(node) {
    this.node = node;

    return this;
  };


  clearColor(colorString) {
    const gl = this._gl;
    const color = colorString.split(' ');
    
    gl.clearColor(+color[0], +color[1], +color[2], +color[3]);
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