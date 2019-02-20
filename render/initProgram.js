function initProgram(gl, vShader, fShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  const message = gl.getProgramInfoLog(program);

  if (message.length > 0) {
    throw message;
  }

  return program;
}

export {initProgram};