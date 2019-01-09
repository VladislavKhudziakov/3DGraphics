const VSHADER_SOURCE =`void main()
{
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0); 
  gl_PointSize = 10.0; 
};`

const FSHADER_SOURCE =`void main() 
{
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
};`

const canvas = document.getElementById('example');
const gl = canvas.getContext('webgl');

const vshader = gl.createShader(gl.VERTEX_SHADER);
const fshader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vshader, VSHADER_SOURCE);
gl.shaderSource(fshader, FSHADER_SOURCE);
gl.compileShader(vshader);
gl.compileShader(fshader);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, 1);



