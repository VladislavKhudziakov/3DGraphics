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
    const g = app.getGl();

    const program = new ShaderProgram(g, data.vShader, data.fShader).use();
    const mesh = new Mesh(g, JSON.parse(data.mesh), 3)
    .setTransform(0, 0, 100, 1, 1, 1, 0, 0, 0);
    const space = new Projection(g).setPerspective(100, 1, 2000);
    const camera = new Camera().setModel(0, 70, 300, 0, 30, 0)
    .setTarget(0, 0, 0).setUp(0, 1, 0).updateView();
    const light = new LightSource(200, 200, 30, 1, 1, 1, 30);
    
    app.enableDepthTest();
    app.clearColor("0 0 0 1");
    app.clearDepth();
    
    const vertices = mesh.file.vertices;
    const colors = mesh.file.colors;
    const normals =  mesh.file.normals;

    const gl = app.getGl();

    app.perspective = space.projection;
    app.view = camera.view;
    app.cameraPosition = camera.position;
    app.model = mesh.model;
    
    const modelCopy = Object.assign(new Mat4(), app.model);
    modelCopy.inverse().transpose();
    
    app.setMVP(app.mvp.elements);

    program.addVBO('a_Position', vertices, 3).addVBO('a_Color', colors, 3)
    .addVBO('a_Normal', normals, 3).addUniform('u_MVP', app.mvp, 'matf', 4)
    .addUniform('u_MVP', app.mvp, 'matf', 4)
    .addUniform('u_RTModel', modelCopy, 'matf', 4)
    .addUniform('u_Model', app.model, 'matf', 4)
    .addUniform('u_LightPosition', light.position, 'vecf', 3)
    .addUniform('u_CameraPosition', camera.position, 'vecf', 3)
    .addUniform('u_LightColor', light.color, 'vecf', 3)
    .addUniform('u_HighlightPower', light.power, 'f');

    mesh.draw();
  });
}