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
  const norm = (s = "") => s.trim().toLowerCase();
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState({ correct: [], wrong: [] });
  const [plusOne, setPlusOne] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(TIME_LIMIT);
  const [finished, setFinished] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [score, setScore] = useState(0);

  const [activePairs, setActivePairs] = useState(() => {
    const shuffled = [...data]
      .map((it, idx) => ({ ...it, pid: `${norm(it.text)}__${idx}` }))
      .sort(() => Math.random() - 0.5);
    const act = [];
    const seen = new Set();
    for (const it of shuffled) {
      const k = norm(it.text);
      if (act.length < 6 && !seen.has(k)) {
        act.push(it);
        seen.add(k);
      }
    }
    return act;
  });
  const [availablePairs, setAvailablePairs] = useState(() => {
    const shuffled = [...data]
      .map((it, idx) => ({ ...it, pid: `${norm(it.text)}__${idx}` }))
      .sort(() => Math.random() - 0.5);
    const act = [];
    const seen = new Set();
    const rest = [];
    for (const it of shuffled) {
      const k = norm(it.text);
      if (act.length < 6 && !seen.has(k)) {
        act.push(it);
        seen.add(k);
      } else {
        rest.push(it);
      }
    }
    return rest;
  });

  const [cards, setCards] = useState(() =>
    activePairs
      .flatMap((item) => [
        { content: item.text, type: "text", pairId: item.pid },
        { content: item.image, type: "image", pairId: item.pid },
      ])
      .sort(() => Math.random() - 0.5)
  );

  const selectUrl = loadSound("select");
  const matchUrl = loadSound("match");
  const errorUrl = loadSound("error");
  const winUrl = loadSound("win");
  const [playSelect] = useSound(selectUrl || undefined, { volume: 0.85 });
  const [playMatch] = useSound(matchUrl || undefined, { volume: 0.7 });
  const [playError] = useSound(errorUrl || undefined, { volume: 0.85 });
  const [playWin] = useSound(winUrl || undefined, { volume: 0.85 });

  const sounds = useMemo(
    () => ({
      select: () => (selectUrl ? playSelect() : null),
      match: () => (matchUrl ? playMatch() : null),
      error: () => (errorUrl ? playError() : null),
      win: () => (winUrl ? playWin() : null),
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

  useEffect(() => {
    if (activePairs.length === 0 && availablePairs.length === 0) {
      setFinished(true);
      sounds.win();
    }
  }, [activePairs, availablePairs, sounds]);

  const handleClick = (card, index) => {
    if (selected.length === 2 || matched.includes(card.content) || timeUp)
      return;
    if (selected.length === 1 && selected[0].index === index) return;
    sounds.select();

    const newSel = [...selected, { ...card, index }];
    setSelected(newSel);
    if (newSel.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = newSel;
    const isMatch = a.pairId === b.pairId && a.type !== b.type;

    if (isMatch) {
      sounds.match();
      setFlash({ correct: [a.index, b.index], wrong: [] });
      setPlusOne(true);
      setScore((s) => s + 1);

      setTimeout(() => {
        setMatched((m) => [...m, a.content, b.content]);
        replaceMatchedPair(a.pairId);
        setSelected([]);
        setFlash({ correct: [], wrong: [] });
        setPlusOne(false);
      }, 400);
    } else {
      sounds.error();
      setFlash({ correct: [], wrong: [a.index, b.index] });
      setTimeout(() => {
        setSelected([]);
        setFlash({ correct: [], wrong: [] });
      }, 800);
    }
  };

  const replaceMatchedPair = (matchedPairId) => {
    // Remove matched pair from active pairs (by unique pid)
    const newActive = activePairs.filter((p) => p.pid !== matchedPairId);

    // Choose next available whose text isn't already on the board
    if (availablePairs.length > 0) {
      const onBoard = new Set(newActive.map((p) => norm(p.text)));
      const idx = availablePairs.findIndex((p) => !onBoard.has(norm(p.text)));
      if (idx !== -1) {
        const next = availablePairs[idx];
        const remaining = [
          ...availablePairs.slice(0, idx),
          ...availablePairs.slice(idx + 1),
        ];
        newActive.push(next);
        setAvailablePairs(remaining);
      }
    }

    setActivePairs(newActive);

    const newCards = newActive
      .flatMap((item) => [
        { content: item.text, type: "text", pairId: item.pid },
        { content: item.image, type: "image", pairId: item.pid },
      ])
      .sort(() => Math.random() - 0.5);

    setCards(newCards);
    setMatched([]);
  };

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const reset = () => {
    const shuffled = [...data]
      .map((it, idx) => ({ ...it, pid: `${norm(it.text)}__${idx}` }))
      .sort(() => Math.random() - 0.5);
    const act = [];
    const seen = new Set();
    const rest = [];
    for (const it of shuffled) {
      const k = norm(it.text);
      if (act.length < 6 && !seen.has(k)) {
        act.push(it);
        seen.add(k);
      } else {
        rest.push(it);
      }
    }

    setActivePairs(act);
    setAvailablePairs(rest);
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setTime(TIME_LIMIT);
    setFinished(false);
    setTimeUp(false);
    setCards(
      act
        .flatMap((i) => [
          { content: i.text, type: "text", pairId: i.pid },
          { content: i.image, type: "image", pairId: i.pid },
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
    score,
    handleClick,
    reset,
    fmt,
  };
}
