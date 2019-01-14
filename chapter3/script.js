const VSHADER_SOURCE =`
attribute vec4 a_Position;
uniform mat4 u_RotateMatrix, u_ScaleMatrix, u_TranslateMatrix;
void main()
{
  gl_Position = a_Position * u_ScaleMatrix * u_RotateMatrix * u_TranslateMatrix;
}`;

const FSHADER_SOURCE =`
precision mediump float;
uniform vec4 u_FragColor;
void main()
{
  gl_FragColor = u_FragColor; 
}`;

const canvas = document.getElementById('chapter3');
const gl = canvas.getContext('webgl');

const v = [
  0.0, 0.5, 0.0, 
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0,
];


class App {

  constructor(canvas, gl, init, vShader, fShader, vertArr) {
    this._gl = gl;
    this._canval = canvas;

    init(gl, vShader, fShader);

    this._vertices = new Float32Array(vertArr);
    this.vertexCount = this._initVertexBuffer();
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    gl.uniform4f(this.u_FragColor, 0.0, 1.0, 0.0, 1.0);

    this.u_TranslateMatrix = gl.getUniformLocation(gl.program, 'u_TranslateMatrix');
    this.u_ScaleMatrix = gl.getUniformLocation(gl.program, 'u_ScaleMatrix');
    this.u_RotateMatrix = gl.getUniformLocation(gl.program, 'u_RotateMatrix');

    const defTransform = new Transformation().matrix;

    let a = new Transformation().translate(0.5, 0.5);
    let b = new Transformation().rotate(45); 
    let c = new Transformation().scale(2.0, 2.0);

    gl.uniformMatrix4fv(this.u_TranslateMatrix, false, defTransform);
    gl.uniformMatrix4fv(this.u_ScaleMatrix, false, defTransform);
    gl.uniformMatrix4fv(this.u_RotateMatrix, false, defTransform);
  }

  setVertices(arr) {
    this._vertices = new Float32Array(arr);
  }

  _initVertexBuffer() {
    const vertCnt = this._vertices.length;

    this.vertexBuffer = gl.createBuffer();

    if (!this.vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertexBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, this._vertices, this._gl.STATIC_DRAW);

    this.a_Position = this._gl.getAttribLocation(this._gl.program, 'a_Position');

    this._gl.vertexAttribPointer(this.a_Position, 3, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this.a_Position);
    return vertCnt / 3;
  };

  draw() {
    
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.clear(gl.COLOR_BUFFER_BIT);

    if (this.vertexCount === -1) {
      return new Error('Error: cannot draw');
    }
    this._gl.drawArrays(this._gl.TRIANGLES, 0, this.vertexCount);
  }

  transform(translation, rotation, scaling) {
    
    if(translation) {
      this._gl.uniformMatrix4fv(this.u_TranslateMatrix, false, translation);
    }

    if(rotation) {
      this._gl.uniformMatrix4fv(this.u_RotateMatrix, false, rotation);
    }

    if(scaling) {
      this._gl.uniformMatrix4fv(this.u_ScaleMatrix, false, scaling);
    }
  }
}


class Transformation {
  constructor() {
    this.matrix = new Float32Array([
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);
  }

  translate(x, y) {
    return new Float32Array([
      1.0, 0.0, 0.0, x.toFixed(1),
      0.0, 1.0, 0.0, y.toFixed(1),
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);
  }

  rotate(deg) {
    const rad = Math.PI * deg / 180.0;

    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    return new Float32Array([
       cos, sin, 0.0, 0.0,
      -sin, cos, 0.0, 0.0,
       0.0, 0.0, 1.0, 0.0,
       0.0, 0.0, 0.0, 1.0
    ]);
  }

  scale(xC, yC) {
    return new Float32Array([
        xC, 0.0, 0.0, 0.0,
       0.0,  yC, 0.0, 0.0,
       0.0, 0.0, 1.0, 0.0,
       0.0, 0.0, 0.0, 1.0
    ]);
  }
}


class Interface {
  constructor(app, translateInput, rotationInput, scalingInput, applyButton) {
    this.app = app;
    this.translateInput = translateInput;
    this.rotationInput = rotationInput;
    this.scalingInput = scalingInput;
    this.applyButton = applyButton;

    this.applyButton.addEventListener('click', this.apply.bind(this));
  }

  apply(event) {
    event.preventDefault();

    const translation = this.translateInput.value.split(' ');
    const rotation = this.rotationInput.value;
    const scaling = this.scalingInput.value.split(' ');

    let TranslationMatrix;
    let RotationMatrix;
    let scalingMatrix;

    if (translation.length === 2) {
      TranslationMatrix = new Transformation().translate(
        Number(translation[0]),
        Number(translation[1])
      );
    } else {
      TranslationMatrix = null;
    }
    
    if (rotation) {
      RotationMatrix = new Transformation().rotate(Number(rotation));
    } else {
      RotationMatrix = null;
    }

    if (scaling.length === 2) {
      scalingMatrix = new Transformation().scale(
        Number(scaling[0]),
        Number(scaling[1])
      );
    } else {
      scalingMatrix = null;
    }

    this.app.transform(TranslationMatrix, RotationMatrix, scalingMatrix);
    this.app.draw();
  }
};

const app = new App(canvas, gl, initShaders, VSHADER_SOURCE, FSHADER_SOURCE, v);
app.draw();

const tInp = document.getElementById('translate');
const rInp = document.getElementById('rotate');
const sInp = document.getElementById('scale');
const applyBtn = document.getElementById('apply');

const appInt = new Interface(app, tInp, rInp, sInp, applyBtn);

