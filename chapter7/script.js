const VSHADER_SOURCE =
`attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_ModelMatrix;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;

varying vec3 v_Position;
varying vec3 v_Normal;
varying vec4 v_Color;
void main() {

gl_Position = u_MvpMatrix * a_Position;

v_Position = vec3(u_ModelMatrix * a_Position);
v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
v_Color = a_Color;
}`
  
const FSHADER_SOURCE =
`#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;

varying vec3 v_Position;
varying vec3 v_Normal;
varying vec4 v_Color;

void main() {
  vec3 normal = normalize(v_Normal);;

  vec3 lightDirection = normalize(u_LightPosition - v_Position);
  float nDotL = max(dot(lightDirection, normal), 0.0);

  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;
  vec3 ambient = u_AmbientLight * v_Color.rgb;

  gl_FragColor = vec4(diffuse + ambient, v_Color.a);
}`

  

  // Retrieve <canvas> element
const canvas = document.getElementById('chapter7');

  // Get the rendering context for WebGL
const gl = getWebGLContext(canvas);

const vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
 ]);

 const colors = new Float32Array([     // Colors
  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front(white)
  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right(white)
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up(white)
  1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,  // v1-v6-v7-v2 left(white)
  0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,  // v7-v4-v3-v2 down(white)
  1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0   // v4-v7-v6-v5 back(white)
]);

const normals = new Float32Array([
  0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
  1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
  0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
 -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
  0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
  0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
]);

let indices = new Uint8Array([       // Indices of the vertices
  0, 1, 2,   0, 2, 3,    // front
  4, 5, 6,   4, 6, 7,    // right
  8, 9,10,   8,10,11,    // up
 12,13,14,  12,14,15,    // left
 16,17,18,  16,18,19,    // down
 20,21,22,  20,22,23     // back
]);


class App { 

  //u_MvpMatrix
  //u_ModelMatrix
  //u_NormalMatrix
  //u_LightColor
  //u_LightPosition
  //u_LightDirection
  //u_AmbientLight
  constructor(gl, fShader, vShader, vertices, colors, normals, indices, num) {
    this.gl = gl;
    this.fShader = fShader;
    this.vShader = vShader;

    this.vertices = vertices;
    this.colors = colors;
    this.normals = normals;
    this.indices = indices;


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    initShaders(gl, fShader, vShader);

    const a_PositionData = this._initArrayBuffer(
      vertices, 
      "a_Position", 
      num, 
      gl.FLOAT  
    );

    this.a_PositionBuffer = a_PositionData.buffer;
    this.a_Positions = a_PositionData.attribute;

    const a_ColorData = this._initArrayBuffer(
      colors, 
      "a_Color", 
      num, 
      gl.FLOAT
    );

    this.a_ColorBuffer = a_ColorData.buffer;
    this.a_Color = a_ColorData.attribute;

    const a_NormalData = this._initArrayBuffer(
      normals, 
      "a_Normal", 
      num, 
      gl.FLOAT
    );

    this.a_NormalBuffer = a_NormalData.buffer;
    this.a_Normal = a_NormalData.attribute;

    this.elementBuffer = this._initElementBuffer(indices); 

    this._initUnifroms(
      "u_MvpMatrix", 
      "u_ModelMatrix", 
      "u_NormalMatrix", 
      "u_LightColor",
      "u_LightPosition",
      "u_LightDirection",
      "u_AmbientLight"
    );

    this._setUniformsDefault();
  }

  _initUnifroms(mvp, model, normal, lightColor, lightPos, lightDir, ambientLight) {
    this.u_MvpMatrix = gl.getUniformLocation(gl.program, mvp);
    this.u_ModelMatrix = gl.getUniformLocation(gl.program, model);
    this.u_NormalMatrix = gl.getUniformLocation(gl.program, normal);
    this.u_LightColor = gl.getUniformLocation(gl.program, lightColor);
    this.u_LightPosition = gl.getUniformLocation(gl.program, lightPos);
    this.u_LightDirection = gl.getUniformLocation(gl.program, lightDir);
    this.u_AmbientLight = gl.getUniformLocation(gl.program, ambientLight);
  }

  _setUniformsDefault() {
    gl.uniform3f(this.u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(this.u_AmbientLight, 0.2, 0.2, 0.2);
    gl.uniform3f(this.u_LightPosition, 5.0, 8.0, 7.0);

    this.lightDirection = new Vector3([0.5, 3.0, 4.0]);
    this.lightDirection.normalize();
    gl.uniform3fv(this.u_LightDirection, this.lightDirection.elements);
    
    this.mvpMatrix = new Matrix4();
    this.modelMatrix = new Matrix4();
    this.normalMatrix = new Matrix4();
  
    this.mvpMatrix.setPerspective(30, 1, 1, 100)
    .lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  
    this.normalMatrix.setInverseOf(this.modelMatrix);
    this.normalMatrix.transpose();
    
    gl.uniformMatrix4fv(this.u_ModelMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);
    gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements);
  }

  _initElementBuffer(data) {
    const gl = this.gl;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer;
  }

  _initArrayBuffer(data, attr, num, type) {
    const gl = this.gl;

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_Attr = gl.getAttribLocation(gl.program, attr);

    gl.vertexAttribPointer(a_Attr, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_Attr);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return { buffer: buffer, attribute: a_Attr };
  }

  draw() {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
  }

  rotate() {
    const self = this;
    let currDeg = 0;
    
    function _animateRotation() {
      
      currDeg = currDeg >= 360 ? 0 : ++currDeg;

      self.modelMatrix.setRotate(currDeg, 0, 0);
      self.mvpMatrix.setPerspective(30, 1, 1, 100)
      .lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
      .multiply(self.modelMatrix);
      self.normalMatrix.setInverseOf(self.modelMatrix);
      self.normalMatrix.transpose();

      gl.uniformMatrix4fv(self.u_MvpMatrix, false, self.mvpMatrix.elements);
      gl.uniformMatrix4fv(self.u_ModelMatrix, false, self.modelMatrix.elements);
      gl.uniformMatrix4fv(self.u_NormalMatrix, false, self.normalMatrix.elements);

      self.draw();
      requestAnimationFrame(_animateRotation);
    }
    
    requestAnimationFrame(_animateRotation);
  }
}

const app = new App(
  gl, VSHADER_SOURCE, FSHADER_SOURCE,
  vertices, colors, normals, indices, 3
);

app.rotate();
