
 const VSHADER_SOURCE =`
 attribute vec4 a_Position;
 attribute vec4 a_Color;
 uniform mat4 u_ModelViewMatrix;
 varying vec4 v_Color;
 void main() {
  gl_Position = u_ModelViewMatrix * a_Position;
  v_Color = a_Color;
 }
 `;

 const FSHADER_SOURCE =`
 precision mediump float;
 varying vec4 v_Color;
 void main() {
  gl_FragColor = v_Color;
 }
 `;

 const canvas = document.getElementById('chapter6');
 const gl = canvas.getContext('webgl');

 initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

 gl.clearColor(0.0, 0.0, 0.0, 1.0);
 gl.clear(gl.COLOR_BUFFER_BIT);

const n = initVertexBuffers(gl);

let modelViewMatrix = new Matrix4()
.setLookAt(0.0, 0.0, 0.25, 0, 0, 0, 0, 1, 0);

const u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

gl.drawArrays(gl.TRIANGLES, 0, n);

let g_eyeX = 0.0, g_eyeY = 0.0, g_eyeZ = 0.25; // Точка наблюдения

document.addEventListener('keydown', event => {
  keydown(event, gl, n, u_ModelViewMatrix, modelViewMatrix);
});

function initVertexBuffers(gl) {
  let verticesColors = new Float32Array([
    // координаты вершин и цвет
     0.0,  0.5, -0.4, 0.4, 1.0, 0.4, // Дальний зеленый треугольник
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
     0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
  
     0.5,  0.4, -0.2, 1.0, 0.4, 0.4, // Желтый треугольник в середине
    -0.5,  0.4, -0.2, 1.0, 1.0, 0.4,
     0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

     0.0,  0.5, 0.0, 0.4, 0.4, 1.0, // Ближний синий треугольник
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
     0.5, -0.5, 0.0, 1.0, 0.4, 0.4
  ]);
 
  let n = 9;

  // Создать буферный объект
  const vertexColorbuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, FSIZE, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  
  
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);
  return n;
}

function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
  if(ev.keyCode == 39) { // Нажата клавиша со стрелкой вправо?
    g_eyeX += 0.01;
  }
  if (ev.keyCode == 37) { // Нажата клавиша со стрелкой влево?
    g_eyeX -= 0.01;
  } // Предотвратить ненужное перерисовывание
  draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
  // Передать матрицу вида в переменную u_ViewMatrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT); // Очистить <canvas>
  gl.drawArrays(gl.TRIANGLES, 0, n); // Нарисовать треугольник
}