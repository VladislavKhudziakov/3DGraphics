const VSHADER_SOURCE =`
attribute vec4 a_Position;
void main()
{
  gl_Position = a_Position; 
  gl_PointSize = 10.0; 
}`

const FSHADER_SOURCE =`void main() 
{
  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); 
}`



const canvas = document.getElementById('example');
const gl = canvas.getContext('webgl');

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

let a_Position = gl.getAttribLocation(gl.program, 'a_Position');

let timer = setInterval((() => {
  let value = -1.0;
  return () => {
    value += 0.01;
    if(value >= 1.0) {
      value = -1.0;
    }
    gl.vertexAttrib4f(a_Position, value, 0.0, 0.0, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
})(), 10);



