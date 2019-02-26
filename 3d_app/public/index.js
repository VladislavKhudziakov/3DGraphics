import {App} from "../src/js/app.js"
import { Vec3 } from "../lib/vector3.js";
import { Mat4 } from "../lib/matrix4.js";

document.addEventListener('DOMContentLoaded', main);

function main() {
  const app = new App('canvas');
  app.loadFiles(
    '../src/shaders/vShader2.vert',
    '../src/shaders/fShader2.frag',
    '../src/meshes/fModel.json')
  .then(data => {
    app.addVertShader(data.vShader, 'vShader3D');
    app.addFragShader(data.fShader, 'fShader3D');
    app.addMesh(data.mesh, 'model');
    app.addProgram(
      app.vShaders.vShader3D, app.fShaders.fShader3D, 'program3D'
    );
    
    app.enableDepthTest();
    app.clearColor("0 0 0 1");
    app.clearDepth();

    app.applyProgram(app.programs.program3D);
    const currProgram = app.programs.program3D;
    const vertices = app.meshes.model.vertices;
    const colors = app.meshes.model.colors;
    const normals = app.meshes.model.normals;

    const gl = app.getGl();

    /**
     * TODO: think over this shit
     */
    app.setPerspective(100, 1, 2000);
    app.transformModel(0, 0, 130, 1, 1, 1, 0, 0, 0);
    app.setCameraModel(0, 70, 300, 0, 30, 0);
    
    const modelCopy = Object.assign(new Mat4(), app.model);
    
    modelCopy.inverse().transpose();
    
    const cameraTarget = { 
      x: app.model.elements[12], 
      y: app.model.elements[13], 
      z: app.model.elements[14]
    };

    app.setCameraTarget(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    app.setCameraUp(0, 1, 0);
    app.setVew();
    
    app.setMVP(app.mvp.elements);

    app.initFloatArrayAttributeBuffer(currProgram, 'a_Position', vertices, 3);
    app.initFloatArrayAttributeBuffer(currProgram, 'a_Color', colors, 3);
    app.initFloatArrayAttributeBuffer(currProgram, 'a_Normal', normals, 3);
    
    app.initMatrixUniform(currProgram, 'u_MVP', app.mvp.elements, 4);
    app.initMatrixUniform(currProgram, 'u_RTModel', modelCopy.elements, 4);
    app.initMatrixUniform(currProgram, 'u_Model', app.model.elements, 4);
    app.initVectorUniform(currProgram, 'u_LightPosition', [200, 200, 30], 3);
    app.initVectorUniform(currProgram, 'u_CameraPosition', app.cameraPosition.elements, 3);
    app.initVectorUniform(currProgram, 'u_LightColor', [1, 1, 1], 3);
    app.initFloatUniform(currProgram, 'u_HighlightPower', 30);

    app.drawMeshArr(app.meshes.model, 3, gl.TRIANGLES);
  });
}