export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.elements = [x, y, z];
  }

  sub(other) {
    let a = this.elements;
    let b = other.elements;
    this.elements = [
      a[0] - b[0], 
      a[1] - b[1], 
      a[2] - b[2]
    ];
    
    return this;
  }


  normalize() {
    let v = this.elements;
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    
    if (length > 0.00001) {
      this.elements = [v[0] / length, v[1] / length, v[2] / length];
    } else {
      this.elements = [0, 0, 0];
    }
    
    return this;
  }

  cross(other) {
    const a = this.elements;
    const b = other.elements;
    this.elements = [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
    
    return this;
  }
}