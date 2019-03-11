import { App } from "../src/js/app.js"
import { Mat4 } from "../lib/matrix4.js";
import { ShaderProgram } from "../src/js/shaderProgram.js";
import { Mesh } from "../src/js/mesh.js";
import { Projection } from "../src/js/space.js";
import { Camera } from "../src/js/camera.js";
import { LightSource } from "../src/js/lightSource.js";
import { Vec3 } from "../lib/vector3.js";
import { Node } from "../src/js/node.js";
import { Texture } from "../src/js/texture.js";


document.addEventListener('DOMContentLoaded', main);

function main() {
  const app = new App('canvas');
  app.loadFiles(
    '../src/shaders/vShader2.vert',
    '../src/shaders/fShader2.frag',
    '../src/meshes/fModel.json')
  .then(data => {
    const gl = app.getGl();

    const meshData = JSON.parse(data.mesh);

    const projection = new Projection(gl).setPerspective(100, 1, 2000);

    const camera = new Camera().setModel(0, 0, 250, 0, 0, 0)
    .setTarget(0, 0, 0).setUp(0, 1, 0).updateView();
    
    const program = new ShaderProgram(gl, data.vShader, data.fShader).use();

    app.setProjection(projection).setCamera(camera).computeProjectionView();

    const fMesh = new Mesh(gl, meshData, 3, program, app);

    const light = new LightSource(200, 200, 10, 1, 1, 1, 10);

    app.addMesh(fMesh, 'fMesh').addLight(light, 'gLight');
    
    return app.loadImage("./img/keyboard.jpg");
  })
  .then(img => {
    const gl = app.getGl();
    const texture = new Texture(gl, img);
    app.meshes.fMesh.setTexture(texture);
    app.meshes.fMesh.texture.create();
    app.enableDepthTest().clearColor("1 0 0 1").clearDepth();
    console.log(gl);
    
    app.drawScene();

    let angle = 0;
    requestAnimationFrame(rotate);
    function rotate() { 
      angle = angle >= 360 ? 0 : angle + 1;
      const transformation = new Mat4().setTransform(0, 0, 0, 1, 1, 1, angle, angle, 0);
      app.meshes.fMesh.setModel(transformation);
      app.enableDepthTest().clearColor("0 0 0 1").clearDepth();
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