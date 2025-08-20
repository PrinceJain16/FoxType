import { useGame } from "../context/GameContext";
import "./Toolbar.css";

function Toolbar() {
  const {
    timer, setTimer,
    includeCaps, setIncludeCaps,
    includeNums, setIncludeNums,
    includePunct, setIncludePunct,
    handleRefresh,
  } = useGame();

  const handleTimerChange = (e) => {
    setTimer(Number(e.target.value));
  };

  return (
    <div className="tool-bar">
      <div className="tool-item">
        <select value={timer} onChange={handleTimerChange} className="timer-select">
          <option value={15}>⏳15s</option>
          <option value={30}>⏳30s</option>
          <option value={60}>⏳60s</option>
        </select>
      </div>

      <div className="tool-item">
        <button
          className={`toggle-btn ${includeCaps ? "active" : ""}`}
          onClick={() => setIncludeCaps(!includeCaps)}
        >
          🅰️ Uppercase
        </button>
      </div>

      <div className="tool-item">
        <button
          className={`toggle-btn ${includeNums ? "active" : ""}`}
          onClick={() => setIncludeNums(!includeNums)}
        >
          1️⃣ Numbers
        </button>
      </div>

      <div className="tool-item">
        <button
          className={`toggle-btn ${includePunct ? "active" : ""}`}
          onClick={() => setIncludePunct(!includePunct)}
        >
          ‼️ Punctuation
        </button>
      </div>

      <div className="tool-item">
        <button className="refresh-btn" onClick={handleRefresh}>🗘</button>
      </div>
    </div>
  );
}

export default Toolbar;
