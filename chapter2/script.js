
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


const canvas = document.getElementById('example');
const gl = canvas.getContext('webgl');

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

class Effect {

  constructor(
  canvas, context, init, vShader, 
  fShader, u_frColName, a_PosName, a_PointSizeName
  ) {

    this._colors = {
      red: [1.0, 0.0, 0.0, 1.0],
      green: [0.0, 1.0, 0.0, 1.0],
      blue: [0.0, 0.0, 1.0, 1.0],
      white: [1.0, 1.0, 1.0, 1.0],
    };

    this._canvas = canvas;
    this._gl = context;
    this._init = init;

    init(context, vShader, fShader);

    this.u_FragColor = context.getUniformLocation(
      context.program, 
      u_frColName
    );
    this.a_Position = context.getAttribLocation(
      context.program, 
      a_PosName
    );
    this.a_PointSize = context.getAttribLocation(
      context.program, 
      a_PointSizeName
    );

    this.g_Positions = [];

    this.timer;

  }

  _genRanomSingValue(value) {
    const signVal = Math.random();
    if (signVal >= 0.5) {
      return value;
    } else {
      return -value;
    }
  }

  _drawPoints() {

    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    this.g_Positions.forEach(point => {
      this._gl.vertexAttrib4f(
        this.a_Position, 
        point.cords.x, 
        point.cords.y, 
        point.cords.z, 
        point.cords.w
      );
      
      this._gl.uniform4fv(this.u_FragColor, point.color);
      this._gl.vertexAttrib1f(this.a_PointSize, Math.random() * 10.0);
      this._gl.drawArrays(this._gl.POINTS, 0, 1);
    });
  }

  start() {

    this.timer = setInterval(() => {
      let xCord = this._genRanomSingValue(Math.random());
      let yCord = this._genRanomSingValue(Math.random());

      let pointColor;
      
      if (xCord < 0 && yCord < 0) {
        pointColor = new Color().red;
      } else if (xCord < 0 && yCord > 0) {
        pointColor = new Color().blue;
      } else if (xCord > 0 && yCord > 0) {
        pointColor = new Color().green;
      } else if (xCord > 0 && yCord < 0) {
        pointColor = new Color().white;
      }
      
    
      this.g_Positions.push(new Point(xCord, yCord, pointColor));

      this._drawPoints();
    }, 100);
  }

  end() {
    clearInterval(this.timer);
  }
}

class Point {
  constructor(x, y, color) {
    this.cords = {
      x: x,
      y: y,
      z: 0.0,
      w: 1.0
    }
    this.color = color;
  }
}

class Color {
  constructor() {
    this.red = [1.0, 0.0, 0.0, 1.0];
    this.green = [0.0, 1.0, 0.0, 1.0];
    this.blue = [0.0, 0.0, 1.0, 1.0];
    this.white = [1.0, 1.0, 1.0, 1.0];
  }
}

const effect = new Effect(canvas, gl, initShaders, VSHADER_SOURCE, 
  FSHADER_SOURCE, 'u_FragColor', 'a_Position', 'a_PointSize');

  //effect.start();



