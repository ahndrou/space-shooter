void main() {
    // Base circular shape
    float strength = (0.5 - distance(gl_PointCoord, vec2(0.5))) * 2.0;

    gl_FragColor = vec4(0.2, 0.4, 0.8, strength);
}