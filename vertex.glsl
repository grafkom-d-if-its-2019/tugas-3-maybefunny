precision mediump float;

attribute vec2 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform mat3 vMatrix;

void main() {
  fColor = vColor;

  gl_Position = vec4((vMatrix*vec3(vPosition, 1.0)).xy,0, 1.0);
}