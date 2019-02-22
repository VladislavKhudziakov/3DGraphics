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

  gl.useProgram(gl_Program);

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);

  const a_Position = initArrayBuffer(gl, 'a_Position', gl_Program, new Float32Array(mdl.vertices), 3);
  const a_Color = initArrayBuffer(gl, 'a_Color', gl_Program, new Float32Array(mdl.colors), 3);
  const a_Normal = initArrayBuffer(gl, 'a_Normal', gl_Program, new Float32Array(mdl.normals), 3);

  const u_mvp = gl.getUniformLocation(gl_Program, 'u_mvp');
  const u_LightDirection = gl.getUniformLocation(gl_Program, 'u_LightDirection');
  const u_LightColor = gl.getUniformLocation(gl_Program, 'u_LightColor');
  const u_RevTrModel = gl.getUniformLocation(gl_Program, 'u_RevTrModel');
  const u_model = gl.getUniformLocation(gl_Program, 'u_model');

  let currAngleY = 130;
  let currAngleX = 0;
  let currModelAngleY = 0;
  document.body.addEventListener('keydown', (event) => {

    switch (event.keyCode) {
      case 65:
        currAngleY--;
        break;
      case 68:
        currAngleY++;
        break;
      case 87:
        currAngleX--;
        break;
      case 83:
        currAngleX++;
        break;
      case 188:
        currModelAngleY--;
        break;
      case 190:
        currModelAngleY++;
        break;
      default:
      console.log(event.keyCode);
        break;
    }
    draw();
  });
  draw();
  function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    const fov = 60;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 1;
    const far = 2000;

    let proj = setPerspective(fov, aspect, near, far);

    let model = setTranslation(0, 0, -100);
    model = mul(model, setRotationZ(180));
    model = mul(model, setRotationY(currModelAngleY));

    let view = setRotationY(currAngleY);
    view = mul(view, setRotationX(currAngleX));
    view = mul(view, setTranslation(0, 200,  1000));
    
    const camPos = [
      view[12],
      view[13],
      view[14]
    ];

    const up = [0, 1, 0];
    const fPos = [
      model[12],
      model[13],
      model[14]
    ];

    let camera = lookAt(camPos, fPos, up);
    camera = setInverse(camera);
    const vp = mul(proj, camera);
    const mvp = mul(vp, model);
    gl.uniformMatrix4fv(u_mvp, false, new Float32Array(mvp));
    gl.uniformMatrix4fv(u_RevTrModel, false, new Float32Array(transpose(setInverse(model))));
    gl.uniformMatrix4fv(u_model, false, model);
    gl.uniform3f(u_LightColor, 1, 1, 1);
    gl.uniform3f(u_LightDirection, 0.5, 0.7, 1);
    gl.drawArrays(primitiveType, drawOffset, mdl.vertices.length / 3); 
  }
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


function setPerspective(fov, aspect, near, far) {
  const fovRad = (Math.PI * fov) / 180;
  const tn = Math.tan(fovRad / 2);
  const sX = 1 / (aspect * tn);
  const sY = 1 / tn;
  const sZ = -((far + near) / (far - near));
  const tZ = -((2 * far * near) / (far - near));

  return [
    sX, 0,  0,  0,
    0, sY,  0,  0,
    0,  0, sZ, -1,
    0,  0, tZ,  0
  ];
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

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}



  function lookAt(cameraPosition, target, up) {
    var zAxis = normalize(
        subtractVectors(cameraPosition, target));
    var xAxis = normalize(cross(up, zAxis));
    var yAxis = normalize(cross(zAxis, xAxis));

    return [
       xAxis[0], xAxis[1], xAxis[2], 0,
       yAxis[0], yAxis[1], yAxis[2], 0,
       zAxis[0], zAxis[1], zAxis[2], 0,
       cameraPosition[0],
       cameraPosition[1],
       cameraPosition[2],
       1,
    ];
  };

function setInverse(m) {
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0  = m22 * m33;
  var tmp_1  = m32 * m23;
  var tmp_2  = m12 * m33;
  var tmp_3  = m32 * m13;
  var tmp_4  = m12 * m23;
  var tmp_5  = m22 * m13;
  var tmp_6  = m02 * m33;
  var tmp_7  = m32 * m03;
  var tmp_8  = m02 * m23;
  var tmp_9  = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;

  var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  return [
    d * t0,
    d * t1,
    d * t2,
    d * t3,
    d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
    d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
    d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
    d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
    d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
    d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
    d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
    d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
    d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
    d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
    d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
    d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
  ];
};


function transpose(m) {
  return [
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15],
  ];
};