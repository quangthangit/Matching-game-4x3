import { useState } from "react";
import GameScreen from "./GameScreen/GameScreen";
import StartScreen from "./StartScreen/StartScreen";
import style from "./style.module.css";

export default function MatchingGame4x3({data}) {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className={style.container}>
      {isStarted ? (
        <GameScreen data={data} onBack={() => setIsStarted(false)} />
      ) : (
        <StartScreen onStart={() => setIsStarted(true)} />
      )}
    </div>
  );
}
