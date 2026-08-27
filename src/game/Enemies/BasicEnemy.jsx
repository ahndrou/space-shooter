import { BallCollider, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import useRandomTorque from "../hooks/useRandomTorque";
import useRandomImpulse from "../hooks/useRandomImpulse";

const MIN_TORQUE = 7;
const MAX_TORQUE = 12;
const MIN_FORCE = 3500;
const MAX_FORCE = 5000;

const COLOR = "#8C5BFF";

export default React.memo(BasicEnemy);

export function BasicEnemy({ position, size }) {
  const gltf = useGLTF("./space_shooter_enemy_basic.glb");
  const rb = useRef();

  useRandomImpulse(rb, MIN_FORCE, MAX_FORCE);
  useRandomTorque(MIN_TORQUE, MAX_TORQUE, rb);

  return (
    <RigidBody
      type="dynamic"
      position={position}
      ref={rb}
      colliders={false}
      canSleep={false}
      angularDamping={0.4}
      linearDamping={0}
      userData={{ type: "basic enemy" }}
    >
      <BallCollider args={[size * 0.97]} restitution={1} />
      <group scale={size}>
        <mesh geometry={gltf.meshes.Icosphere_1.geometry}>
          <meshBasicMaterial color={COLOR} transparent opacity={0.85} />
        </mesh>

        <mesh geometry={gltf.meshes.Icosphere_2.geometry}>
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </RigidBody>
  );
}
