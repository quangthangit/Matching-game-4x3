import style from "./style.module.css";

export default function Card({ content, flipped, isMatched, onClick, type }) {
  return (
    <div
      className={`${style.card} ${flipped ? style.flipped : ""} ${
        isMatched ? style.matched : ""
      }`}
      onClick={!isMatched && !flipped ? onClick : undefined}
    >
      <div className={style.inner}>
        <div className={style.front}>
          <div className={style.questionMark}>?</div>
        </div>

        <div className={style.back}>
          {type === "text" ? (
            <div className={style.content}>{content}</div>
          ) : (
            <img
              src={content}
              alt="card"
              className={style.img}
            />
          )}
          {isMatched && <div className={style.matchGlow}></div>}
        </div>
      </div>
    </div>
  );
}
