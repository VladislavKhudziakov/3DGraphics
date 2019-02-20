function initShader(gl, shaderType, source) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const message = gl.getShaderInfoLog(shader);

  if (message.length > 0) {
    throw message;
  }
  return shader;
}

export {initShader};