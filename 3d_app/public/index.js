import {App} from "../src/js/app.js"

document.addEventListener('DOMContentLoaded', main);

function main() {
  const app = new App('canvas');
  app.loadFiles(
    '../src/shaders/vShader2.vert',
    '../src/shaders/fShader2.frag',
    '../src/meshes/fModel.json')
  .then(data => {
    app.addVertShader(data.vShader, 'triangleVShader');
    app.addFragShader(data.fShader, 'triangleFShader');
    app.addMesh(data.mesh, 'tri');
    app.addProgram(
      app.vShaders.triangleVShader, 
      app.fShaders.triangleFShader, 
      'triangleProgram'
    );
    
    app.enableDepthTest();
    app.clearColor("0 0 0 1");
    app.clearDepth();

    app.applyProgram(app.programs.triangleProgram);
    const currProgram = app.programs.triangleProgram;
    const vertices = app.meshes.tri.vertices;
    const colors = app.meshes.tri.colors;
    
    const gl = app.getGl();

    /**
     * TODO: think over this shit
     */
    app.setPerspective(100, 1, 2000);
    app.transformModel(-400, 300, 0, 1, 1, 1, 0, 0, 0);
    app.setCameraModel(0, 0, 1000, 0, 0, 0);
    
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
    
    app.initMatrixUniform(currProgram, 'u_MVP', app.mvp.elements, 4);
    
    app.drawMeshArr(app.meshes.tri, 3, gl.TRIANGLES);
  });
}