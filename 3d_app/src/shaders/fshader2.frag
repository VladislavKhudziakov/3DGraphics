precision highp float;
uniform vec3 u_ColorMult;
// uniform vec3 u_LightPosition;
// uniform vec3 u_CameraPosition;
// uniform vec3 u_LightColor;
// uniform float u_HighlightPower;

varying vec4 v_Color;
varying vec3 v_Normal;
// varying vec3 v_worldVertPos;

void main() {
  vec3 pixelColor = normalize(v_Color.rgb) * u_ColorMult;
  // vec3 lightDirection = u_LightPosition - v_worldVertPos;
  // vec3 cameraDirection = u_CameraPosition - v_worldVertPos;
  // vec3 halfVector = lightDirection + cameraDirection;

  // float nDotL = dot(v_Normal, normalize(lightDirection));
  // float nDotH = pow(dot(v_Normal, normalize(halfVector)), u_HighlightPower);
  
  // vec3 lightColor = normalize(u_LightColor);
  // vec3 color = (lightColor * pixelColor * nDotL) + nDotH;

  gl_FragColor = vec4(pixelColor, 1.);
}