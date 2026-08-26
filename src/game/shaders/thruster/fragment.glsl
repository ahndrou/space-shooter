in float vAge;

const float FADE_FACTOR = 1.2;

void main() {
    float alpha = max(0.0, 1.0 - vAge * FADE_FACTOR);
    gl_FragColor = vec4(vec3(1.0), alpha);
}