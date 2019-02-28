import {App} from "../src/js/app.js"
import { Mat4 } from "../lib/matrix4.js";
import { ShaderProgram } from "../src/js/shaderProgram.js";
import { Mesh } from "../src/js/mesh.js";
import { Projection } from "../src/js/space.js";
import { Camera } from "../src/js/camera.js";
import { LightSource } from "../src/js/lightSource.js";

document.addEventListener('DOMContentLoaded', main);

function main() {
  const app = new App('canvas');
  app.loadFiles(
    '../src/shaders/vShader2.vert',
    '../src/shaders/fShader2.frag',
    '../src/meshes/fModel.json')
  .then(data => {
    const gl = app.getGl();

    const program = new ShaderProgram(gl, data.vShader, data.fShader).use();
    const mesh = new Mesh(gl, JSON.parse(data.mesh), 3, program)
    .setTransform(0, 0, 100, 1, 1, 1, 40, -20, 0);
    const space = new Projection(gl).setPerspective(100, 1, 2000);
    const camera = new Camera().setModel(30, 70, 300, 0, 30, 0)
    .setTarget(
      mesh.position.elements[0],
      mesh.position.elements[1], 
      mesh.position.elements[2]
      ).setUp(0, 1, 0).updateView();
    const light = new LightSource(200, 200, 10, 1, 1, 1, 10);
    
    app.enableDepthTest();
    app.clearColor("0 0 0 1");
    app.clearDepth();
    
    const vertices = mesh.file.vertices;
    const colors = mesh.file.colors;
    const normals =  mesh.file.normals;

    app.perspective = space.projection;
    app.view = camera.view;
    app.cameraPosition = camera.position;
    app.model = mesh.model;
    
    const modelCopy = Object.assign(new Mat4(), app.model);
    modelCopy.inverse().transpose();
    
    // const gModel = new Mat4();
    // gModel.setTranslate(10, 20, 30);
    
    mesh.setMVP(space.projection, camera.view);
    app.setMVP(app.mvp.elements);
    
    mesh.program.initVBO('a_Position', vertices, 3).initVBO('a_Color', colors, 3)
    .initVBO('a_Normal', normals, 3).initUniform('u_MVP', mesh.mvp, 'matf', 4)
    .initUniform('u_MVP', app.mvp, 'matf', 4)
    .initUniform('u_RTModel', modelCopy, 'matf', 4)
    .initUniform('u_Model', app.model, 'matf', 4)
    .initUniform('u_LightPosition', light.position, 'vecf', 3)
    .initUniform('u_CameraPosition', camera.position, 'vecf', 3)
    .initUniform('u_LightColor', light.color, 'vecf', 3)
    .initUniform('u_HighlightPower', light.power, 'f');

    mesh.draw();
  });
}