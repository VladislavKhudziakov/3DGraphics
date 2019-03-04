attribute vec4 a_Position;
attribute vec4 a_Color;
// attribute vec3 a_Normal;

uniform mat4 u_MVP;
// uniform mat4 u_RTModel;
// uniform mat4 u_Model;

varying vec4 v_Color;
// varying vec3 v_Normal;
// varying vec3 v_worldVertPos;

void main() {
  gl_Position = u_MVP * a_Position;
  
  v_Color = a_Color;
  // v_Normal =  normalize(mat3(u_RTModel) * a_Normal);
  // v_worldVertPos = vec3(u_Model * a_Position);
}