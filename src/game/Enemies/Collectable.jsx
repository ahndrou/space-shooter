import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import useCentralSteering from "../hooks/useCentralSteering";
import { useRef, useState } from "react";
import useRandomTorque from "../hooks/useRandomTorque";
import Explosion from "../Exploder/Explosion";
import { Vector3 } from "three";
import { useScoreStore } from "../../stores/useScoreStore";
import { Exploder, useExploder } from "../Exploder/Exploder";

const COLOR = "#FFB000";
const WIREFRAME_COLOR = "#ffffff";

export default function Collectable({
  position,
  rotation,
  size,
  playAreaSize,
  id,
  onDeath,
}) {
  return (
    <Exploder color={COLOR} onExplosionCompletion={() => onDeath(id)}>
      <CollectableRigidBody
        position={position}
        rotation={rotation}
        size={size}
        playAreaSize={playAreaSize}
      />
    </Exploder>
  );
}

function CollectableRigidBody({ position, rotation, size, playAreaSize }) {
  const gltf = useGLTF("./space_shooter_collectable.glb");
  const triggerExplosion = useExploder();
  const rigidBody = useRef();

  // Don't want to get the collectables stuck where the player can't reach.
  useCentralSteering(rigidBody, playAreaSize, 0.9, 20);
  useRandomTorque(10, 20, rigidBody);

  const incrementScore = useScoreStore((state) => state.increment);

  const handleCollision = (collisionPayload) => {
    if (
      collisionPayload.other.rigidBody?.userData?.type === "player" ||
      collisionPayload.other.rigidBody?.userData?.type === "bullet"
    ) {
      incrementScore(2);
      triggerExplosion(
        new Vector3(
          rigidBody.current.translation().x,
          rigidBody.current.translation().y,
          rigidBody.current.translation().z,
        ),
      );
    }
  };

  return (
    <RigidBody
      ref={rigidBody}
      position={position}
      rotation={rotation}
      scale={size}
      colliders={false}
      onCollisionEnter={handleCollision}
    >
      <BallCollider args={[size * 0.15]} restitution={1} />
      <mesh geometry={gltf.meshes["Base"].geometry}>
        <meshBasicMaterial transparent opacity={0.85} color={COLOR} />
      </mesh>
      <mesh geometry={gltf.meshes["Wireframe"].geometry} scale={1.01}>
        <meshBasicMaterial color={WIREFRAME_COLOR} />
      </mesh>
    </RigidBody>
  );
}
