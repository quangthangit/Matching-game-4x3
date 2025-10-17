import { useState } from "react";
import GameScreen from "./GameScreen";
import StartScreen from "./StartScreen";
import styles from "./matching-game.module.css";

export default function MatchingGame4x3({data}) {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className={styles.gameContainer}>
      {isStarted ? (
        <GameScreen data={data} onBack={() => setIsStarted(false)} />
      ) : (
        <StartScreen onStart={() => setIsStarted(true)} />
      )}
    </div>
  );
}
