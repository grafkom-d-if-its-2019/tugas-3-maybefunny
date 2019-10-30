precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform mat4 vMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
  fColor = vColor;

  gl_Position = projectionMatrix*viewMatrix*vMatrix*vec4(vPosition, 1.0);
}