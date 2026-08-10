import vertexShader from "../shaders/thruster/vertex.glsl";
import fragmentShader from "../shaders/thruster/fragment.glsl";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Spherical, Vector3 } from "three";

const PARTICLE_COUNT = 1000;

export default function Thruster({ rigidBodyRef }) {
  const [particlePositions] = useState(() => createParticlePositions(0.5));
  const pointsRef = useRef();

  const uniforms = useRef({
    uTime: { value: 0 },
  });

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !pointsRef.current) return;

    const translation = rigidBodyRef.current.translation();
    const rotation = rigidBodyRef.current.rotation();

    pointsRef.current.position.set(translation.x, translation.y, translation.z);

    pointsRef.current.quaternion.set(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w,
    );

    uniforms.current.uTime.value += delta;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach={"attributes-position"}
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </points>
  );
}

function createParticlePositions(sphereRadius) {
  const positions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    const spherical = new Spherical(
      sphereRadius * (0.75 + Math.random() * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    );

    const position = new Vector3().setFromSpherical(spherical);

    positions[i3] = position.x;
    positions[i3 + 1] = position.y;
    positions[i3 + 2] = position.z;
  }

  return positions;
}
