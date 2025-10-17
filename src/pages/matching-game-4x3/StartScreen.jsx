import styles from "./matching-game.module.css";

export default function StartScreen({ onStart }) {
  return (
    <div className={styles.startScreen}>
      <div className={styles.startContent}>
        <h1 className={styles.startTitle}>MATCH-A-ROO!</h1>
        <button className={`${styles.btn} ${styles.btnStart}`} onClick={onStart}>
          <span className={styles.buttonIcon}>🚀</span>
          <span className={styles.buttonText}>BẮT ĐẦU CHƠI</span>
        </button>
      </div>
    </div>
  );
}
