uniform float uTime;

in vec3 velocity;
in float spawnTime;

void main() {
    float age = uTime - spawnTime;

    vec3 transformedPosition = position + velocity * age;
    
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(transformedPosition, 1.0);

    gl_Position = projectionMatrix * viewPosition;

    // Account for perspective effect on particles.
    gl_PointSize = 20.0 / -viewPosition.z;
}