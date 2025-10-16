import { useState, useEffect } from "react";
import useSound from "use-sound";
import style from "./style.module.css";
import Card from "../Card/Card";

export default function GameScreen({ data, onBack }) {
  const TIME_LIMIT = 60;

  // ---------- STATE ----------
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState({ correct: [], wrong: [] });
  const [plusOne, setPlusOne] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(TIME_LIMIT);
  const [finished, setFinished] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  // ---------- CARDS ----------
  const [cards, setCards] = useState(() =>
    data
      .flatMap((item) => [
        { content: item.text, type: "text" },
        { content: item.image, type: "image" },
      ])
      .sort(() => Math.random() - 0.5)
  );

  // ---------- ÂM THANH ----------
  const loadSound = (name) => {
    try {
      return new URL(`../../../assets/sounds/${name}.wav`, import.meta.url).href;
    } catch {
      return "";
    }
  };

  const [playSelect] = useSound(loadSound("select"), { volume: 0.5 });
  const [playMatch] = useSound(loadSound("match"), { volume: 0.6 });
  const [playError] = useSound(loadSound("error"), { volume: 0.6 });
  const [playWin] = useSound(loadSound("win"), { volume: 0.7 });

  const sounds = {
    select: () => playSelect?.(),
    match: () => playMatch?.(),
    error: () => playError?.(),
    win: () => {
      if (playWin) return playWin();
      [500, 700, 900].forEach((f, i) => setTimeout(() => beep(f, 150), i * 150));
    },
  };

  // ---------- TIMER ----------
  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setFinished(true);
          setTimeUp(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  // ---------- WIN ----------
  useEffect(() => {
    if (matched.length === data.length * 2 && data.length) {
      setFinished(true);
      sounds.win();
    }
  }, [matched, data.length]);

  // ---------- CLICK ----------
  const handleClick = (card, index) => {
    if (selected.length === 2 || matched.includes(card.content) || timeUp) return;

    sounds.select();
    const newSel = [...selected, { ...card, index }];
    setSelected(newSel);
    if (newSel.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = newSel;
    const isMatch = data.some(
      (pair) =>
        (pair.text === a.content && pair.image === b.content) ||
        (pair.image === a.content && pair.text === b.content)
    );

    if (isMatch) {
      sounds.match();
      setFlash({ correct: [a.index, b.index], wrong: [] });
      setPlusOne(true);
      setTimeout(() => {
        setMatched((m) => [...m, a.content, b.content]);
        setSelected([]);
        setFlash({ correct: [], wrong: [] });
        setPlusOne(false);
      }, 350);
    } else {
      sounds.error();
      setFlash({ correct: [], wrong: [a.index, b.index] });
      setTimeout(() => {
        setSelected([]);
        setFlash({ correct: [], wrong: [] });
      }, 800);
    }
  };

  // ---------- UTILS ----------
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const reset = () => {
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setTime(TIME_LIMIT);
    setFinished(false);
    setTimeUp(false);
    setCards(
      data
        .flatMap((i) => [
          { content: i.text, type: "text" },
          { content: i.image, type: "image" },
        ])
        .sort(() => Math.random() - 0.5)
    );
  };

  // ---------- UI ----------
  return (
    <div className={style.container}>
      <h1 className={style.title}>MATCH-A-ROO!</h1>

      <div className={style.scoreContainer}>
        <div className={style.scoreBox}>SCORE: {matched.length / 2}</div>
        <div className={style.scoreBox}>TIME: {fmt(time)}</div>
        <div className={style.scoreBox}>MOVES: {moves}</div>
      </div>

      <div className={style.grid}>
        {cards.map((card, i) => (
          <Card
            key={i}
            content={card.content}
            type={card.type}
            isSelected={selected.some((s) => s.index === i)}
            isMatched={matched.includes(card.content)}
            isCorrectFlash={flash.correct.includes(i)}
            isWrongFlash={flash.wrong.includes(i)}
            onClick={() => handleClick(card, i)}
          />
        ))}
      </div>

      {plusOne && <div key={moves} className={style.plusOne}>+1</div>}

      {finished && (
        <div className={style.resultBox}>
          <h2>{timeUp ? "⏰ Time's Up!" : "🎉 You finished the game!"}</h2>
          <p>Total time: {fmt(TIME_LIMIT -time)}</p>
          <p>Total score: {matched.length / 2}</p>
          <p>Total moves: {moves}</p>
          <div className={style.buttonContainer}>
            <button className={style.playAgainBtn} onClick={reset}>🎮 Play Again</button>
            <button className={style.backBtn} onClick={onBack}>🏠 Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}
