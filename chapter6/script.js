
 const VSHADER_SOURCE =`
 attribute vec4 a_Position;
 attribute vec4 a_Color;
 uniform mat4 u_MVPmatrix;
 varying vec4 v_Color;
 void main() {
  gl_Position = u_MVPmatrix * a_Position;
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

 gl.enable(gl.DEPTH_TEST);
 gl.clear(gl.DEPTH_BUFFER_BIT);

const n = initVertexBuffers(gl);



const u_MVPmatrix = gl.getUniformLocation(gl.program, 'u_MVPmatrix');

let MVPmatrix = new Matrix4();
MVPmatrix.setPerspective(30, 1, 1, 100);
MVPmatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

var deg = 0;

setInterval(() => {
  deg += 1;
  if(deg >= 360) {
    deg = 0;
  }
  MVPmatrix.setPerspective(30, 1, 1, 100);
  MVPmatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  MVPmatrix.rotate(deg, 0, 0);
  gl.uniformMatrix4fv(u_MVPmatrix, false, MVPmatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}, 100);


gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

function initVertexBuffers(gl) {

  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

    const vertices = new Float32Array([   // Vertex coordinates
      1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
      1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
     -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
      1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]);

  const colors = new Float32Array([     // Colors
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  // v0-v1-v2-v3 front(white)
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  // v0-v3-v4-v5 right(white)
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  // v0-v5-v6-v1 up(white)
    1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  // v1-v6-v7-v2 left(white)
    0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  // v7-v4-v3-v2 down(white)
    1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0   // v4-v7-v6-v5 back(white)
  ]);

  const indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  const indexBuffer = gl.createBuffer();

  initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
  initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
  
}

function initArrayBuffer(gl, data, num, type, attribute) {
  const buffer = gl.createBuffer();   // Create a buffer object

  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  const a_attribute = gl.getAttribLocation(gl.program, attribute);

  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);
  return true;
}

