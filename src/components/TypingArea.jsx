import { useState, useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";

export function TypingArea() {
  const {
    inputValue,
    setInputValue,
    gameStarted,
    setGameStarted,
    wordList,
    generateNewWords,
    timeLeft,
    setStats,
    timer,
    showStats,
    setShowStats,
  } = useGame();

  const inputRef = useRef(null);
  const fullText = wordList.join(" ");


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!gameStarted) {
      inputRef.current?.focus();
    }
  }, [gameStarted]);


  useEffect(() => {
    if (!gameStarted || wordList.length === 0) return;
    if (inputValue.length >= fullText.length - 1) {
  const fullText = wordList.join(" ");
  const correctChars = [...inputValue].filter((char, i) => char === fullText[i]).length;
  const totalTyped = inputValue.length;

  setStats(prev => {
    const newCorrect = prev.correctChars + correctChars;
    const newTyped = prev.totalTyped + totalTyped;
    const newWPM = Math.floor((newCorrect / 5) / (timer / 60));
    const newAccuracy = newTyped === 0 ? 0 : Math.round((newCorrect / newTyped) * 100);

    return {
      correctChars: newCorrect,
      totalTyped: newTyped,
      wpm: newWPM,
      accuracy: newAccuracy,
    };
  });

  generateNewWords(false);
  setInputValue("");
}

  }, [inputValue, fullText, gameStarted, wordList]);


  useEffect(() => {
    if (gameStarted && timeLeft === 0) {

      setTimeout(() => {
        const finalInput = inputRef.current?.value || "";
        const fullText = wordList.join(" ");
        const correctChars = [...finalInput].filter((char, i) => char === fullText[i]).length;
        const totalTyped = finalInput.length;
        const wpm = Math.floor((correctChars / 5) / (timer / 60));
        const accuracy = totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);

        setStats({ correctChars, totalTyped, wpm, accuracy });
        setGameStarted(false);
        setShowStats(true);
      }, 100);
    }
  }, [timeLeft]);

  const handleChange = (e) => {
    const value = e.target.value;

    if (timeLeft <= 1) return;

    if (!gameStarted && value.length > 0) {
      setGameStarted(true);
    }

    setInputValue(value);
  };

  return (
    <div className="typing-area-container" onClick={() => inputRef.current?.focus()}>
      <div className="text-display">
        {fullText.split("").map((char, index) => {
          const typedChar = inputValue[index];
          let className = "";

          if (typedChar != null) {
            className = typedChar === char ? "correct" : "incorrect";
          }else if (index === inputValue.length) {
            className = "current-letter";
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="hidden-input"
        autoFocus
        spellCheck={false}
      />
    </div>
  );
}

export default TypingArea;
