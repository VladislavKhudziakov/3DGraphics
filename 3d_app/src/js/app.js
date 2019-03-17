import { Scene } from "./scene.js";
import { Shader } from "./shader.js";
import { Mesh } from "./mesh.js";
import { Texture } from "./texture.js";
import { Mat4 } from "../../lib/matrix4.js";
import { Node } from "./node.js";
import { FramebufferScene } from "./framebufferScene.js";
import { Material } from "./material.js";

export class App {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    this.gl = canvas.getContext('webgl');
    this.scenes = [];
    this.materials = [];
    return this;
  };


  loadFile(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.send();

      xhr.onload = function() {
        if (xhr.status !== 200) {
          reject(`error: ${xhr.status} ${xhr.statusText}`);
        } else {
          resolve(xhr.responseText);
        }
      };

      xhr.onerror = function() {
        reject(`error: ${xhr.status} ${xhr.statusText}`);
      };

    });
  };


  async loadShaders(shadersNames, folderPath, type) {
    const gl = this.gl;

    let shaders = [];

    for (let i = 0; i < shadersNames.length; i++) {
      const url = `${folderPath}${shadersNames[i]}`;
      const file = await this.loadFile(url).catch(console.error);
      const shader = new Shader(gl, type, file, shadersNames[i]).compile();
      shaders.push(shader);
    }

    return shaders;
  };


  async loadMaterials(MaterialsNames, folderPath) {
    let materials = [];

    for (let i = 0; i < MaterialsNames.length; i++) {
      const url = `${folderPath}${MaterialsNames[i]}`;
      const file = await this.loadFile(url).catch(console.error);

      const material = JSON.parse(file);

      materials.push(material);
    }
    
    return materials
  };


  loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => {
        resolve(image);
      });
    });
  };


  async loadTextures(texturesNames, folderPath) {
    const gl = this.gl;

    let textures = [];

    for (let i = 0; i < texturesNames.length; i++) {
      const url = `${folderPath}${texturesNames[i]}`;

      const img = await this.loadImage(url).catch(console.error);

      const texture = new Texture(
        gl, img, texturesNames[i]).createImageTexture();

      textures.push(texture);
    }

    return textures;
  };


  getGl() {
    return this.gl;
  };


  createScene(name) {
    const scene = new Scene(this, name);
    this.scenes.push(scene);

    return this;
  };


  createFramebufferScene(width, height, name) {
    const gl = this.gl;

    const scene = new FramebufferScene(gl, width, height, name);
    this.scenes.push(scene);

    return this;
  };


  setScenePerspective(name, fov, near, far) {
    const scene = this.getScene(name);
    if (scene) {
      scene.setPerspectiveProjection(fov, near, far);
    }

    return this;
  };


  setSceneOrtho(name, left, right, top, bottom, near, far) {
    const scene = this.getScene(name);
    scene.setOrthographicProjection(left, right, top, bottom, near, far);

    return this;
  };


  setSceneCamera(
    name, cX, cY, cZ, cAX, cAY, cAZ, tX, tY, tZ, upX, upY, upZ) {
    const scene = this.getScene(name);
    scene.setCamera(cX, cY, cZ, cAX, cAY, cAZ, tX, tY, tZ, upX, upY, upZ);
    
    return this;
  };


  createMaterial(name) {
    const material = new Material(this.gl, null, name);
    this.materials.push(material);

    return this;
  };


  getMaterial(name) {
    return this.materials.find(material => material.name === name);
  };


  setMaterialTextures(name, textures) {
    const material = this.getMaterial(name);

    if (material) {
      material.setTextures(textures);
    }

    return this;
  };
  

  addMaterialTextures(name, textures) {
    const material = this.getMaterial(name);

    if (material) {
      material.addTexture(textures);
    }

    return this;
  };


  setMaterialShaders(name, shaders) {
    const material = this.getMaterial(name);

    if (material) {
      material.addShader(shaders);
    }

    return this;
  };


  addMaterialShaders(name, shaders) {
    const material = this.getMaterial(name);

    if (material) {
      material.addShader(shaders);
    }

    return this;
  };


  setMaterialScene(materialName, sceneName) {
    const material = this.getMaterial(materialName);
    const scene = this.getScene(sceneName);

    if (material && scene) {
      material.setScene(scene);
    }

    return this;
  };


  initMaterial(name) {
    const material = this.getMaterial(name);

    if (material) {
      material.initMeshes();
      material.createNodesTree();
    }

    return this;
  }


  setMaterialsObjects(name, objects) {
    const material = this.getMaterial(name);

    if (material) {
      material.setObjects(objects);
    }

    return this;
  };


  addMaterialObjects(name, objects) {
    const material = this.getMaterial(name);

    if (material) {
      material.addObject(objects);
    }

    return this;
  };


  setSceneLight(name) {
    const scene = this.getScene(name);

    if (scene) {
      scene.setLight(x, y, z, r, g, b, p);
    }    

    return this;
  };


  computeSceneProjectionView(name) {
    const scene = this.getScene(name);

    if (scene) {
      scene.computeProjectionView();
    }
    
    return this;
  };


  clearSceneColor(name, r = 0, g = 0, b = 0, a = 1) {
    const scene = this.getScene(name);

    if (scene) {
      scene.clearColor(r, g, b, a);
    }
    
    return this;
  };


  clearSceneDepth(name) {
    const scene = this.getScene(name);

    if (scene) {
      scene.enableDepthTest();
      scene.clearDepth();
    }
    
    return this;
  };


  clearSceneBuffers(name) {
    this.clearSceneColor(name);
    this.clearSceneDepth(name);

    return this;
  };


  drawScene(name) {
    const scene = this.getScene(name);

    if (scene) {
      scene.drawScene();
    }

    return this;
  };


  getScene(name) {
    return this.scenes.find(scene => scene.name === name);
  };
}