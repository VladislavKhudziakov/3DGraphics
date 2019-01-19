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

const btn = document.getElementById('sendBtn');
const rGroup = document.getElementsByClassName('rGroup1');

class App {
  constructor(canvas, gl, vshader, fshader) {
    this.gl = gl;
    this.canvas = canvas;
    this.vShader = vshader;
    this.fShader = fshader;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    initShaders(gl, vshader, fshader);

    this.vertexTexCoord = new Float32Array([
      -0.5,  0.5,   0.0, 1.0,
      -0.5, -0.5,   0.0, 0.0,
       0.5,  0.5,   1.0, 1.0,
       0.5, -0.5,   1.0, 0.0,
    ]);

    this.FSIZE = this.vertexTexCoord.BYTES_PER_ELEMENT;

    this.vertCnt = this._initVertexBuffer();
    this.tex1 = gl.createTexture();
    
    this.u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    
    this.tex2 = gl.createTexture();
    this.tex2 = gl.createTexture();
    this.tex3 = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex1);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 
      1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, 
      new Uint8Array([255, 0, 0, 255])
    );

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.tex2);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 
      1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, 
      new Uint8Array([0, 255, 0, 255])
    );

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.tex3);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 
      1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, 
      new Uint8Array([0, 0, 255, 255])
    );
    gl.uniform1i(this.u_Sampler, 0);
     
  }

  initTexture() {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex1);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB,this.gl.RGB, this.gl.UNSIGNED_BYTE, this.image);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);  
    this.gl.texParameteri(this.gl.TEXTURE_2D,this. gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
  }

  changeColor(number) {
    this.gl.uniform1i(this.u_Sampler, number);
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertCnt);
  }

  _initVertexBuffer() {

    const vertCnt = this.vertexTexCoord.length;
  
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER, 
      this.vertexTexCoord, 
      this.gl.STATIC_DRAW
    );
  
    this.a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');

    this.gl.vertexAttribPointer(
      this.a_Position, 2, this.gl.FLOAT, 
      false, this.FSIZE * 4, 0
    );

    this.gl.enableVertexAttribArray(this.a_Position);
  
    this.a_TexCord = this.gl.getAttribLocation(this.gl.program, 'a_TexCord');
    
    this.gl.vertexAttribPointer(
      this.a_TexCord, 2, this.gl.FLOAT, 
      false, this.FSIZE * 4, this.FSIZE * 2
    );

    this.gl.enableVertexAttribArray(this.a_TexCord);
    return vertCnt / 4;
  };
}

class Interface {
  constructor(app, button, rgroup) {
    this.app = app;
    this.button = button;
    this.rGroup = rgroup;

    this.checkedRadBtn = Array.prototype.find.call(
      this.rGroup, 
      element => element.checked
    );
    
    app.changeColor(Number(this.checkedRadBtn.value));
    app.draw();

    this.send = event => {
      event.preventDefault();
      
      this.checkedRadBtn = Array.prototype.find.call(
        this.rGroup, 
        element => element.checked
      );
      
      this.app.changeColor(Number(this.checkedRadBtn.value));
      this.app.draw();
    }
    
    button.addEventListener('click', this.send);
  }
    
}

const app = new App(canvas, gl, VSHADER_SOURCE, FSHADER_SOURCE);
const int = new Interface(app, btn, rGroup);