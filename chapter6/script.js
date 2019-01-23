
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

class App {
  constructor(gl, vShader, fShader, vertices, colors, indexes, uniform, num = 3) {
    this.gl = gl;
    this.vertShader = vShader;
    this.fragShader = fShader;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    initShaders(gl, vShader, fShader);

    this.vertArr = vertices;
    this.colorsArr = colors;
    this.indexArr = indexes;

    this.elementBuffer = this._initElementBuffer(indexes);

    const vertBufferData = this._initArrayBuffer(
      vertices, num, 
      gl.FLOAT, 'a_Position'
    );
    this.a_Position = vertBufferData.attr;
    this.a_PosBuffer = vertBufferData.buff;

    const colorsBufferData = this._initArrayBuffer(
      colors, num, 
      gl.FLOAT, 'a_Color'
    );
    this.a_Color = colorsBufferData.attr;
    this.a_colBuffer = colorsBufferData.buff;

    this._initMVPmatrix(uniform);
  }

  _initElementBuffer(data) {
    const gl = this.gl;

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return indexBuffer;
  }

  _initArrayBuffer(data, num, type, attribute) {
    const gl = this.gl;

    const buffer = this.gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const a_Attr = gl.getAttribLocation(gl.program, attribute);
    gl.vertexAttribPointer(a_Attr, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_Attr);

    return { buff: buffer, attr: a_Attr };
  }

  _initMVPmatrix(uniform) {
    const gl = this.gl;

    this.u_MVPmatrix = gl.getUniformLocation(gl.program, uniform);

    this.MVPmatrix = new Matrix4()
    .setPerspective(30, 1, 1, 100)
    .lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(this.u_MVPmatrix, false, this.MVPmatrix.elements);
  }

  draw() {
    const gl = this.gl; 

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, this.indexArr.length, gl.UNSIGNED_BYTE, 0);
  }

   rotate() {
    const self = this;

    let deg = 0;

    function _rotateCallback() {
      deg = deg >= 360 ? 0 : ++deg;

      self.MVPmatrix
      .setPerspective(30, 1, 1, 100)
      .lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
      .rotate(deg, 0, 0);
      
      self.gl.uniformMatrix4fv(self.u_MVPmatrix, false, self.MVPmatrix.elements);
      self.draw();

      requestAnimationFrame(_rotateCallback);
    }

    requestAnimationFrame(_rotateCallback);
  }
}

const app = new App(
  gl, VSHADER_SOURCE, FSHADER_SOURCE, 
  vertices, colors, indices, 'u_MVPmatrix', 3
);

app.rotate();
