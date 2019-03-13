
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
  });
}