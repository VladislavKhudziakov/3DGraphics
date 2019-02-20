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


function setTranslation(x, y, z) {
  const translation = [
    1, 0, 0, 0,
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    x, y, z, 1
  ];
  return translation;
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

export {setScaling, setRotationX, setRotationY, setRotationZ, setSingle, setOrtho, mul, setTranslation};