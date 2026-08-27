import vertexShader from "../shaders/thruster/vertex.glsl";
import fragmentShader from "../shaders/thruster/fragment.glsl";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import {
  AdditiveBlending,
  DynamicDrawUsage,
  Quaternion,
  Spherical,
  Vector3,
} from "three";
import { useKeyboardControls } from "@react-three/drei";
import { lerp } from "three/src/math/MathUtils.js";

const PARTICLE_COUNT = 1000;
const PARTICLE_BASE_SPEED = 4;
const PARTICLE_RESTING_SPEED = 0.75;
const MAX_PARTICLE_SPREAD = 0.4;

export default function Thruster({ rigidBodyRef, positionOffset }) {
  return (
    // Points are initially set way outside of the play area. ThreeJS uses bounding
    // box based on these for frustrum culling. With frustrum culling on, this
    // results in the entire points object being culled.
    <points frustumCulled={false}>
      <BufferGeometry
        rigidBodyRef={rigidBodyRef}
        positionOffset={positionOffset}
      />
      <ShaderMaterial />
    </points>
  );
}

function BufferGeometry({ rigidBodyRef, positionOffset }) {
  const [initialPositions] = useState(() =>
    createInitialArrayValues(100000, 3),
  );
  const [initialVelocities] = useState(() => createInitialArrayValues(0, 3));
  const [initialSpawnTimes] = useState(() => createInitialArrayValues(0, 1));

  const positionRef = useRef();
  const velocityRef = useRef();
  const spawnTimeRef = useRef();

  const particleIndex = useRef(0);

  const [, getKeys] = useKeyboardControls();

  const currentParticleSpeed = useRef(0);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    const linvel = rigidBodyRef.current.linvel();
    const rotation = rigidBodyRef.current.rotation();
    const translation = rigidBodyRef.current.translation();

    const rbVelocity = new Vector3(linvel.x, linvel.y, linvel.z);
    const rbPosition = new Vector3(translation.x, translation.y, translation.z);
    const rbRotation = new Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w,
    );

    setNewSpawnPosition(
      positionRef,
      rbRotation,
      rbPosition,
      positionOffset,
      particleIndex,
    );

    let speedTarget = PARTICLE_RESTING_SPEED;

    if (getKeys().forward) speedTarget = PARTICLE_BASE_SPEED;

    currentParticleSpeed.current = lerp(
      currentParticleSpeed.current,
      speedTarget,
      0.06,
    );

    setNewSpawnVelocity(
      velocityRef,
      rbVelocity,
      rbRotation,
      currentParticleSpeed.current,
      particleIndex,
    );
    setNewSpawnTime(spawnTimeRef, state.clock.elapsedTime, particleIndex);

    particleIndex.current = (particleIndex.current + 1) % PARTICLE_COUNT;
  });

  return (
    <bufferGeometry>
      <bufferAttribute
        attach={"attributes-position"}
        args={[initialPositions, 3]}
        ref={positionRef}
        usage={DynamicDrawUsage}
      />

      <bufferAttribute
        attach={"attributes-velocity"}
        args={[initialVelocities, 3]}
        ref={velocityRef}
        usage={DynamicDrawUsage}
      />

      <bufferAttribute
        attach={"attributes-spawnTime"}
        args={[initialSpawnTimes, 1]}
        ref={spawnTimeRef}
        usage={DynamicDrawUsage}
      />
    </bufferGeometry>
  );
}

function ShaderMaterial() {
  const uniforms = useRef({
    uTime: { value: 0 },
  });

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.elapsedTime;
  });

  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms.current}
      transparent
      blending={AdditiveBlending}
      depthWrite={false}
    />
  );
}

function setNewSpawnPosition(
  positionAttributeRef,
  rbRotation,
  rbPosition,
  positionOffset,
  currentParticleIndex,
) {
  const newPosition = rbPosition
    .add(positionOffset.clone().applyQuaternion(rbRotation))
    .add(getRandomSphericalPosition(0.25));

  positionAttributeRef.current.setXYZ(
    currentParticleIndex.current,
    newPosition.x,
    newPosition.y,
    newPosition.z,
  );

  positionAttributeRef.current.needsUpdate = true;
}

function setNewSpawnVelocity(
  velocityAttributeRef,
  rbVelocity,
  rbRotation,
  particleSpeed,
  currentParticleIndex,
) {
  // Local +Z axis, rotated into world space
  const worldZAxis = new Vector3(
    Math.random() * MAX_PARTICLE_SPREAD,
    Math.random() * MAX_PARTICLE_SPREAD,
    1,
  )
    .normalize()
    .applyQuaternion(rbRotation);
  const exhaustVelocity = worldZAxis.multiplyScalar(particleSpeed);
  const totalVelocity = exhaustVelocity.add(rbVelocity.multiplyScalar(0.4));

  velocityAttributeRef.current.setXYZ(
    currentParticleIndex.current,
    totalVelocity.x,
    totalVelocity.y,
    totalVelocity.z,
  );

  velocityAttributeRef.current.needsUpdate = true;
}

function setNewSpawnTime(
  spawnTimeAttributeRef,
  currentTime,
  currentParticleIndex,
) {
  spawnTimeAttributeRef.current.setX(currentParticleIndex.current, currentTime);

  spawnTimeAttributeRef.current.needsUpdate = true;
}

function createInitialArrayValues(value, dimensions) {
  const values = new Float32Array(PARTICLE_COUNT * dimensions);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = 0; j < dimensions; j++) {
      values[i * dimensions + j] = value;
    }
  }

  return values;
}

function getRandomSphericalPosition(sphereRadius) {
  const spherical = new Spherical(
    sphereRadius * (0.75 + Math.random() * 0.25),
    Math.random() * Math.PI,
    Math.random() * Math.PI * 2,
  );

  return new Vector3().setFromSpherical(spherical);
}
