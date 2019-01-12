const VSHADER_SOURCE =`
attribute vec4 a_Position;
//attribute float a_PointSize;
void main()
{
  gl_Position = a_Position; 
  //gl_PointSize = a_PointSize; 
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

const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
gl.vertexAttrib1f(a_PointSize, 10.0);
gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);


const n = initVertexBuffers(gl);

if (n < 0) {
  console.log('Failed to set the positions of the vertices');
}

gl.drawArrays(gl.TRIANGLES, 0, n);

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    -0.5, 0.5, 0.0, 
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, 0.5, 0.0, 
    0.5, 0.5, 0.0, 
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
