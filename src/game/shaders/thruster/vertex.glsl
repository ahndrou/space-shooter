uniform float uTime;

void main() {
    vec3 transformedPosition = position;

    transformedPosition.z += uTime;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(transformedPosition, 1.0);
    gl_PointSize = 2.0;
}