import Card from "./Card";
import { useGameLogic } from "./useGameLogic";
import styles from "./matching-game.module.css";

export default function GameScreen({ data, onBack }) {
  const {
    TIME_LIMIT,
    selected,
    matched,
    flash,
    plusOne,
    moves,
    time,
    finished,
    timeUp,
    cards,
    handleClick,
    reset,
    fmt,
  } = useGameLogic(data);

  return (
    <div className={styles.gameScreen}>
      <h1 className={styles.startTitle}>MATCH-A-ROO!</h1>

      <div className={styles.scoreContainer}>
        <div className={styles.scoreBox}>
          Score: <span className={styles.scoreValue}>{matched.length / 2}</span>
        </div>
        <div className={styles.scoreBox}>
          Time: <span className={styles.scoreValue}>{fmt(time)}</span>
        </div>
        <div className={styles.scoreBox}>
          Moves: <span className={styles.scoreValue}>{moves}</span>
        </div>
      </div>

      <div className={`${styles.grid} ${data.length === 16 ? styles.gridLarge : ''}`}>
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

      {plusOne && <div key={moves} className={styles.plusOne}>+1</div>}

      {finished && (
        <div className={styles.resultBox}>
          <h2>{timeUp ? "⏰ Time's Up!" : "🎉 You finished the game!"}</h2>
          <p>Total time: {fmt(TIME_LIMIT - time)}</p>
          <p>Total score: {matched.length / 2}</p>
          <p>Total moves: {moves}</p>
          <div className={styles.buttonContainer}>
            <button className={`${styles.btn} ${styles.btnPlay}`} onClick={reset}>🎮 Play Again</button>
            <button className={`${styles.btn} ${styles.btnBack}`} onClick={onBack}>🏠 Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}
