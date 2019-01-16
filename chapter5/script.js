const VSHADER_SOURCE =`
attribute vec4 a_Position;
attribute vec2 a_TexCord;
varying vec2 v_TexCord;
void main()
{
  gl_Position = a_Position;
  v_TexCord = a_TexCord;
}`;

const FSHADER_SOURCE =`
precision mediump float;
varying vec2 v_TexCord;
uniform sampler2D u_Sampler;
uniform vec4 u_Test;
void main()
{
  gl_FragColor = texture2D(u_Sampler, v_TexCord);
}`;

const canvas = document.getElementById('chapter5');
const gl = canvas.getContext('webgl');

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

const vertexTexCoord = new Float32Array([
  -0.5,  0.5, 0.0, 1.0,
  -0.5, -0.5, 0.0, 0.0,
   0.5,  0.5, 1.0, 1.0,
   0.5, -0.5, 1.0, 0.0,
]);

const FSIZE = vertexTexCoord.BYTES_PER_ELEMENT;

const vertCnt = initVertexBuffer();

initTextures(gl, vertCnt);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertCnt);

function initVertexBuffer() {

  const vertCnt = vertexTexCoord.length;

  const vertexBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexTexCoord, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_TexCord = gl.getAttribLocation(gl.program, 'a_TexCord');
  gl.vertexAttribPointer(a_TexCord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCord);
  return vertCnt / 4;
};

function initTextures(gl, n) {
  const texture = gl.createTexture(); // Создать объект текстуры
  // Получить ссылку на u_Sampler
  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  
  const image = new Image(); // Создать объект изображения
  // Зарегистрировать обработчик, вызываемый послезагрузки изображения
  document.body.appendChild(image);
  image.onload = function() {
    loadTexture(gl, n, texture, u_Sampler, image);
  };
  // Заставить браузер загрузить изображение
  image.src = '../resources/sky.jpg';
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  console.log(u_Sampler);
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Повернуть ось Y изображения
  // Выбрать текстурный слот 0
  gl.activeTexture(gl.TEXTURE0);
  // Указать тип объекта текстуры
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Определить параметры текстуры
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Определить изображение текстуры
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // Определить указатель на текстурный слот 0
  gl.uniform1i(u_Sampler, 0);
}
