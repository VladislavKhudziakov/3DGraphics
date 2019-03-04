import { App } from "../src/js/app.js"
import { Mat4 } from "../lib/matrix4.js";
import { ShaderProgram } from "../src/js/shaderProgram.js";
import { Mesh } from "../src/js/mesh.js";
import { Projection } from "../src/js/space.js";
import { Camera } from "../src/js/camera.js";
import { LightSource } from "../src/js/lightSource.js";
import { Vec3 } from "../lib/vector3.js";

document.addEventListener('DOMContentLoaded', main);

function main() {
  const app = new App('canvas');
  app.loadFiles(
    '../src/shaders/vShader2.vert',
    '../src/shaders/fShader2.frag',
    '../src/meshes/fModel.json')
  .then(data => {
    const gl = app.getGl();
    const sphereData = createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
    sphereData.vertices = sphereData.position;
    sphereData.colors = sphereData.color;
    sphereData.normals = sphereData.normal;

    const cubeData = createFlattenedVertices(gl, primitives.createCubeVertices(20));
    cubeData.vertices = cubeData.position;
    cubeData.colors = cubeData.color;
    cubeData.normals = cubeData.normal;
    
    const coneData = createFlattenedVertices(gl, primitives.createTruncatedConeVertices(10, 0, 20, 12, 1, true, false));
    coneData.vertices = coneData.position;
    coneData.colors = coneData.color;
    coneData.normals = coneData.normal;
    
    const program = new ShaderProgram(gl, data.vShader, data.fShader).use();

    // const sphereMesh = new Mesh()
    const mesh = new Mesh(gl, JSON.parse(data.mesh), 3, program)
    .setTransform(0, 0, -100, 1, 1, 1, 0, -20, 0);

    const sphereMesh = new Mesh(gl, sphereData, 3, program);
    sphereMesh.currRotX = 0;
    sphereMesh.currRotY = 0;
    sphereMesh.offsetX = 0;
    sphereMesh.colorMult = new Vec3(0.5, 1, 0.5);

    sphereMesh.setTransform(sphereMesh.offsetX, 0, 0, 2, 2, 2, sphereMesh.currRotX, sphereMesh.currRotY, 0);

    const cubeMesh = new Mesh(gl, cubeData, 3, program);
    cubeMesh.currRotX = 0;
    cubeMesh.currRotY = 0;
    cubeMesh.offsetX = -100;
    cubeMesh.colorMult = new Vec3(1, 0.5, 0.5);
    cubeMesh.setTransform(cubeMesh.offsetX, 0, 0, 2, 2, 2, cubeMesh.currRotX, cubeMesh.currRotY, 0);

    const coneMesh = new Mesh(gl, coneData, 3, program);
    coneMesh.currRotX = 0;
    coneMesh.currRotY = 0;
    coneMesh.offsetX = 100;
    coneMesh.colorMult = new Vec3(0.5, 0.5, 1);
    coneMesh.setTransform(coneMesh.offsetX, 0, 0, 2, 2, 2, coneMesh.currRotX, coneMesh.currRotY, 0);

    const projection = new Projection(gl).setPerspective(100, 1, 2000);
    const camera = new Camera().setModel(0, 70, 200, 0, 0, 0)
    .setTarget(
      sphereMesh.position.elements[0],
      sphereMesh.position.elements[1],
      sphereMesh.position.elements[2],
    ).setUp(0, 1, 0).updateView();
    const light = new LightSource(200, 200, 10, 1, 1, 1, 10);
    
    app.enableDepthTest().clearColor("0 0 0 1").clearDepth()
    .setProjection(projection).setCamera(camera)
    .addMesh(sphereMesh, 'sphereMesh').addMesh(cubeMesh, 'cubeMesh')
    .addMesh(coneMesh, 'coneMesh').setProjection(projection)
    .setCamera(camera).addLight(light, 'gLight');
    
    const modelCopy = Object.assign(new Mat4(), mesh.model);
    modelCopy.inverse().transpose();
    
    app.drawScene();
    
    requestAnimationFrame(rotate)
    function rotate() {
      app.enableDepthTest().clearColor("0 0 0 1").clearDepth();
      app.rotateMeshes();
      app.drawScene();
      requestAnimationFrame(rotate);
    }
  });
}

var createFlattenedVertices = function(gl, vertices) {
  return primitives.makeRandomVertexColors(
    primitives.deindexVertices(vertices),
    {
      vertsPerColor: 6,
      rand: function(ndx, channel) {
        return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
      }
    })
};