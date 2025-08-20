import { useGame } from "../context/GameContext";
import "./liveStats.css";
function LiveStats() {
  const { gameStarted, timeLeft, stats, showStats } = useGame();

  return (
     <div className="mt-6 text-sm text-gray-700">
      
      {gameStarted && (
        <div className="live-stats">
          <div className="stat">
            ⏱️ <strong>Time Left:</strong>
            <span className={timeLeft <= 10 ? "text-red-500" : ""}>{timeLeft}s</span>
          </div>
        </div>
      )}

      {showStats && stats.totalTyped > 0 && (
        <div className="live-stats">
          <div className="stat">🚀 <strong>WPM:</strong> {stats.wpm}</div>
          <div className="stat">🎯 <strong>Accuracy:</strong> {stats.accuracy}%</div>
          <div className="stat">⌨️ <strong>Typed:</strong> {stats.totalTyped}</div>
          <div className="stat">✔️ <strong>Correct:</strong> {stats.correctChars}</div>
          {stats.incorrectChars != null && (
            <div className="stat">❌ <strong>Incorrect:</strong> {stats.incorrectChars}</div>
          )}
        </div>
      )}
    </div>

  );
}

export default LiveStats;
