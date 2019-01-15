const VSHADER_SOURCE =`
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
void main()
{
  gl_Position = a_Position;
  v_Color = a_Color;
}`;

const FSHADER_SOURCE =`
precision mediump float;
varying vec4 v_Color;
uniform float u_Width;
uniform float u_Height;
void main()
{
  gl_FragColor = v_Color;
}`;

const canvas = document.getElementById('chapter5');
const gl = canvas.getContext('webgl');

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

const verticesData = new Float32Array([
   0.0,  0.5, 1.0, 0.0, 0.0, 1.0,
  -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
   0.5, -0.5, 0.0, 0.0, 1.0, 1.0,
]);

const FSIZE = verticesData.BYTES_PER_ELEMENT;

const vertCnt = initVertexBuffer();

gl.drawArrays(gl.TRIANGLES, 0, vertCnt);

function initVertexBuffer() {

  const vertCnt = verticesData.length;

  const vertexBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesData, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);
  return vertCnt / 6;
};
