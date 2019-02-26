
export class Uniform {

  constructor(gl, program, unifromName, data) {
    this._gl = gl;
    this.program = program;
    this.name = unifromName;
    this.data = data;

    return this;
  };


  init() {
    const gl = this._gl;
    this.uniform = gl.getUniformLocation(this.program, this.name);

    return this;
  };

  sendFloatMatrix(index) {
    const gl = this._gl;
    const floatData = new Float32Array(this.data.elements);
    switch (index) {
      case 2:
        gl.uniformMatrix2fv(this.uniform, false, floatData);
        break;
      case 3:
        gl.uniformMatrix3fv(this.uniform, false, floatData);
        break;
      case 4:
        gl.uniformMatrix4fv(this.uniform, false, floatData);
        break;
      default:
        console.error('invalid matrix index');
        break;
    }

    return this;
  };


  sendFloatVector(index) {
    const gl = this._gl;
    const floatData = new Float32Array(this.data.elements);
    switch (index) {
      case 2:
        gl.uniform2fv(this.uniform, floatData);
        break;
      case 3:
        gl.uniform3fv(this.uniform, floatData);
        break;
      case 4:
        gl.uniform4fv(this.uniform, floatData);
        break;
      default:
        console.error('invalid vector index');
        break;
    };

    return this;
  };
 
  
  sendFloat() {
    const gl = this._gl;
    gl.uniform1f(this.uniform, this.data);

    return this;
  };


  sendInt() {
    const gl = this._gl;
    gl.uniform1i(this.uniform, this.data);

    return this;
  };
}