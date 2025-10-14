import { useState } from "react";
import GameScreen from "./GameScreen/GameScreen";
import StartScreen from "./StartScreen/StartScreen";
import style from "./style.module.css";

const sampleData = [
  { text: "Apple", image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg" },
  { text: "Banana", image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg" },
  { text: "Strawberry", image: "https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg" },
  { text: "Grape", image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Table_grapes_on_white.jpg" },
  { text: "Orange", image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg" },
  { text: "Pineapple", image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg" },
];

export default function MatchingGame4x3() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className={style.container}>
      {isStarted ? (
        <GameScreen data={sampleData} onBack={() => setIsStarted(false)} />
      ) : (
        <StartScreen onStart={() => setIsStarted(true)} />
      )}
    </div>
  );
}
