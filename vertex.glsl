precision mediump float;

attribute vec2 vPosition;
attribute vec3 vColor;
varying vec3 fColor;

void main() {
  fColor = vColor;

  gl_Position = vec4(vPosition, 0.0, 1.0);
}
