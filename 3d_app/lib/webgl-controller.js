export class webglController {
  static initShader(gl, shaderType, shaderSourse) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSourse);
    gl.compileShader(shader);

    const message = gl.getShaderInfoLog(shader);

    if (message.lenght > 0) {
      throw message;
    } else {
      return shader;
    }
  }


  static initProgram(gl, vertShader, fragShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    const message = gl.getProgramInfoLog(program);

    if (message.lenght > 0) {
      throw message;
    } else {
      return program;
    }
  }


  static initArrayBuffer(gl, program, attrName, data, size, type, normalized) {

    const a_attr = gl.getAttribLocation(program, attrName);
    const arrBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, arrBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(a_attr);
    gl.vertexAttribPointer(a_attr, size, type, normalized, 0, 0);

    return a_attr;
  }
}
