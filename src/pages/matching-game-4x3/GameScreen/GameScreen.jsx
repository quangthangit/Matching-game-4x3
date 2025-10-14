import { useState, useEffect } from "react";
import style from "./style.module.css";
import Card from "../card/Card";

export default function GameScreen({ data, onBack }) {
  const [opened, setOpened] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cards, setCards] = useState(() => {
    const mixed = data
      .flatMap((item) => [
        { content: item.text, type: "text" },
        { content: item.image, type: "image" },
      ])
      .sort(() => Math.random() - 0.5);
    return mixed;
  });

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    if (gameCompleted) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [gameCompleted]);

  useEffect(() => {
    if (matched.length === data.length * 2 && data.length > 0) {
      setGameCompleted(true);
    }
  }, [matched, data.length]);

  const handleCardClick = (card, index) => {
    if (opened.length === 2 || matched.includes(card.content)) return;

    const newOpened = [...opened, { ...card, index }];
    setOpened(newOpened);

    if (newOpened.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newOpened;

      const isMatch = data.some(
        (pair) =>
          (pair.text === first.content && pair.image === second.content) ||
          (pair.image === first.content && pair.text === second.content)
      );

      if (isMatch) {
        setMatched((prev) => [...prev, first.content, second.content]);
      }

      setTimeout(() => setOpened([]), 800);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayAgain = () => {
    setOpened([]);
    setMatched([]);
    setMoves(0);
    setElapsedTime(0);
    setGameCompleted(false);

    const newCards = data
      .flatMap((item) => [
        { content: item.text, type: "text" },
        { content: item.image, type: "image" },
      ])
      .sort(() => Math.random() - 0.5);
    setCards(newCards);
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>MATCH-A-ROO!</h1>

      <div className={style.scoreContainer}>
        <div className={style.scoreBox}>SCORE: {matched.length / 2}</div>
        <div className={style.scoreBox}>TIME: {formatTime(elapsedTime)}</div>
        <div className={style.scoreBox}>MOVES: {moves}</div>
      </div>

      <div className={style.grid}>
        {cards.map((card, index) => {
          const isFlipped =
            opened.some((c) => c.index === index) ||
            matched.includes(card.content);

          return (
            <Card
              key={index}
              content={card.content}
              type={card.type}
              flipped={isFlipped}
              isMatched={matched.includes(card.content)}
              onClick={() => handleCardClick(card, index)}
            />
          );
        })}
      </div>

      {gameCompleted && (
        <div className={style.resultBox}>
          <h2>🎉 You finished the game!</h2>
          <p>Total time: {formatTime(elapsedTime)}</p>
          <p>Total score: {matched.length / 2}</p>
          <p>Total moves: {moves}</p>

          <div className={style.buttonContainer}>
            <button className={style.playAgainBtn} onClick={handlePlayAgain}>
              🎮 Play Again
            </button>
            <button className={style.backBtn} onClick={onBack}>
              🏠 Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
