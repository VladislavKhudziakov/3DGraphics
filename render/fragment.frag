precision highp float;

varying vec4 v_Color;

void main() {
  gl_FragColor = vec4(v_Color.rgb / 255., 1.);
}