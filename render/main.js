import {setScaling, setRotationX, setRotationY, setRotationZ, setSingle, setOrtho, mul} from "./transformations";
import {initArrayBuffer} from "./initArrayBuffer";
import {initProgram} from "./initProgram";
import {initShader} from "./initShader";

function main(filesSource) {
  const VSHADERSOURCE = filesSource[0];
  const FSHADERSOURCE = filesSource[1];
  const mdl = filesSource[2];
  
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');

  const gl_vShader = initShader(gl, gl.VERTEX_SHADER, VSHADERSOURCE);
  const gl_fShader = initShader(gl, gl.FRAGMENT_SHADER, FSHADERSOURCE);

  const gl_Program = initProgram(gl, gl_vShader, gl_fShader);

  const primitiveType = gl.TRIANGLES;
  const drawOffset = 0;

  //set ortho
  /**
   * 0 ------- →
   * |
   * |
   * |
   * ↓
   */
  const left = 0;
  const top = 0;
  const right = gl.canvas.clientWidth;
  const bottom = gl.canvas.clientWidth;
  const near = 400;
  const far = -400;

  gl.useProgram(gl_Program);

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);

  const a_Position = initArrayBuffer(gl, 'a_Position', gl_Program, new Float32Array(mdl.vertices), 3);
  const a_Color = initArrayBuffer(gl, 'a_Color', gl_Program, new Float32Array(mdl.colors), 3);

  let proj = setOrtho(right, left, top, bottom, far, near);
  
  let model = mul(setSingle(), setTranslation(300, 300, 0));
  
  
  model = mul(model, setScaling(1, 1, 1));
  
  model = mul(model, setRotationX(10));

  model = mul(model, setRotationY(20));
  model = mul(model, setRotationZ(0));
  
  let mp = mul(proj, model);
  
  const u_mv = gl.getUniformLocation(gl_Program, 'u_mv');
  gl.uniformMatrix4fv(u_mv, false, new Float32Array(mp));
  
  gl.drawArrays(primitiveType, drawOffset, mdl.vertices.length / 3);
}

export {main};