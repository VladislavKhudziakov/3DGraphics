const VSHADER_SOURCE =`
attribute vec4 a_Position;
uniform vec4 u_Translation;
uniform float u_SinB, u_CosB;
uniform float u_Scale;
uniform mat4 u_xFormMatrix, u_ScaleMatrix, u_TranslateMatrix;
void main()
{
  gl_Position = a_Position * u_ScaleMatrix * u_xFormMatrix * u_TranslateMatrix;
}`;

const FSHADER_SOURCE =`
precision mediump float;
uniform vec4 u_FragColor;
void main()
{
  gl_FragColor = u_FragColor; 
}`;

const canvas = document.getElementById('chapter3');
const gl = canvas.getContext('webgl');

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);

const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
gl.uniform4f(u_Translation, 0.0, 0.0, 0.0, 0.0);

const angle = 0;
const u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
const u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
gl.uniform1f(u_SinB, Math.sin(angle));
gl.uniform1f(u_CosB, Math.cos(angle));

const scaleValue = 1;
const u_Scale = gl.getUniformLocation(gl.program, 'u_Scale');
gl.uniform1f(u_Scale, scaleValue);

const cosB = Math.cos(angle);
const sinB = Math.sin(angle);

const xFormMatrix = new Float32Array([
   cosB, sinB, 0.0, 0.0,
  -sinB, cosB, 0.0, 0.0,
    0.0,  0.0, 1.0, 0.0,
    0.0,  0.0, 0.0, 1.0
]);

const u_xFormMatrix = gl.getUniformLocation(gl.program, 'u_xFormMatrix');
gl.uniformMatrix4fv(u_xFormMatrix, false, xFormMatrix);

const xSc = 1.0;
const ySc = 1.0;

const xScaleMatrix = new Float32Array([
  xSc, 0.0, 0.0, 0.0,
  0.0, ySc, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 1.0
]);

const u_ScaleMatrix = gl.getUniformLocation(gl.program, 'u_ScaleMatrix');
gl.uniformMatrix4fv(u_ScaleMatrix, false, xScaleMatrix);

const xT = 0.0;
const yT = 0.0;
const zT = 0.0;

xTranslateMatrix = new Float32Array([
  1.0, 0.0, 0.0, xT,
  0.0, 1.0, 0.0, yT,
  0.0, 0.0, 1.0, zT,
  0.0, 0.0, 0.0, 1.0
]);

const u_TranslateMatrix = gl.getUniformLocation(gl.program, 'u_TranslateMatrix');
gl.uniformMatrix4fv(u_TranslateMatrix, false, xTranslateMatrix);

/**
* [
*   tr_x.x, tr_y.x, tr_z.x, tr_p.x,
*   tr_x.y, tr_y.y, tr_z.y, tr_p.y,
*   tr_x.z, tr_y.z, tr_z.z, tr_p.z,
*      0.0,    0.0,    0.0,    1.0
* ]
*/


const n = initVertexBuffers(gl);

if (n < 0) {
  console.log('Failed to set the positions of the vertices');
}

gl.drawArrays(gl.TRIANGLES, 0, n);

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    0.0, 0.5, 0.0, 
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
  ]);

  const n = vertices.length / 3; // Число вершин
   // Создать буферный объект
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Определить тип буферного объекта
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Записать данные в буферный объект
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // Сохранить ссылку на буферный объект в переменной a_Position
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  // Разрешить присваивание переменной a_Position
  gl.enableVertexAttribArray(a_Position);
  return n;

  /*
    [
      x, y, z, w,
      x, y, z, w,
    ]
  */
}
