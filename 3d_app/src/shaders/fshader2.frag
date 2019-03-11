precision highp float;

// varying vec4 v_Color;
varying vec3 v_Normal;
varying vec2 v_uv;

uniform sampler2D u_texture;

void main() {
  // vec3 pixelColor = normalize(v_Color.rgb);
  // vec4 attr_color = vec4(pixelColor, 1.);
  vec4 color = texture2D(u_texture, v_uv);

  gl_FragColor = color;

  // gl_FragColor = vec4(1., 0., 0., 1.);
}