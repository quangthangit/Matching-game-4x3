import style from "./style.module.css";

export default function StartScreen({ onStart }) {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1 className={style.title}>MATCH-A-ROO!</h1>
        <button className={style.startButton} onClick={onStart}>
          BẮT ĐẦU CHƠI
        </button>
      </div>
    </div>
  );
}
