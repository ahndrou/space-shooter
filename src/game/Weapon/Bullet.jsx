import { RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import { Trail } from "@react-three/drei";

const INITIAL_SPEED = 120;

const BULLET_COLOR = "#38E8FF";
const TRAIL_COLOR = "#C8FAFF";

export default React.memo(Bullet);

export function Bullet({ position, direction }) {
  const rb = useRef();

  useEffect(() => {
    const velocity = direction.clone().multiplyScalar(INITIAL_SPEED);
    rb.current.setLinvel(velocity);
  }, [direction]);

  return (
    // Trail ends seem to flicker a lot when used with Rapier Rigid Bodies.
    // I tried everything I could think of, but the only solution that seems to work is to
    // hide the flickering by hiding the ends of the trail with attenuation.
    <Trail
      color={TRAIL_COLOR}
      width={6}
      length={7}
      attenuation={(t) => (t < 0.02 || t > 0.98 ? 0 : t)}
    >
      <RigidBody
        ref={rb}
        type="dynamic"
        position={position}
        userData={{ type: "bullet" }}
      >
        <mesh>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color={BULLET_COLOR} />
        </mesh>
      </RigidBody>
    </Trail>
  );
}
