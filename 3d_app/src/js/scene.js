import {Mat4} from "../../lib/matrix4.js";
import { Projection } from "./space.js";
import { Camera } from "./camera.js";
import { LightSource } from "./lightSource.js";

export class Scene {

  constructor(app, materials) {
    this.app = app;
    this.gl = app.getGl();
    this.drawOrder = [];
    this.lights = {};
    this.materials = materials;

    this.projection = null;
    this.camera = null;
    this.projectionView = null;
    this.node = null;

    return this;
  };


  addMesh(mesh) {
    this.meshes[mesh.name] = mesh;

    return this;
  };


  initMeshes() {
    for (let i = 0; i < this.materials.length; i++) {
      const material = this.materials[i];
    }
  };


  addLight(light, name) {
    this.lights[name] = light;

    return this;
  };


  setPerspectiveProjection(fov, near, far) {
    const gl = this.gl;
    this.projection = new Projection(gl).setPerspective(fov, near, far);

    return this;
  };


  setOrthographicProjection(left, right, top, bottom, near, far) {
    this.projection = new Projection(gl).setOrtho(left, right, top, bottom, near, far);

    return this;
  };

  
  setCamera(
    cX, cY, cZ, cAX, cAY, cAZ, tX, tY, tZ, upX, upY, upZ) {
    this.camera = new Camera().setModel(cX, cY, cZ, cAX, cAY, cAZ)
    .setTarget(tX, tY, tZ).setUp(upX, upY, upZ).updateView();
    
    return this;
  };


  setLight(x, y, z, r, g, b, p) {
    this.light = new LightSource(x, y, z, r, g, b, p);
  };


  computeProjectionView() {
    this.projectionView = new Mat4().mul(this.projection.projection).mul(this.camera.view);

    return this;
  };


  setNode(node) {
    this.node = node;

    return this;
  };


  clearColor(r, g, b, a) {
    const gl = this.gl;
    
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return this;
  };


  clearDepth() {
    const gl = this.gl;
    gl.clear(gl.DEPTH_BUFFER_BIT);

    return this;
  };


  enableDepthTest() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);

    return this;
  };


  getGl() {
    return this.gl;
  };


  drawScene() {

    for (let i = 0; i < this.materials.length; i++) {
      const mesh = this.materials[i];
      mesh.useTexture();
      mesh.useShaderProgram();
      mesh.computeMVP();
      mesh.draw();
    }

    return this;
  };
}