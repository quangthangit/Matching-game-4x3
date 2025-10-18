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
    score,
    handleClick,
    reset,
    fmt,
  } = useGameLogic(data);

  return (
    <div className={styles.gameScreen}>
      <h1 className={styles.startTitle}>MATCH-A-ROO!</h1>
      <div className={styles.scoreContainer}>
        <div className={styles.scoreBox}>
          Score: <span className={styles.scoreValue}>{score}</span>
        </div>
        <div className={styles.scoreBox}>
          Time: <span className={styles.scoreValue}>{fmt(time)}</span>
        </div>
        <div className={styles.scoreBox}>
          Moves: <span className={styles.scoreValue}>{moves}</span>
        </div>
      </div>
      <div
        className={`${styles.grid} ${
          data.length === 16 ? styles.gridLarge : ""
        }`}
      >
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
      {plusOne && (
        <div key={moves} className={styles.plusOne}>
          +1
        </div>
      )}
      {finished && (
        <div className={`${styles.resultBox} ${!timeUp ? styles.victory : styles.defeat}`}>
          <h2 className={styles.title}>
            {!timeUp ? "🎉 You Win!" : "⏰ Time's Up!"}
          </h2>
          <div className={styles.subtitle}>
            {!timeUp
              ? "You matched all pairs. Awesome! 🏆"
              : "You ran out of time. Try again! 💪✨"}
          </div>
          <div className={styles.finalScore}>
            Score: <span className={styles.scoreValue2}>{score}</span>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              Moves<br />
              <span className={styles.statValue}>{moves}</span>
            </div>
            <div className={styles.statBox}>
              Time used<br />
              <span className={styles.statValue}>{fmt(TIME_LIMIT - time)}s</span>
            </div>
          </div>
          <div className={styles.playAgainWrapper}>
            <button className={styles.playAgainBtn} onClick={reset}>Play Again</button>
            <button className={styles.backBtn} onClick={onBack}>Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}
