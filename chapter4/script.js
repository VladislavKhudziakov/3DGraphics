
const VSHADER_SOURCE =`
attribute vec4 a_Position;
attribute float a_PointSize;
void main()
{
  gl_Position = a_Position; 
  gl_PointSize = a_PointSize; 
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

