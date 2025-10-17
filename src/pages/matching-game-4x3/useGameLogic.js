import { useEffect, useMemo, useState } from "react";
import useSound from "use-sound";

const TIME_LIMIT = 60;

const soundModules = import.meta.glob("../../assets/sounds/*.{mp3,wav,ogg}", {
  eager: true,
  import: "default",
});
const SOUND_URLS = Object.fromEntries(
  Object.entries(soundModules).map(([path, url]) => {
    const file = path.split("/").pop() || "";
    const name = file.replace(/\.(mp3|wav|ogg)$/i, "");
    return [name, url];
  })
);
const loadSound = (name) => SOUND_URLS[name];

export function useGameLogic(data) {
  // State
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState({ correct: [], wrong: [] });
  const [plusOne, setPlusOne] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(TIME_LIMIT);
  const [finished, setFinished] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const [cards, setCards] = useState(() =>
    data
      .flatMap((item) => [
        { content: item.text, type: "text" },
        { content: item.image, type: "image" },
      ])
      .sort(() => Math.random() - 0.5)
  );

  // Sounds
  const selectUrl = loadSound("select");
  const matchUrl = loadSound("match");
  const errorUrl = loadSound("error");
  const winUrl = loadSound("win");
  const [playSelect] = useSound(selectUrl || undefined, {
    volume: 0.85,
    interrupt: true,
  });
  const [playMatch] = useSound(matchUrl || undefined, {
    volume: 0.7,
    interrupt: true,
  });
  const [playError] = useSound(errorUrl || undefined, {
    volume: 0.85,
    interrupt: true,
  });
  const [playWin] = useSound(winUrl || undefined, {
    volume: 0.85,
    interrupt: true,
  });

  const sounds = useMemo(
    () => ({
      select: () => (selectUrl ? playSelect() : null),
      match: () => (matchUrl ? playMatch() : null),
      error: () => (errorUrl ? playError() : null),
      win: () => {
        if (winUrl) return playWin();
        [500, 700, 900].forEach((f, i) =>
          setTimeout(() => beep(f, 150), i * 150)
        );
      },
    }),
    [
      selectUrl,
      matchUrl,
      errorUrl,
      winUrl,
      playSelect,
      playMatch,
      playError,
      playWin,
    ]
  );

  // Timer
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => {
      setTime((v) => {
        if (v <= 1) {
          clearInterval(t);
          setFinished(true);
          setTimeUp(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [finished]);

  // Win detection
  useEffect(() => {
    if (matched.length === data.length * 2 && data.length) {
      setFinished(true);
      sounds.win();
    }
  }, [matched, data.length, sounds]);

  // Actions
  const handleClick = (card, index) => {
    if (selected.length === 2 || matched.includes(card.content) || timeUp)
      return;
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

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
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

  return {
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
  };
}
