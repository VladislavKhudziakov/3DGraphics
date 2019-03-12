import { Scene } from "../src/js/scene.js"
import { Mat4 } from "../lib/matrix4.js";
import { ShaderProgram } from "../src/js/shaderProgram.js";
import { Mesh } from "../src/js/mesh.js";
import { Projection } from "../src/js/space.js";
import { Camera } from "../src/js/camera.js";
import { LightSource } from "../src/js/lightSource.js";
import { Vec3 } from "../lib/vector3.js";
import { Node } from "../src/js/node.js";
import { Texture } from "../src/js/texture.js";
import { Framebuffer } from "../src/js/framebuffer.js";
import { Renderbuffer } from "../src/js/renderbuffer.js";
import { App } from "../src/js/app.js";


document.addEventListener('DOMContentLoaded', main);

const fshadersNames = ["fShader1.frag", "fShader2.frag"];
const vShadersNames = ["vShader1.vert", "vShader2.vert"];
const textures = ["f-texture.png", "keyboard.jpg"];
const materials = ["cube.json"];

// const app = new App('canvas');
// app.loadShaders(vShadersNames, './shaders/', 'vertex')
// .then(() => app.loadShaders(fshadersNames, './shaders/', 'fragment'))
// .then( () => app.loadMaterials(materials, './materials/'));
// // .then(() => app.loadTextures(textures, './img/'))
// // .then(() => {console.log(app.textures);
// // });


function main() {
  const files = [
    '../src/shaders/vShader2.vert',
    '../src/shaders/fShader2.frag',
    '../src/meshes/cubeModel.json'
  ];

  const scene = new Scene('canvas');
  scene.loadFiles(
    '../src/shaders/vShader2.vert',
    '../src/shaders/fShader2.frag',
    '../src/meshes/cubeModel.json')
  .then(data => {
    const gl = scene.getGl();

    const meshData = JSON.parse(data.mesh);    
    const projection = new Projection(gl).setPerspective(100, 1, 2000);
    const camera = new Camera().setModel(0, 200, 250, 0, 0, 0)
    .setTarget(0, 0, 0).setUp(0, 1, 0).updateView();
    const program = new ShaderProgram(gl, data.vShader, data.fShader).use();

    scene.setProjection(projection).setCamera(camera).computeProjectionView();

    const cubeMesh = new Mesh(gl, meshData, 3, program, scene);
    const light = new LightSource(200, 200, 10, 1, 1, 1, 10);

    scene.addLight(light, 'gLight').addMesh(cubeMesh, 'cubeMesh');
    
    return scene.loadImage("./img/keyboard.jpg");
  })
  .then(img => {
    const gl = scene.getGl();
    
    const texture = new Texture(gl, img);

    let fbTexture = new Texture(gl).createEmptyTexture(256, 256, 0, 0);
    let renderBufffer = new Renderbuffer(gl).create();
    let framebuffer = new Framebuffer(gl).create()
    .setTexture(fbTexture).setRenderbuffer(renderBufffer);

    scene.meshes.cubeMesh.setTexture(texture);
    scene.meshes.cubeMesh.texture.createImageTexture();
    draw(50, true);
    let angle = 0;
    requestAnimationFrame(rotate);
    function rotate() { 
      angle = angle >= 360 ? 0 : angle + 0.5;
      draw(angle, false);
      requestAnimationFrame(rotate);
    }

    function draw(a, isFirst) {
      if (!isFirst) {
        texture.bind();
        framebuffer.bind();
      }
      
      let transformation = new Mat4().setTransform(0, 0, 0, 200, 200, 200, a, a, 0);
      scene.meshes.cubeMesh.setModel(transformation);
      scene.enableDepthTest().clearColor("0.5 0.5 1.0 1").clearDepth();
      scene.drawScene();

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
      gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture.texture);
      transformation = new Mat4().setTransform(0, 0, 0, 200, 200, 200, a, a, 0);
      scene.meshes.cubeMesh.setModel(transformation);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      scene.enableDepthTest().clearColor("1 1 0.5 1").clearDepth();
      scene.drawScene();
    }
    
  });
}