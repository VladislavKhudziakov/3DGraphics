import {getFile} from "./getFile";

async function loadFiles(vShaderUrl, fShaderUrl, modelUrl) {
  const vShader = await getFile(vShaderUrl);
  const fShader = await getFile(fShaderUrl);
  const model = await getFile(modelUrl);
  return [vShader, fShader, JSON.parse(model)];
}

export {loadFiles};