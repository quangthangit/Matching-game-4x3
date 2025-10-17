import styles from "./matching-game.module.css";

export default function Card({ content, isSelected, isMatched, isCorrectFlash, isWrongFlash, onClick, type }) {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${
        isMatched ? styles.matched : ''
      } ${isCorrectFlash ? styles.correctFlash : ''} ${isWrongFlash ? styles.wrongFlash : ''}`}
      onClick={!isMatched ? onClick : undefined}
    >
      {type === "text" ? (
        <div className={styles.content}>{content}</div>
      ) : (
        <img
          src={content}
          alt="card"
          className={styles.img}
        />
      )}
    </div>
  );
}
