precision highp float;
uniform vec3 u_ColorMult;
uniform vec3 u_ColorOffset;

varying vec4 v_Color;
varying vec3 v_Normal;

void main() {
  vec3 pixelColor = normalize(v_Color.rgb) * u_ColorMult + u_ColorOffset;

  gl_FragColor = vec4(pixelColor, 1.);
}