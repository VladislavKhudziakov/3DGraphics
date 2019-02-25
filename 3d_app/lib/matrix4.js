import {Vec3} from "./vector3.js";

export class Mat4 {
  constructor() {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }


  setScale(x, y, z) {
    this.elements = [
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ];

    return this;
  }


  setTranslate(x, y, z) {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 0
    ];

    return this;
  }


  setAngleX(angle) {
    const rad = (angle * Math.PI) / 180;

    const s = Math.sin(rad);
    const c = Math.cos(rad);

    this.elements = [
      1,  0,  0,  0,
      0,  c,  s,  0,
      0, -s,  c,  0, 
      0,  0,  0,  1
    ];

    return this;
  }


  setAngleY(angle) {
    const rad = (angle * Math.PI) / 180;

    const s = Math.sin(rad);
    const c = Math.cos(rad);

    this.elements = [
      c,  0, -s,  0,
      0,  1,  0,  0, 
      s,  0,  c,  0, 
      0,  0,  0,  1
    ];
    return this;
  }


  setAngleZ(angle) {
    const rad = (angle * Math.PI) / 180;

    const s = Math.sin(rad);
    const c = Math.cos(rad);

    this.elements = [
      c,  s,  0,  0,
     -s,  c,  0,  0, 
      0,  0,  1,  0, 
      0,  0,  0,  1
    ];

    return this;
  }


  scale(x, y, z) {
    const matrix = new Mat4();
    matrix.setScale(x, y, z);

    this.mul(matrix);

    return this;
  };


  translate(x, y, z) {
    const matrix = new Mat4();
    matrix.setTranslate(x, y, z);

    this.mul(matrix);

    return this;
  }


  rotate(aX, aY, aZ) {
    const matrix = new Mat4();
    matrix.setAngleX(aX).rotateY(aY).rotateZ(aZ);

    this.mul(matrix);

    return this;
  }


  rotateX(angle) {
    const matrix = new Mat4();
    matrix.setAngleX(angle);

    this.mul(matrix);

    return this;
  }


  rotateY(angle) {
    const matrix = new Mat4();
    matrix.setAngleY(angle);

    this.mul(matrix);

    return this;
  }


  rotateZ(angle) {
    const matrix = new Mat4();
    matrix.setAngleZ(angle);

    this.mul(matrix);

    return this;
  }


  setOrtho(left, right, top, bottom, near, far) {
    const sX = 2 / (right - left);
    const sY = 2 / (top - bottom);
    const sZ = 2 / (near - far);
    const oX = (left + right) / (left - right);
    const oY = (bottom + top) / (bottom - top);
    const oZ = (near + far) / (near - far);
    
    this.elements = [
     sX,  0,  0,  0,
      0, sY,  0,  0,
      0,  0, sZ,  0,
     oX, oY, oZ,  1,
    ];
  
    return this;
  }

  setPerspective(fov, aspect, near, far) {
    const fovRad = (Math.PI * fov) / 180;
    const tn = Math.tan(fovRad / 2);
    const sX = 1 / (aspect * tn);
    const sY = 1 / tn;
    const sZ = -((far + near) / (far - near));
    const tZ = -((2 * far * near) / (far - near));
  
    this.elements = [
      sX, 0,  0,  0,
      0, sY,  0,  0,
      0,  0, sZ, -1,
      0,  0, tZ,  0
    ];

    return this;
  }

  setLookAt(camPos, targetPos, up) {
    
    const zAxis = new Vec3(camPos.elements[0], camPos.elements[1], camPos.elements[2]);
    zAxis.sub(targetPos).normalize();
    const xAxis = new Vec3(up.elements[0], up.elements[1], up.elements[2]);
    xAxis.cross(zAxis).normalize();
    var yAxis =  new Vec3(zAxis.elements[0], zAxis.elements[1], zAxis.elements[2]);
    yAxis.cross(xAxis).normalize();
    
    this.elements = [
      xAxis.elements[0], xAxis.elements[1], xAxis.elements[2], 0,
      yAxis.elements[0], yAxis.elements[1], yAxis.elements[2], 0,
      zAxis.elements[0], zAxis.elements[1], zAxis.elements[2], 0,
      camPos.elements[0],
      camPos.elements[1],
      camPos.elements[2],
      1,
    ];

    return this;
  }


  mul(m) {
    let ai0, ai1, ai2, ai3;
  
  // Calculate e = a * b
    let e = new Array(16);
    let a = this.elements;
    let b = m.elements;
    
    // If e equals b, copy b to temporary matrix.
    if (e === b) {
      b = new Array(16);
      for (i = 0; i < 16; ++i) {
        b[i] = e[i];
      }
    }
    
    for (let i = 0; i < 4; i++) {
      ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
      e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
      e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
      e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
      e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }

    this.elements = e;
    
    return this;
  }

  inverse() {
    let i, det;
  
    let s = this.elements;
    let d =  new Array(16);
    let inv = new Array(16);
  
    inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
              + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
    inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
              - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
    inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
              + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
    inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
              - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];
  
    inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
              - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
    inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
              + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
    inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
              - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
    inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
              + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];
  
    inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
              + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
    inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
              - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
    inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
              + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
    inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
              - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];
  
    inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
              - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
    inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
              + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
    inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
              - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
    inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
              + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];
  
    det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
    if (det === 0) {
      return this;
    }
  
    det = 1 / det;
    for (i = 0; i < 16; i++) {
      d[i] = inv[i] * det;
    }
  
    return this;
  }


  transpose = function() {
    let e, t;
  
    e = this.elements;
  
    t = e[ 1];  e[ 1] = e[ 4];  e[ 4] = t;
    t = e[ 2];  e[ 2] = e[ 8];  e[ 8] = t;
    t = e[ 3];  e[ 3] = e[12];  e[12] = t;
    t = e[ 6];  e[ 6] = e[ 9];  e[ 9] = t;
    t = e[ 7];  e[ 7] = e[13];  e[13] = t;
    t = e[11];  e[11] = e[14];  e[14] = t;
  
    return this;
  }
}