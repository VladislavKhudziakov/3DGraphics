import { App } from "../src/js/app.js"
import { Mat4 } from "../lib/matrix4.js";
import { ShaderProgram } from "../src/js/shaderProgram.js";
import { Mesh } from "../src/js/mesh.js";
import { Projection } from "../src/js/space.js";
import { Camera } from "../src/js/camera.js";
import { LightSource } from "../src/js/lightSource.js";
import { Vec3 } from "../lib/vector3.js";
import { Node } from "../src/js/node.js";


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

    const projection = new Projection(gl).setPerspective(100, 1, 2000);

    const camera = new Camera().setModel(0, 200, 1, 0, 0, 0)
    .setTarget(0, 0, 0).setUp(0, 1, 0).updateView();
    
    const program = new ShaderProgram(gl, data.vShader, data.fShader).use();

    app.enableDepthTest().clearColor("0 0 0 1").clearDepth()
    .setProjection(projection).setCamera(camera).computeProjectionView();

    const sunMesh = new Mesh(gl, sphereData, 3, program, app);
    sunMesh.colorMult = new Vec3(0.4, 0.4, 0);
    sunMesh.colorOffset = new Vec3(0.6, 0.6, 0);
    sunMesh.setTransform(
      0, 0, 0, 3, 3, 3, 0, 0, 0);

    const earthMesh = new Mesh(gl, sphereData, 3, program, app);
    earthMesh.colorMult = new Vec3(0.8, 0.5, 0.2);
    earthMesh.colorOffset = new Vec3(0.2, 0.5, 0.8);
    earthMesh.setTransform(
      0, 0, 0, 2, 2, 2, 0, 0, 0);

    const moonMesh = new Mesh(gl, sphereData, 3, program, app);
    moonMesh.colorMult = new Vec3(0.1, 0.1, 0.1);
    moonMesh.colorOffset = new Vec3(0.6, 0.6, 0.6);
    moonMesh.setTransform(
      0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0);

    const light = new LightSource(200, 200, 10, 1, 1, 1, 10);
    
    const sunOrbitNode = new Node(new Mat4(), null);
    const earthOrbitNode = new Node(
      new Mat4().setTransform(0, 0, 100, 1, 1, 1, 0, 0, 0), sunOrbitNode);
    const moonOrbitNode = new Node(
      new Mat4().setTransform(0, 0, 45, 1, 1, 1, 0, 0, 0), earthOrbitNode);
    
    
    const sunNode = new Node(sunMesh, sunOrbitNode);
    const earthNode = new Node(earthMesh, earthOrbitNode);
    const moonNode = new Node(moonMesh, moonOrbitNode);
    sunOrbitNode.computeWorldMatrix();
    console.log(moonOrbitNode.localMatrix);
    // const sunNode = new Node(sunMesh, null);
    // const earthNode = new Node(earthMesh, sunNode);
    // const moonNode = new Node(moonMesh, earthNode);
    // sunNode.computeWorldMatrix();

    app.addMesh(sunMesh, 'sphereMesh').addMesh(earthMesh, 'earthMesh').addMesh(moonMesh, 'moonMesh')
    .addLight(light, 'gLight').setNode(sunNode);
    
    app.drawScene();
    let angle = 0;
    requestAnimationFrame(rotate)
    function rotate() {
      app.enableDepthTest().clearColor("0 0 0 1").clearDepth();
      angle++;
      sunOrbitNode.setTransform(
        0, 0, 0, 1, 1, 1, 0, angle, 0);
        earthOrbitNode.setTransform(
        0, 0, 100, 1, 1, 1, 0, angle, 0);
        moonOrbitNode.setTransform(
        0, 0, 45, 1, 1, 1, 0, angle, 0);
      app.node.computeWorldMatrix();
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