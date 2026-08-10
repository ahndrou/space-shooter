attribute vec3 aSpawnPosition;
attribute vec3 aVelocity;

uniform float uTime;

const vec3 velocity = vec3(0, 0, 1.0);

void main() {
    vec3 transformedPosition = position;
    float progress = mod(uTime, 2.0);
    vec3 displacement = velocity * vec3(progress);
    transformedPosition += displacement;

    vec4 viewPosition = viewMatrix * modelMatrix * vec4(transformedPosition, 1.0);

    gl_Position = projectionMatrix * viewPosition;

    // Projection matrix handles the point positions with distance. This handles the
    // size of the individual points with perspective.
    gl_PointSize *= 1.0 / - viewPosition.z;
}