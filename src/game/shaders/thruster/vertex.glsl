uniform float uTime;

void main() {
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewPosition;

    // Account for perspective effect on particles.
    gl_PointSize = 20.0 / -viewPosition.z;
}