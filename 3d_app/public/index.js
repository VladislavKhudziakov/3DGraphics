
import { Node } from "../src/js/node.js";
import { Framebuffer } from "../src/js/framebuffer.js";
import { Renderbuffer } from "../src/js/renderbuffer.js";
import { App } from "../src/js/app.js";


document.addEventListener('DOMContentLoaded', main);

function main() {
  const fshadersNames = ["fShader1.frag", "fShader2.frag"];
  const vShadersNames = ["vShader1.vert", "vShader2.vert"];
  const textures = [
    "cat.jpg", "doge.jpg",
    "glad.jpg", "grustno.jpg",
    "pchela.jpg", "pepe.jpg",
    "pika.jpg", "roflan_ebala.jpg",
    "roflan_gorit.jpg", "roflan_kaef.jpg",
    "roflan_pominki.jpg", "shmatko.jpg",
    "is.jpg", "belissimo.jpg", "sponge.jpg",
    "bunt.jpg", "jerry.jpg", "grustno.jpg"
    ];
  // const materials = ["cube.json", "cube2.json"];
  const materials = [
    "cat.json", "doge.json",
    "glad.json", "pepe.json",
    "pika.json", "roflan_ebala.json",
    "roflan_gorit.json", "roflan_kaef.json",
    "roflan_pominki.json", "shmatko.json",
    "is.json", "belissimo.json", "sponge.json",
    "bunt.json", "jerry.json", "grustno.json"
  ];

  const app = new App('canvas')
  .createScene().setScenePerspective(100, 1, 2000)
  .setSceneCamera(0, 100, 350, 0, 0, 0, 0, 0, 0, 0, 1, 0)
  .computeSceneProjectionView().clearSceneBuffers();
  app.loadShaders(vShadersNames, './shaders/', 'vertex')
  .then(() => app.loadShaders(fshadersNames, './shaders/', 'fragment'))
  .then(() => app.loadTextures(textures, './img/'))
  .then(() => app.loadMaterials(materials, './materials/'))
  .then(() => {
    app.clearSceneBuffers().drawScene();
  });
}