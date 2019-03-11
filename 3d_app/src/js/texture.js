export class Texture {
  constructor(gl, img) {
    this.gl = gl;
    this.texture = undefined;
    this.textureImage = img;

    return this;
  }

  create() {
    const gl = this.gl;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    if (this._isTexSizesPowerOfTwo()) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    return this;
  }

  _isTexSizesPowerOfTwo() {
    return this._isPowerOfTwo(this.textureImage.width) && 
    this._isPowerOfTwo(this.textureImage.height);
  }

  _isPowerOfTwo(value) {
    return (value & (value - 1)) == 0;
  }
}