// import {loadFiles} from "./loadFiles";

// import {main} from "./main";

loadFiles('./vertex.vert', './fragment.frag', './model.json').then(main);
function getFile(url) {
  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    
    xhr.onload = () => {
      resolve(xhr.responseText);
    };

    xhr.onerror = () => {
      reject(xhr.statusText);
    };
  });
}

async function loadFiles(vShaderUrl, fShaderUrl, modelUrl) {
  const vShader = await getFile(vShaderUrl);
  const fShader = await getFile(fShaderUrl);
  const model = await getFile(modelUrl);
  return [vShader, fShader, JSON.parse(model)];
}

loadFiles('./vertex.vert', './fragment.frag', './model.json').then(main);


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


function initShader(gl, shaderType, source) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const message = gl.getShaderInfoLog(shader);

  if (message.length > 0) {
    throw message;
  }
  return shader;
}


function initProgram(gl, vShader, fShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  const message = gl.getProgramInfoLog(program);

  if (message.length > 0) {
    throw message;
  }

  return program;
}


function initArrayBuffer(gl, attribLocation, program, data, length) {
  const a_Attr = gl.getAttribLocation(program, attribLocation);

  const arrBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, arrBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(a_Attr);
  gl.vertexAttribPointer(a_Attr, length, gl.FLOAT, false, 0, 0);

  return [a_Attr, arrBuffer];
}


function setTranslation(x, y, z) {
  const translation = [
    1, 0, 0, 0,
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    x, y, z, 1
  ];
  return translation;
}


function setScaling(x, y, z) {
  const scaling = [
    x, 0, 0, 0,
    0, y, 0, 0, 
    0, 0, z, 0, 
    0, 0, 0, 1
  ];
  return scaling;
}


function setRotationX(angle) {
  const rad = (angle * Math.PI) / 180;

  const s = Math.sin(rad);
  const c = Math.cos(rad);

  const rotation = [
    1,  0,  0,  0,
    0,  c,  s,  0,
    0, -s,  c,  0, 
    0,  0,  0,  1
  ];
  return rotation;
}


function setRotationY(angle) {
  const rad = (angle * Math.PI) / 180;

  const s = Math.sin(rad);
  const c = Math.cos(rad);

  const rotation = [
    c,  0, -s,  0,
    0,  1,  0,  0, 
    s,  0,  c,  0, 
    0,  0,  0,  1
  ];
  return rotation;
}


function setRotationZ(angle) {
  const rad = (angle * Math.PI) / 180;

  const s = Math.sin(rad);
  const c = Math.cos(rad);

  const rotation = [
    c,  s,  0,  0,
   -s,  c,  0,  0, 
    0,  0,  1,  0, 
    0,  0,  0,  1
  ];
  return rotation;
}


function setSingle() {
  const single = [
    1, 0, 0, 0,
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 0, 1
  ];
  return single;
}


function setOrtho(right, left, top, bottom, far, near) {
  const sX = 2 / (right - left);
  const sY = 2 / (top - bottom);
  const sZ = 2 / (near - far);
  const oX = (left + right) / (left - right);
  const oY = (bottom + top) / (bottom - top);
  const oZ = (near + far) / (near - far);
  
  const ortho = [
   sX,  0,  0,  0,
    0, sY,  0,  0,
    0,  0, sZ,  0,
   oX, oY, oZ,  1,
  ];

  return ortho;
}

function mul(A, B) {
  let i, e, a, b, ai0, ai1, ai2, ai3;
  
  // Calculate e = a * b
  e = A;
  a = A;
  b = B;
  
  // If e equals b, copy b to temporary matrix.
  if (e === b) {
    b = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      b[i] = e[i];
    }
  }
  
  for (i = 0; i < 4; i++) {
    ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
    e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
    e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
    e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
    e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  
  return e;
};