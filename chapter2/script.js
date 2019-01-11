const VSHADER_SOURCE =`
attribute vec4 a_Position;
attribute float a_PointSize;
void main()
{
  gl_Position = a_Position; 
  gl_PointSize = a_PointSize; 
}`;

const FSHADER_SOURCE =`
uniform vec4 u_FragColor;
void main() 
{
  gl_FragColor = u_FragColor; 
}`;


const canvas = document.getElementById('example');
const gl = canvas.getContext('webgl');

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
console.log(u_FragColor);

let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
//console.log(u_FragColor);

/*
let timer = setInterval((() => {
  let value = -1.0;
  let size = 10.0;
  return () => {
    value += 0.01;
    size += 1;
    if(value >= 1.0) {
      value = -1.0;
    }
    if (size >= 30) {
      size = 10.0;
    }
    gl.vertexAttrib1f(a_PointSize, size);
    gl.vertexAttrib4f(a_Position, value, 0.0, 0.0, 1.0);
    
  }
})(), 10);*/

let g_Positions = [];

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

canvas.addEventListener('mousedown', function(event){
  let xCord = event.clientX.toFixed(1);
  let yCord = event.clientY.toFixed(1);
  const rect = event.target.getBoundingClientRect();

  xCord = ((xCord - rect.left) - canvas.width / 2) / (canvas.width / 2);
  yCord = (canvas. height / 2 - (yCord - rect.top)) / (canvas.height / 2);
  const pointCord = {
    x: xCord,
    y: yCord,
    z: 0.0,
    w: 1.0
  }

  g_Positions.push(pointCord);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  g_Positions.forEach((pointPos) => {
    gl.vertexAttrib4f(
      a_Position, 
      pointPos.x, 
      pointPos.y, 
      pointPos.z, 
      pointPos.w
    );
    gl.vertexAttrib1f(a_PointSize, Math.random() * 10.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }); 
});



