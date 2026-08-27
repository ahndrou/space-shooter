import { BallCollider, RigidBody } from "@react-three/rapier";
import EnemyMesh from "./EnemyMesh";
import React, { createContext, useContext, useRef, useState } from "react";
import useRandomTorque from "../../hooks/useRandomTorque";
import Explosion from "../../Exploder/Explosion";
import { Vector3 } from "three";
import { Exploder, useExploder } from "../../Exploder/Exploder";

const MIN_TORQUE = 20;
const MAX_TORQUE = 35;

const COLOR = "#B7FF3C";

export default React.memo(ExplodingEnemy);

// Stores the rbRef to get the mutated position to give the explosion.
// All this needs is to somehow get a rbRef for a position.
// Should be able to explode any child as long as it has its rbRef.

// Think of a better name for this - it is not just defined by it exploding.
export function ExplodingEnemy({ id, onDeath, position, rotation, size }) {
  return (
    <Exploder color={COLOR} onExplosionCompletion={() => onDeath(id)}>
      <EnemyRigidBody position={position} rotation={rotation} size={size} />
    </Exploder>
  );
}

function EnemyRigidBody({ position, rotation, size }) {
  const [isHit, setIsHit] = useState(false);

  const triggerExplosion = useExploder();
  const rigidBody = useRef();

  useRandomTorque(MIN_TORQUE, MAX_TORQUE, rigidBody);

  return (
    <RigidBody
      colliders={false}
      position={position}
      rotation={rotation}
      canSleep={false}
      ref={rigidBody}
      angularDamping={0.4}
      userData={{ type: "exploding enemy" }}
    >
      <BallCollider
        args={[size * 1.1]}
        onCollisionEnter={() => {
          setIsHit(true);
        }}
        restitution={1}
      />
      <EnemyMesh
        size={size}
        color={COLOR}
        animationActive={isHit}
        onAnimationCompletion={() =>
          triggerExplosion(
            new Vector3(
              rigidBody.current.translation().x,
              rigidBody.current.translation().y,
              rigidBody.current.translation().z,
            ),
          )
        }
      />
    </RigidBody>
  );
}
