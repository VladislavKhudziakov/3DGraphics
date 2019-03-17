
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
    const rootNode = app.nodes.find(node => node.name === 'rootModel');
    const waist = app.nodes.find(node => node.name === 'waistModel');
    const torso = app.nodes.find(node => node.name === 'torsoModel');
    const head = app.nodes.find(node => node.name === 'headModel');
    const neck = app.nodes.find(node => node.name === 'neckModel');
    const leftArm = app.nodes.find(node => node.name === 'left-armModel');
    const leftForearm = app.nodes.find(node => node.name === 'left-forearmModel');
    const leftHand = app.nodes.find(node => node.name === 'left-handModel');
    const rightArm = app.nodes.find(node => node.name === 'right-armModel');
    const rightForearm = app.nodes.find(node => node.name === 'right-forearmModel');
    const rightHand = app.nodes.find(node => node.name === 'right-handModel');
    const leftLeg = app.nodes.find(node => node.name === 'left-legModel');
    const leftCalf = app.nodes.find(node => node.name === 'left-calfModel');
    const leftFoot = app.nodes.find(node => node.name === 'left-footModel');
    const rightLeg = app.nodes.find(node => node.name === 'right-legModel');
    const rightCalf = app.nodes.find(node => node.name === 'right-calfModel');
    const rightFoot = app.nodes.find(node => node.name === 'right-footModel');

    let isFirst = true;
    let coeff = 1;
    let timer = new Date().getTime();
    let last = new Date().getTime();
    const delay = 350;

    let deltaList = [16, 16, 16, 16, 16];

    rootNode.computeWorldMatrix();
    
    requestAnimationFrame(animate);

    function animate() {
      const now = new Date().getTime();
      const delta = now - last;
      last = now;
      deltaList.shift();
      deltaList.push(delta);

      const deltaCoeff = average(deltaList) / 25;

      if (isFirst) {
        if (now >= timer + delay) {
          coeff = -coeff;
          timer = now;
          isFirst = false;
        }
      } else {
        if (now >= timer + delay * 2) {
          coeff = -coeff;
          timer = now;
        }
      }
      
      head.transform(0, 0, 0, 1, 1, 1, 1 * coeff * deltaCoeff, 0, 0);
      neck.transform(0, 0, 0, 1, 1, 1, 0, 1 * coeff * deltaCoeff, 0);
      waist.transform(0, -0.75 * coeff, 0, 1, 1, 1, 0, 2 * coeff * deltaCoeff, 0);
      leftArm.transform(0, 0, 0, 1, 1, 1, 0, 0, -1 * coeff * deltaCoeff);
      leftForearm.transform(0, 0, 0, 1, 1, 1, 0, 0, -1 * coeff * deltaCoeff);
      leftHand.transform(0, 0, 0, 1, 1, 1, 0, 0, -1 * coeff * deltaCoeff)
      rightArm.transform(0, 0, 0, 1, 1, 1, 0, 0, -1 * coeff * deltaCoeff);
      rightForearm.transform(0, 0, 0, 1, 1, 1, 0, 0, -1 * coeff * deltaCoeff);
      rightHand.transform(0, 0, 0, 1, 1, 1, 0, 0, -1 * coeff * deltaCoeff)
      rightLeg.transform(0, 0, 0, 1, 1, 1, 4 * coeff * deltaCoeff, 0, 0);
      rightCalf.transform(0, 0, 0, 1, 1, 1, -1 * coeff * deltaCoeff, 0, 0);
      rightFoot.transform(0, 0, 0, 1, 1, 1, -1 * coeff * deltaCoeff, 0, 0);
      leftLeg.transform(0, 0, 0, 1, 1, 1, -4 * coeff * deltaCoeff, 0, 0);
      leftCalf.transform(0, 0, 0, 1, 1, 1, 1 * coeff * deltaCoeff, 0, 0);
      leftFoot.transform(0, 0, 0, 1, 1, 1, 1 * coeff * deltaCoeff, 0, 0);

      rootNode.computeWorldMatrix();
      app.clearSceneBuffers().drawScene();
      requestAnimationFrame(animate);
    }

    app.clearSceneBuffers().drawScene();
  });
}

function average(arr) {
  return arr.reduce((prev, curr) => prev + curr) / arr.length;
}