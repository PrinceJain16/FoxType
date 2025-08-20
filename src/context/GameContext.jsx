import React, { createContext, useState, useContext, useEffect, useRef } from "react";
const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const didMount = useRef(false);
  const [timer, setTimer] = useState(60);
  const [timeLeft, setTimeLeft] = useState(timer);

  const [includeCaps, setIncludeCaps] = useState(false);
  const [includeNums, setIncludeNums] = useState(false);
  const [includePunct, setIncludePunct] = useState(false);

  const [wordList, setWordList] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [prevCorrectChars, setPrevCorrectChars] = useState(0);
  const [prevTotalTyped, setPrevTotalTyped] = useState(0);

  const [stats, setStats] = useState({
    correctChars: 0,
    totalTyped: 0,
    wpm: 0,
    accuracy: 0,
  });

  const [showStats, setShowStats] = useState(false);

  const fetchWords = async (count = 100) => {
    const res = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}`);
    const data = await res.json();
    return data;
  };

  const generateNewWords = async () => {
  const baseWords = await fetchWords(300);
  const numbers = "0123456789".repeat(6).split("");
  const punctuation = [".", ",", "!", "?", ";", ":"].flatMap(p => [p, p, p]);

  let wordPool = [...baseWords];

  if (includeNums) wordPool = [...wordPool, ...numbers];
  if (includePunct) wordPool = [...wordPool, ...punctuation];
  if (includeCaps) {
    const capitalized = baseWords.map(word => word[0].toUpperCase() + word.slice(1));
    wordPool = [...wordPool, ...capitalized];
  }

  const randomWords = Array.from({ length: 25 }, () => {
    const rand = wordPool[Math.floor(Math.random() * wordPool.length)];
    return rand;
  });

  // setWordList(prev => append ? [...prev, ...randomWords] : randomWords);

  setWordList(randomWords);
};


  const handleRefresh = () => {
    setGameStarted(false);
    setInputValue("");
    setTimeLeft(timer);
    setStats({ correctChars: 0, totalTyped: 0, wpm: 0, accuracy: 0 });
    setPrevCorrectChars(0);
    setPrevTotalTyped(0);
    generateNewWords(false);
    setShowStats(false);
  };

  const calculateBatchStats = () => {
    const fullText = wordList.join(" ");
    const totalTyped = inputValue.length;
    const correctChars = [...inputValue].reduce((acc, char, i) => {
      return char === fullText[i] ? acc + 1 : acc;
    }, 0);

    return { correctChars, totalTyped };
  };

  useEffect(() => {
    if (!didMount.current) {
      handleRefresh();
      didMount.current = true;
    } else {
      handleRefresh();
    }
  }, [timer, includeCaps, includeNums, includePunct]);

  useEffect(() => {
    if (!gameStarted || wordList.length === 0) return;

    const fullText = wordList.join(" ");
    if (inputValue.length >= fullText.length - 1) {
      const { correctChars, totalTyped } = calculateBatchStats();

      setPrevCorrectChars(prev => prev + correctChars);
      setPrevTotalTyped(prev => prev + totalTyped);

      setInputValue("");
      generateNewWords(true);
    }
  }, [inputValue]);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);

          const { correctChars, totalTyped } = calculateBatchStats();
          const totalCorrect = prevCorrectChars + correctChars;
          const totalTypedFinal = prevTotalTyped + totalTyped;

          const wpm = Math.floor((totalCorrect / 5) / (timer / 60));
          const accuracy = totalTypedFinal === 0 ? 0 : Math.round((totalCorrect / totalTypedFinal) * 100);

          setStats({
            correctChars: totalCorrect,
            totalTyped: totalTypedFinal,
            wpm,
            accuracy,
          });

          setGameStarted(false);
          setShowStats(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, timeLeft]);

  return (
    <GameContext.Provider
      value={{
        timer, setTimer,
        timeLeft, setTimeLeft,
        includeCaps, setIncludeCaps,
        includeNums, setIncludeNums,
        includePunct, setIncludePunct,
        wordList, setWordList,
        gameStarted, setGameStarted,
        inputValue, setInputValue,
        generateNewWords,
        fetchWords,
        handleRefresh,
        stats, setStats,
        showStats, setShowStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
