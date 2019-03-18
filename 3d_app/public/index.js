
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

  const cubeMaterial = ['cube.json'];

  const app = new App('canvas');
  app.createMaterial('fbMat');
  app.createMaterial('main');
  app.loadShaders(vShadersNames, './shaders/', 'vertex')
  .then((shaders) => {
    app.addMaterialShaders('fbMat', shaders);
    app.addMaterialShaders('main', shaders);
    return app.loadShaders(fshadersNames, './shaders/', 'fragment');
  })
  .then(shaders => {
    app.addMaterialShaders('fbMat', shaders);
    app.addMaterialShaders('main', shaders);
    return app.loadTextures(textures, './img/');
  })
  .then(textures => {
    app.addMaterialTextures('fbMat', textures);
    return app.loadMaterials(materials, './materials/');
  })
  .then(materials => {
      app.createFramebufferScene('fbScene', 256, 256)
      .setScenePerspective('fbScene', 100, 1, 2000)
      .setSceneCamera(
        'fbScene', 0, 100, 350, 0, 0, 0, 0, 0, 0, 0, 1, 0)
      .computeSceneProjectionView('fbScene')
      .clearSceneBuffers('fbScene', 0.5, 0, 0.5, 1);

      app.addMaterialObjects('fbMat', materials)
      .setMaterialScene('fbMat', 'fbScene')
      .initMaterial('fbMat').drawScene('fbScene');
      app.stopRenderInFramebufferScene('fbScene');
      
      return app.loadMaterials(cubeMaterial, './materials/');
  })
  .then(material => {
    app.createScene('main').setScenePerspective('main', 100, 1, 2000)
    .setSceneCamera('main', 0, 100, 350, 0, 0, 0, 0, 0, 0, 0, 1, 0)
    .computeSceneProjectionView('main').clearSceneBuffers('main',  0, 0.5, 0.5, 1);

    const texture = app.getFbSceneTexture('fbScene');
    
    app.addMaterialObjects('main', material)
    .setMaterialScene('main', 'main')
    .initMaterial('main')
    .setMaterialMeshTexture('main', 'cube', texture)
    .drawScene('main');
  }).then(() => {
    const cube = app.getMaterialNode('main', 'cube-Model');
    const mainRoot = app.getMaterialNode('main', 'root-Model');

    const fbRootNode = app.getMaterialNode('fbMat', 'root-Model');
    const waist = app.getMaterialNode('fbMat', 'waist-Model');
    const torso = app.getMaterialNode('fbMat', 'torso-Model');
    const head = app.getMaterialNode('fbMat', 'head-Model');
    const neck = app.getMaterialNode('fbMat', 'neck-Model');
    const leftArm = app.getMaterialNode('fbMat', 'left-arm-Model');
    const leftForearm = app.getMaterialNode('fbMat', 'left-forearm-Model');
    const leftHand = app.getMaterialNode('fbMat', 'left-hand-Model');
    const rightArm = app.getMaterialNode('fbMat', 'right-arm-Model');
    const rightForearm = app.getMaterialNode('fbMat', 'right-forearm-Model');
    const rightHand = app.getMaterialNode('fbMat', 'right-hand-Model');
    const leftLeg = app.getMaterialNode('fbMat', 'left-leg-Model');
    const leftCalf = app.getMaterialNode('fbMat', 'left-calf-Model');
    const leftFoot = app.getMaterialNode('fbMat', 'left-foot-Model');
    const rightLeg = app.getMaterialNode('fbMat', 'right-leg-Model');
    const rightCalf = app.getMaterialNode('fbMat', 'right-calf-Model');
    const rightFoot = app.getMaterialNode('fbMat', 'right-foot-Model');
    
    let isFirst = true;
    let coeff = 1;
    let timer = new Date().getTime();
    let last = new Date().getTime();
    const delay = 350;

    let deltaList = [16, 16, 16, 16, 16];

    fbRootNode.computeWorldMatrix();
    
    requestAnimationFrame(animate);

    function animate() {

      app.renderInFramebufferScene('fbScene');

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

      fbRootNode.computeWorldMatrix();
      app.clearSceneBuffers('fbScene', 0.5, 0, 0.5, 1)
      .drawScene('fbScene');

      app.stopRenderInFramebufferScene('fbScene');

      cube.transform(0, 0, 0, 1, 1, 1, 1 * deltaCoeff, 1 * deltaCoeff, 0);
      mainRoot.computeWorldMatrix();
      app.clearSceneBuffers('main',  0, 0.5, 0.5, 1).drawScene('main');
      requestAnimationFrame(animate);
    }
  });
}

function average(arr) {
  return arr.reduce((prev, curr) => prev + curr) / arr.length;
}





 