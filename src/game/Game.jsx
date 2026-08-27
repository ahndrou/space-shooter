import { useRef } from "react";
import { useGameStateStore } from "../stores/useGameStateStore";
import { Physics } from "@react-three/rapier";
import Spaceship from "./Spaceship/Spaceship";
import Level from "./Level/Level";
import PlayArea from "./PlayArea";
import { useHealthStore } from "../stores/useHealthStore";
import Player from "./Player";

const PLAY_AREA_SIZE = 175;

export default function Game() {
  const gameID = useGameStateStore((state) => state.gameID);

  return (
    <Physics key={gameID} gravity={[0, 0, 0]} timeStep={"vary"}>
      <Level playAreaSize={PLAY_AREA_SIZE} />
      <PlayArea size={PLAY_AREA_SIZE} />
      <Player playAreaSize={PLAY_AREA_SIZE} />
    </Physics>
  );
}
