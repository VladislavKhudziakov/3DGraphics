attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_mvp;
// uniform float u_zFactor;

varying vec4 v_Color;

void main()
{
  // vec4 vpos = u_mv * a_Position;
  
  // float zCoeff = 1. + vpos.z * u_zFactor;
  gl_Position = u_mvp * a_Position;

  v_Color = a_Color;
}