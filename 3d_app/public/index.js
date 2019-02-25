import {App} from "../src/js/app.js"
import { webglController } from "../lib/webgl-controller.js";
import { Mat4 } from "../lib/matrix4.js";
import { Vec3 } from "../lib/vector3.js";

document.addEventListener('DOMContentLoaded', main);

function main() {
  const app = new App('canvas');
  app.loadFiles(
    '../src/shaders/vShader1.vert',
    '../src/shaders/fShader1.frag',
    '../src/meshes/model.json')
  .then(data => {
    app.addVertShader(data.vShader, 'triangleVShader');
    app.addFragShader(data.fShader, 'triangleFShader');
    app.addMesh(data.mesh, 'triangle');
    app.addProgram(app.vShaders.triangleVShader, app.fShaders.triangleFShader, 'triangleProgram');

    app.enableDepthTest();
    app.clearColor("0 0 0 1");
    app.clearDepth();

    app.applyProgram(app.programs.triangleProgram);

    const gl = app.getGl();
    
    app.attributes.a_Position = webglController.initArrayBuffer(
      gl, app.programs.triangleProgram, 'a_Position', 
      new Float32Array(app.meshes.triangle.vertices), 
      2, gl.FLOAT, false
    );
    
    app.attributes.a_Color = webglController.initArrayBuffer(
      gl, app.programs.triangleProgram, 'a_Color', 
      new Float32Array(app.meshes.triangle.colors), 
      3, gl.FLOAT, false
    );

    app.setPerspective(100, 0, 1000);
    app.setCameraModel(10, 20, 30, 0, 0, 0);
    app.setCameraTarget(0, 0, 0);
    app.setCameraUp(0, 1, 0);
    app.setVew();
    app.transformModel(0, 0, 0, 1, 1, 1, 0, 0, 0);
    app.setMVP();
    console.log(app.mvp);
    
    app.drawMeshArr(app.meshes.triangle, 2, gl.TRIANGLES);
  });
}