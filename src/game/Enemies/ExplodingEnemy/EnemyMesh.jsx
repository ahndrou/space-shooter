import { useGLTF } from "@react-three/drei";
import AnimatedScaleMaterial from "./AnimatedScaleMaterial";

export default function EnemyMesh({
  size,
  color,
  animationActive,
  onAnimationCompletion,
}) {
  const gltf = useGLTF("./space_shooter_enemy_explosive.glb");

  return (
    <group scale={size}>
      <mesh geometry={gltf.meshes.Base.geometry}>
        <AnimatedScaleMaterial
          color={color}
          transparent={true}
          opacity={0.85}
          animationActive={animationActive}
          onAnimationCompletion={onAnimationCompletion}
        />
      </mesh>
      <mesh geometry={gltf.meshes.Wireframe.geometry}>
        <AnimatedScaleMaterial
          color={[1, 1, 1]}
          animationActive={animationActive}
          onAnimationCompletion={onAnimationCompletion}
        />
      </mesh>
    </group>
  );
}
