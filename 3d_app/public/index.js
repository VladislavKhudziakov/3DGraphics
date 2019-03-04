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
    
    const program = new ShaderProgram(gl, data.vShader, data.fShader).use();

    const sunMesh = new Mesh(gl, sphereData, 3, program);
    sunMesh.currRotX = 0;
    sunMesh.currRotY = 0;
    sunMesh.offsetX = 0;
    sunMesh.colorMult = new Vec3(0.4, 0.4, 0);
    sunMesh.colorOffset = new Vec3(0.6, 0.6, 0);
    sunMesh.setTransform(
      sunMesh.offsetX, 0, 0, 1, 1, 1, 
      sunMesh.currRotX, sunMesh.currRotY, 0
    );

    const earthMesh = new Mesh(gl, sphereData, 3, program);
    earthMesh.currRotX = 0;
    earthMesh.currRotY = 0;
    earthMesh.offsetX = 0;
    earthMesh.offsetY = 0;
    earthMesh.offsetZ = 100;
    earthMesh.colorMult = new Vec3(0.8, 0.5, 0.2);
    earthMesh.colorOffset = new Vec3(0.2, 0.5, 0.8);
    earthMesh.setTransform(
      earthMesh.offsetX, earthMesh.offsetY,
      earthMesh.offsetZ, 1, 1, 1, earthMesh.currRotX,
      earthMesh.currRotY, 0
    );

    const moonMesh = new Mesh(gl, sphereData, 3, program);
    moonMesh.currRotX = 0;
    moonMesh.currRotY = 0;
    moonMesh.offsetX = 0;
    moonMesh.offsetY = 0;
    moonMesh.offsetZ = 25;
    moonMesh.colorMult = new Vec3(0.1, 0.1, 0.1);
    moonMesh.colorOffset = new Vec3(0.6, 0.6, 0.6);
    moonMesh.setTransform(
      moonMesh.offsetX, moonMesh.offsetY,
      moonMesh.offsetZ, 1, 1, 1, moonMesh.currRotX,
      moonMesh.currRotY, 0
    );

    const projection = new Projection(gl).setPerspective(100, 1, 2000);

    const camera = new Camera().setModel(0, 200, 1, 0, 0, 0)
    .setTarget(
      0, 0, 0
    ).setUp(0, 1, 0).updateView();

    const light = new LightSource(200, 200, 10, 1, 1, 1, 10);

    const sunNode = new Node(sunMesh, null);
    const earthNode = new Node(earthMesh, sunNode);
    const moonNode = new Node(moonMesh, earthNode);
    sunNode.addChildren(earthNode);
    earthNode.addChildren(moonNode);
    sunNode.computeWorldMatrix();
    console.log(moonNode.localMatrix.elements);
    

    app.enableDepthTest().clearColor("0 0 0 1").clearDepth()
    .addMesh(sunMesh, 'sphereMesh').addMesh(earthMesh, 'earthMesh').addMesh(moonMesh, 'moonMesh')
    .setProjection(projection).setCamera(camera).addLight(light, 'gLight').setNode(sunNode);
    
    app.drawScene();
    let angle = 0;
    // requestAnimationFrame(rotate)
    // function rotate() {
    //   app.enableDepthTest().clearColor("0 0 0 1").clearDepth();
    //   angle++;
    //   sunMesh.setTransform(
    //     sunMesh.offsetX, 0, 0, 1, 1, 1, 
    //     sunMesh.currRotX, angle, 0
    //   );
    //   app.node.computeWorldMatrix();
    //   app.drawScene();
    //   requestAnimationFrame(rotate);
    // }
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