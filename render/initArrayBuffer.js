function initArrayBuffer(gl, attribLocation, program, data, length) {
  const a_Attr = gl.getAttribLocation(program, attribLocation);

  const arrBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, arrBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(a_Attr);
  gl.vertexAttribPointer(a_Attr, length, gl.FLOAT, false, 0, 0);

  return [a_Attr, arrBuffer];
}

export {initArrayBuffer};