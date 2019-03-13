
import { Node } from "../src/js/node.js";
import { Framebuffer } from "../src/js/framebuffer.js";
import { Renderbuffer } from "../src/js/renderbuffer.js";
import { App } from "../src/js/app.js";


document.addEventListener('DOMContentLoaded', main);

function main() {
  const fshadersNames = ["fShader1.frag", "fShader2.frag"];
  const vShadersNames = ["vShader1.vert", "vShader2.vert"];
  const textures = ["keyboard.jpg", "f-texture.png"];
  const materials = ["cube.json", "cube2.json"];

  const app = new App('canvas')
  .createScene().setScenePerspective(100, 1, 2000)
  .setSceneCamera(0, 200, 250, 0, 0, 0, 0, 0, 0, 0, 1, 0)
  .computeSceneProjectionView().clearSceneBuffers();
  app.loadShaders(vShadersNames, './shaders/', 'vertex')
  .then(() => app.loadShaders(fshadersNames, './shaders/', 'fragment'))
  .then(() => app.loadTextures(textures, './img/'))
  .then(() => app.loadMaterials(materials, './materials/'))
  .then(() => {
    app.meshes[0].setTransform(-100, 0, 0, 100, 100, 100, 0, 0, 0);
    app.meshes[1].setTransform(100, 0, 0, 100, 100, 100, 0, 0, 0);
    app.clearSceneBuffers().drawScene();
    // app.meshes[0].setTransform(-100, 0, -200, 100, 100, 100, 0, 0, 0);
    // app.meshes[1].setTransform(100, 0, -200, 100, 100, 100, 0, 0, 0);
    // app.drawScene();
  });

  // const scene = new Scene('canvas');
  // scene.loadFiles(
  //   '../src/shaders/vShader2.vert',
  //   '../src/shaders/fShader2.frag',
  //   '../src/meshes/cubeModel.json')
  // .then(data => {
  //   const gl = scene.getGl();

//     const meshData = JSON.parse(data.mesh);

//     const vShader = new Shader(gl, 'vertex', data.vShader, 'vShader2.vert').compile();
//     const fShader = new Shader(gl, 'fragment', data.fShader, 'fShader2.frag').compile();
    
//     const dataObj = {
//       name: "cube",
//       data: meshData,
//       size: 3
//     }
    
//     scene.setPerspectiveProjection(100, 1, 2000)
//     .setCamera(0, 400, 250, 0, 0, 0, 0, 0, 0, 0, 1, 0).computeProjectionView();

//     const cubeMesh = new Mesh(gl, dataObj, vShader, fShader, scene)
//     .compileShaderProgram();
    
//     // const light = new LightSource(200, 200, 10, 1, 1, 1, 10);

//     scene.addMesh(cubeMesh);
    
//     return scene.loadImage("./img/keyboard.jpg");
//   })
//   .then(img => {
//     const gl = scene.getGl();
    
//     const texture = new Texture(gl, img);

//     let fbTexture = new Texture(gl).createEmptyTexture(256, 256, 0, 0);
//     let renderBufffer = new Renderbuffer(gl).create();
//     let framebuffer = new Framebuffer(gl).create()
//     .setTexture(fbTexture).setRenderbuffer(renderBufffer);

//     scene.meshes.cube.setTexture(texture);
//     scene.meshes.cube.texture.createImageTexture();
//     draw(50, true);
//     let angle = 0;
//     requestAnimationFrame(rotate);
//     function rotate() { 
//       angle = angle >= 360 ? 0 : angle + 0.5;
//       draw(angle, false);
//       requestAnimationFrame(rotate);
//     }

//     function draw(a, isFirst) {
//       if (!isFirst) {
//         texture.bind();
//         framebuffer.bind();
//       }
      
//       let transformation = new Mat4().setTransform(0, 0, 0, 200, 200, 200, a, a, 0);
//       scene.meshes.cube.setModel(transformation);
//       scene.enableDepthTest().clearColor("0.5 0.5 1.0 1").clearDepth();
//       scene.drawScene();

//       gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
//       gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture.texture);
//       transformation = new Mat4().setTransform(0, 0, 0, 200, 200, 200, a, a, 0);
//       scene.meshes.cube.setModel(transformation);
//       gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//       scene.enableDepthTest().clearColor("1 1 0.5 1").clearDepth();
//       scene.drawScene();
//     }
    
//   });
}