import { useNavigate } from 'react-router-dom';
import { useTimer, MODES, RING_COLOR } from '../../context/TimerContext';

const W_RADIUS = 30;
const W_CIRC   = 2 * Math.PI * W_RADIUS;
const W_SIZE   = (W_RADIUS + 8) * 2;

export default function TimerWidget() {
  const navigate = useNavigate();

  const {
    mode, timeLeft, isRunning, setIsRunning, setTimeLeft,
    pomodoroPhase,
    activeDuration, ringColor,
    handleModeChange,
    formatTime,
  } = useTimer();

  const ringOffset = activeDuration > 0
    ? W_CIRC * (1 - timeLeft / activeDuration) : 0;

  const dotColor = RING_COLOR[pomodoroPhase] ?? ringColor;

  return (
    <div className="flex flex-col border-2 rounded-xl p-3 border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark">

      {/* Header */}
      <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-brd-primary dark:border-brd-primary-dark">
        <button
          onClick={() => navigate('/timer')}
          className="font-bold hover:opacity-60 transition-opacity cursor-pointer"
        >
          Study Timer
        </button>
        {isRunning && (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        )}
      </div>

      {/* Body: ring + controls side by side */}
      <div className="flex items-center gap-3">

        {/* Ring */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: W_SIZE, height: W_SIZE }}>
          <svg width={W_SIZE} height={W_SIZE} className="absolute">
            <circle
              cx={W_SIZE / 2} cy={W_SIZE / 2} r={W_RADIUS}
              fill="none" stroke="currentColor" strokeWidth="5"
              className="opacity-10"
            />
            <circle
              cx={W_SIZE / 2} cy={W_SIZE / 2} r={W_RADIUS}
              fill="none"
              stroke={dotColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={W_CIRC}
              strokeDashoffset={ringOffset}
              transform={`rotate(-90 ${W_SIZE / 2} ${W_SIZE / 2})`}
              style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
            />
          </svg>
          <span className="relative text-lg font-mono font-bold tabular-nums text-txt-primary dark:text-txt-primary-dark">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <select
            value={mode}
            onChange={e => handleModeChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark text-xs cursor-pointer"
          >
            {Object.entries(MODES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(r => !r)}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium cursor-pointer transition-colors"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => { setTimeLeft(activeDuration); setIsRunning(false); }}
              className="px-3 py-1.5 border border-brd-primary dark:border-brd-primary-dark rounded-md text-xs hover:bg-hover hover:dark:bg-hover-dark cursor-pointer text-txt-primary dark:text-txt-primary-dark transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
