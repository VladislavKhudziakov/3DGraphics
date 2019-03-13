export class Texture {
  constructor(gl, img, fileName) {
    this.gl = gl;
    this.texture = undefined;
    this.textureImage = img;
    this.fileName = fileName;

    return this;
  };


  createImageTexture(bind = true) {
    const gl = this.gl;
    this.texture = gl.createTexture();
    
    if (bind) {      
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
    
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
  };

  
  bind() {
    const gl = this.gl;
  
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    return this;
  };


  unbind() {
    const gl = this.gl;
  
    gl.bindTexture(gl.TEXTURE_2D, null);

    return this;
  };


  createEmptyTexture(width, height, border, level) {
    const gl = this.gl;
    this.width = width;
    this.height = height;
    this.level = level;
    this.border = border;

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, this.width, 
      this.height, this.border, gl.RGBA, 
      gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return this;
  };


  _isTexSizesPowerOfTwo() {
    return this._isPowerOfTwo(this.textureImage.width) && 
    this._isPowerOfTwo(this.textureImage.height);
  };


  _isPowerOfTwo(value) {
    return (value & (value - 1)) == 0;
  };
}