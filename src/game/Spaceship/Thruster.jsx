import vertexShader from "../shaders/thruster/vertex.glsl";
import fragmentShader from "../shaders/thruster/fragment.glsl";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { DynamicDrawUsage, Spherical, Vector3 } from "three";

const PARTICLE_COUNT = 300;

export default function Thruster({ rigidBodyRef }) {
  return (
    // Points are initially set way outside of the play area. ThreeJS uses bounding
    // box based on these for frustrum culling. With frustrum culling on, this
    // results in the entire points object being culled.
    <points frustumCulled={false}>
      <BufferGeometry rigidBodyRef={rigidBodyRef} />
      <ShaderMaterial />
    </points>
  );
}

function BufferGeometry({ rigidBodyRef }) {
  const particlePositions = useRef(createInitialPositions());

  const positionAttributeRef = useRef();

  const bufferIndex = useRef(0);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const newPosition = new Vector3(
      rigidBodyRef.current.translation().x,
      rigidBodyRef.current.translation().y,
      rigidBodyRef.current.translation().z,
    ).add(getRandomSphericalPosition(0.45));

    positionAttributeRef.current.setXYZ(
      bufferIndex.current,
      newPosition.x,
      newPosition.y,
      newPosition.z,
    );

    positionAttributeRef.current.needsUpdate = true;

    bufferIndex.current = (bufferIndex.current + 1) % PARTICLE_COUNT;
  });

  return (
    <bufferGeometry>
      <bufferAttribute
        attach={"attributes-position"}
        args={[particlePositions.current, 3]}
        ref={positionAttributeRef}
        usage={DynamicDrawUsage}
      />
    </bufferGeometry>
  );
}

function ShaderMaterial() {
  const uniforms = useRef({
    uTime: { value: 0 },
  });

  useFrame((state, delta) => {
    uniforms.current.uTime.value += delta;
  });

  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms.current}
    />
  );
}

// Acts to hide initial particles. The alternative is to set point size
// in the shader to zero, but this doesn't work on all systems.
function createInitialPositions() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);

  let i3 = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    i3 = i * 3;

    positions[i3] = 100000;
    positions[i3 + 1] = 100000;
    positions[i3 + 2] = 100000;
  }

  return positions;
}

function getRandomSphericalPosition(sphereRadius) {
  const spherical = new Spherical(
    sphereRadius * (0.75 + Math.random() * 0.25),
    Math.random() * Math.PI,
    Math.random() * Math.PI * 2,
  );

  return new Vector3().setFromSpherical(spherical);
}
