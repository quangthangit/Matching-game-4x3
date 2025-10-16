import style from "./style.module.css";

export default function Card({ content, isSelected, isMatched, isCorrectFlash, isWrongFlash, onClick, type }) {
  return (
    <div
      className={`${style.card} ${isSelected ? style.selected : ""} ${
        isMatched ? style.matched : ""
      } ${isCorrectFlash ? style.correctFlash : ""} ${isWrongFlash ? style.wrongFlash : ""}`}
      onClick={!isMatched ? onClick : undefined}
    >
      {type === "text" ? (
        <div className={style.content}>{content}</div>
      ) : (
        <img
          src={content}
          alt="card"
          className={style.img}
        />
      )}
    </div>
  );
}
