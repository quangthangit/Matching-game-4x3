import { useState, useEffect, useRef } from "react";
import style from "./style.module.css";
import Card from "../Card/Card";

export default function GameScreen({ data, onBack }) {
  const TIME_LIMIT = 60; // 1 minute limit
  const [opened, setOpened] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(TIME_LIMIT);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [cards, setCards] = useState(() =>
    data
      .flatMap((item) => [
        { content: item.text, type: "text" },
        { content: item.image, type: "image" },
      ])
      .sort(() => Math.random() - 0.5)
  );

  const audioCtxRef = useRef(null);
  if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

  const playBeep = (freq = 440, duration = 150) => {
    const oscillator = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = freq;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    oscillator.start();
    oscillator.stop(audioCtxRef.current.currentTime + duration / 1000);
  };

  const sounds = {
    select: () => playBeep(600, 100),
    match: () => playBeep(800, 150),
    error: () => playBeep(300, 200),
    win: () => {
      playBeep(500, 150);
      setTimeout(() => playBeep(700, 150), 150);
      setTimeout(() => playBeep(900, 150), 300);
    },
  };

  useEffect(() => {
    if (gameCompleted || timeUp) return;
    
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeUp(true);
          setGameCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameCompleted, timeUp]);

  useEffect(() => {
    if (matched.length === data.length * 2 && data.length > 0) {
      setGameCompleted(true);
      sounds.win();
    }
  }, [matched, data.length]);

  const handleCardClick = (card, index) => {
    if (opened.length === 2 || matched.includes(card.content) || timeUp) return;

    sounds.select();
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
        sounds.match();
        setMatched((prev) => [...prev, first.content, second.content]);
      } else {
        sounds.error();
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
    setElapsedTime(TIME_LIMIT);
    setGameCompleted(false);
    setTimeUp(false);
    setCards(
      data
        .flatMap((item) => [
          { content: item.text, type: "text" },
          { content: item.image, type: "image" },
        ])
        .sort(() => Math.random() - 0.5)
    );
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
            opened.some((c) => c.index === index) || matched.includes(card.content);

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
          <h2>{timeUp ? "⏰ Time's Up!" : "🎉 You finished the game!"}</h2>
          <p>Total time: {formatTime(timeUp ? 0 : elapsedTime)}</p>
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
