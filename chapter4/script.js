
const VSHADER_SOURCE =`
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
void main()
{
  gl_Position = a_Position * u_ModelMatrix; 
}`;

const FSHADER_SOURCE =`
precision mediump float;
uniform vec4 u_FragColor;
void main()
{
  gl_FragColor = u_FragColor; 
}`;


const canvas = document.getElementById('chapter4');
const gl = canvas.getContext('webgl');

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);


initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
const n = initVertexBuffers(gl);

const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);

const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
let modelMatrix = new Matrix4();
let ANGLE = 0.0;
let Tx = 0.0;

let timer = setInterval(() => {
  ANGLE += 1.0;
  
  if(ANGLE >= 360.0) {
    ANGLE = 0.0;
  }
  
  modelMatrix.setRotate(ANGLE, 0, 0, 1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}, 0);

modelMatrix.setRotate(ANGLE, 0, 0, 1);
modelMatrix.translate(Tx, 0, 0);

gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
gl.drawArrays(gl.TRIANGLES, 0, n);

function initVertexBuffers(gl) {

  const vertices = new Float32Array([
  0.0, 0.25, -0.25, -0.25, 0.25, -0.25
  ]);

  const n = 3;

  const vertexBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  return n;
}