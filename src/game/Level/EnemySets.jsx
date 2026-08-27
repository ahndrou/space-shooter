import { useCallback, useContext, useState } from "react";
import { useSpawnManager } from "./SpawnProvider";
import { createRandom3DRotation } from "../../helpers";
import { generateUUID } from "three/src/math/MathUtils.js";
import { BasicEnemy } from "../Enemies/BasicEnemy";
import { SnakeEnemy } from "../Enemies/SnakeEnemy";
import { ExplodingEnemy } from "../Enemies/ExplodingEnemy/ExplodingEnemy";
import Collectable from "../Enemies/Collectable";

const ENEMY_SIZE = 4;
const BASIC_ENEMY_COUNT = 100;
const SNAKE_COUNT = 5;
const EXPLODING_ENEMY_COUNT = 40;
const COLLECTABLES_COUNT = 30;

export function BasicEnemySet() {
  const { enemies, removeEnemy } = useEnemySet(BASIC_ENEMY_COUNT);

  return enemies.map((enemyData) => (
    <BasicEnemy
      key={enemyData.id}
      position={enemyData.position}
      size={ENEMY_SIZE}
    />
  ));
}

export function SnakeEnemySet({ playAreaSize, spaceshipRb }) {
  const { enemies, removeEnemy } = useEnemySet(SNAKE_COUNT);

  return enemies.map((enemyData) => (
    <SnakeEnemy
      key={enemyData.id}
      position={enemyData.position}
      segments={15}
      spaceshipRb={spaceshipRb}
      playAreaSize={playAreaSize}
      id={enemyData.id}
      onDeath={removeEnemy}
    />
  ));
}

export function ExplodingEnemySet() {
  const { enemies, removeEnemy } = useEnemySet(EXPLODING_ENEMY_COUNT);

  return enemies.map((enemyData) => {
    return (
      <ExplodingEnemy
        key={enemyData.id}
        id={enemyData.id}
        position={enemyData.position}
        rotation={enemyData.rotation}
        size={ENEMY_SIZE * 0.7}
        onDeath={removeEnemy}
      />
    );
  });
}

export function CollectableEnemySet({ playAreaSize }) {
  const { enemies, removeEnemy } = useEnemySet(COLLECTABLES_COUNT);

  return enemies.map((enemyData) => {
    return (
      <Collectable
        key={enemyData.id}
        id={enemyData.id}
        position={enemyData.position}
        rotation={enemyData.rotation}
        size={ENEMY_SIZE * 1.5}
        playAreaSize={playAreaSize}
        onDeath={removeEnemy}
      />
    );
  });
}

function useEnemySet(count) {
  const findInitialSpawnPosition = useSpawnManager();

  // Position & rotation get mutated during the game. These are just initial values.
  const [enemies, setEnemies] = useState(() =>
    Array.from({ length: count }, () => ({
      id: generateUUID(),
      position: findInitialSpawnPosition(ENEMY_SIZE),
      rotation: createRandom3DRotation(),
    })),
  );

  const removeEnemy = useCallback(
    (enemyId) => {
      setEnemies((enemies) => enemies.filter((enemy) => enemy.id !== enemyId));
    },
    [setEnemies],
  );

  return { enemies, removeEnemy };
}
