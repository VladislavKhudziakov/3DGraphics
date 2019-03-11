attribute vec4 a_Position;
// attribute vec4 a_Color;
attribute vec2 a_uv;

uniform mat4 u_MVP;

// varying vec4 v_Color;
varying vec2 v_uv;

void main() {
  gl_Position = u_MVP * a_Position;
  
  // v_Color = a_Color;
  v_uv = a_uv;
}