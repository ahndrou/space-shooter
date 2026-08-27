import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import Skybox from "./Skybox";
import { Perf } from "r3f-perf";
import Interface from "../interface/Interface";
import { Bloom, EffectComposer, Scanline } from "@react-three/postprocessing";
import Game from "./Game";

export default function Experience() {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "space", keys: ["Space"] },
        ]}
      >
        <Canvas>
          <Perf position="bottom-right" />
          <Game />
          <Skybox />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.7}
              intensity={1.2}
              luminanceSmoothing={0.6}
            />
          </EffectComposer>
        </Canvas>
      </KeyboardControls>
      <Interface />
    </>
  );
}
