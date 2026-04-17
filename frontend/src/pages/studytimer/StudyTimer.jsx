import { MdOutlineTimer, MdOutlineFlag, MdOutlineAccessTime, MdOutlineCoffee,
         MdOutlineCalendarToday, MdLocalFireDepartment, MdMenuBook, MdOutlineWatchLater,
         MdFullscreen, MdFullscreenExit, MdMusicNote, MdMusicOff } from 'react-icons/md';
import { useTimer, MODES, SUBJECTS, RING_RADIUS, RING_CIRCUMFERENCE } from '../../context/TimerContext';

const numInputClass =
  'w-14 text-center text-sm font-mono font-bold rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark py-1 outline-none';

export default function StudyTimer() {
  const {
    mode, timeLeft, isRunning, setIsRunning, setTimeLeft,
    subject, setSubject,
    customMins, customSecs,
    pomodoroPhase, pomodoroCount,
    pomStudyMins, pomBreakMins, pomLongBreakMins,
    focusMode, setFocusMode,
    musicEnabled, setMusicEnabled,
    sessionsToday, setSessionsToday, studySeconds, setStudySeconds,
    breakSeconds, setBreakSeconds,
    sessionsWeek, weekMinutes, streak, bestTime,
    dailyGoal, setDailyGoal,
    activeDuration, ringColor, ringOffset, pomodoroLabel,
    handleModeChange, handleCustomChange, handlePomDurationChange, skipPhase,
    formatTime, formatDuration,
  } = useTimer();

  // ─── Center panel (shared between normal and focus layouts) ────────────────

  const centerContent = (
    <>
      {/* Panel header with focus mode toggle */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-brd-primary dark:border-brd-primary-dark w-full">
        <p className="font-bold">Timer</p>
        <button
          onClick={() => setFocusMode(f => !f)}
          title={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
          className="p-1 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer text-txt-primary dark:text-txt-primary-dark opacity-60 hover:opacity-100 transition-opacity"
        >
          {focusMode
            ? <MdFullscreenExit className="w-5 h-5" />
            : <MdFullscreen     className="w-5 h-5" />}
        </button>
      </div>

      {/* Mode selector */}
      <select
        value={mode}
        onChange={e => handleModeChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark text-sm cursor-pointer"
      >
        {Object.entries(MODES).map(([key, val]) => (
          <option key={key} value={key}>{val.label}</option>
        ))}
      </select>

      {/* Custom duration inputs */}
      {mode === 'custom' && (
        <div className="flex items-center gap-3 text-txt-primary dark:text-txt-primary-dark">
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-60 mb-1">min</span>
            <input
              type="number" min="0" max="99"
              value={customMins}
              onChange={e => handleCustomChange(Math.min(99, Math.max(0, Number(e.target.value))), customSecs)}
              className="w-16 text-center text-2xl font-mono font-bold rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark py-1 outline-none text-txt-primary dark:text-txt-primary-dark"
            />
          </div>
          <span className="text-2xl font-bold mt-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-60 mb-1">sec</span>
            <input
              type="number" min="0" max="59"
              value={customSecs}
              onChange={e => handleCustomChange(customMins, Math.min(59, Math.max(0, Number(e.target.value))))}
              className="w-16 text-center text-2xl font-mono font-bold rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark py-1 outline-none text-txt-primary dark:text-txt-primary-dark"
            />
          </div>
        </div>
      )}

      {/* Pomodoro phase duration config */}
      {mode === 'pomodoro' && (
        <div className="w-full grid grid-cols-3 gap-2 text-txt-primary dark:text-txt-primary-dark">
          {[
            { label: 'Study',      phase: 'study',     value: pomStudyMins },
            { label: 'Break',      phase: 'break',     value: pomBreakMins },
            { label: 'Long Break', phase: 'longBreak', value: pomLongBreakMins },
          ].map(({ label, phase, value }) => (
            <div key={phase} className="flex flex-col items-center">
              <span className="text-xs opacity-60 mb-1">{label}</span>
              <div className="flex items-center gap-0.5">
                <input
                  type="number" min="1" max="99"
                  value={value}
                  onChange={e => handlePomDurationChange(phase, e.target.value)}
                  className={numInputClass}
                />
                <span className="text-xs opacity-60">m</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Circular progress ring + countdown clock */}
      <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>
        <svg width="360" height="360" className="absolute">
          <circle
            cx="180" cy="180" r={RING_RADIUS}
            fill="none" stroke="currentColor" strokeWidth="8"
            className="opacity-10"
          />
          <circle
            cx="180" cy="180" r={RING_RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 180 180)"
            style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
          />
        </svg>

        <div className="relative flex flex-col items-center gap-3">
          <span className="text-8xl font-mono font-bold tabular-nums text-txt-primary dark:text-txt-primary-dark">
            {formatTime(timeLeft)}
          </span>
          {mode === 'pomodoro' && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm opacity-60 text-txt-primary dark:text-txt-primary-dark">
                {pomodoroLabel}
              </span>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < pomodoroCount
                        ? 'bg-blue-500'
                        : i === pomodoroCount && pomodoroPhase === 'study'
                        ? 'bg-blue-400 animate-pulse'
                        : 'bg-brd-primary dark:bg-brd-primary-dark'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timer controls */}
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setIsRunning(r => !r)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium cursor-pointer"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => { setTimeLeft(activeDuration); setIsRunning(false); }}
          className="px-6 py-2 border border-brd-primary dark:border-brd-primary-dark rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer text-txt-primary dark:text-txt-primary-dark"
        >
          Reset
        </button>
        {mode === 'pomodoro' && (
          <button
            onClick={skipPhase}
            className="px-6 py-2 border border-brd-primary dark:border-brd-primary-dark rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer text-txt-primary dark:text-txt-primary-dark"
          >
            Skip
          </button>
        )}
        {focusMode && (
          <button
            onClick={() => setMusicEnabled(m => !m)}
            title={musicEnabled ? 'Turn off ambient sound' : 'Turn on ambient sound'}
            className={`p-2 rounded-md border cursor-pointer transition-colors ${
              musicEnabled
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-brd-primary dark:border-brd-primary-dark hover:bg-hover hover:dark:bg-hover-dark text-txt-primary dark:text-txt-primary-dark'
            }`}
          >
            {musicEnabled
              ? <MdMusicNote className="w-5 h-5" />
              : <MdMusicOff  className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Subject selector */}
      <div className="w-full">
        <p className="text-xs opacity-60 mb-1 text-txt-primary dark:text-txt-primary-dark">Subject</p>
        <select
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full px-2 py-1.5 rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark text-sm cursor-pointer"
        >
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
    </>
  );

  // ─── Page layout ────────────────────────────────────────────────────────────

  return (
    <div className="h-full p-4 flex flex-col overflow-hidden">

      {!focusMode && (
        <h1 className="text-xl font-semibold mb-4 flex items-center gap-2 text-txt-primary dark:text-txt-primary-dark">
          <MdOutlineTimer className="w-6 h-6" />
          Study Timer
        </h1>
      )}

      {focusMode ? (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="bg-primary dark:bg-primary-dark rounded-xl p-4 border-2 border-brd-primary dark:border-brd-primary-dark flex flex-col items-center gap-4 overflow-auto w-full max-w-lg">
            {centerContent}
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">

          {/* Left column: Today's Progress */}
          <div className="bg-primary dark:bg-primary-dark rounded-xl p-4 border-2 border-brd-primary dark:border-brd-primary-dark flex flex-col gap-4 overflow-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-brd-primary dark:border-brd-primary-dark">
              <p className="font-bold">Today's Progress</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSessionsToday(0); setStudySeconds(0); setBreakSeconds(0); }}
                  className="text-xs px-2 py-0.5 rounded-full border border-brd-primary dark:border-brd-primary-dark hover:bg-hover hover:dark:bg-hover-dark cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                  title="Reset today's progress"
                >
                  Reset
                </button>
                {isRunning ? (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Studying
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-brd-primary dark:bg-brd-primary-dark opacity-50">
                    Paused
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 py-2">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-txt-primary dark:text-txt-primary-dark leading-none">
                  {sessionsToday}
                </span>
                <span className="text-xl opacity-40 text-txt-primary dark:text-txt-primary-dark mb-1">
                  / {dailyGoal}
                </span>
              </div>
              <p className="text-xs uppercase tracking-wide opacity-40 text-txt-primary dark:text-txt-primary-dark">
                {sessionsToday === 0            ? "Let's get started" :
                 sessionsToday >= dailyGoal     ? 'Goal reached!'     :
                 sessionsToday >= dailyGoal - 1 ? 'Almost there'      :
                 'Keep going'}
              </p>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: dailyGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-md transition-colors duration-500 ${
                    i < sessionsToday ? 'bg-blue-500' : 'bg-brd-primary dark:bg-brd-primary-dark'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-txt-primary dark:text-txt-primary-dark">
              <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1">
                <MdOutlineFlag className="w-4 h-4 text-blue-500" />
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number" min="1" max="20"
                    value={dailyGoal}
                    onChange={e => setDailyGoal(Math.min(20, Math.max(1, Number(e.target.value))))}
                    className={numInputClass}
                  />
                </div>
                <span className="text-xs opacity-50 uppercase tracking-wide">Daily Goal</span>
              </div>

              <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1">
                <MdOutlineAccessTime className="w-4 h-4 text-blue-500" />
                <p className="text-base font-semibold mt-1">
                  {studySeconds > 0 ? formatDuration(studySeconds) : '0m'}
                </p>
                <span className="text-xs opacity-50 uppercase tracking-wide">Study Time</span>
              </div>

              <div className="col-span-2 flex justify-center">
                <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1 w-1/2">
                  <MdOutlineCoffee className="w-4 h-4 text-blue-500" />
                  <p className="text-base font-semibold mt-1">
                    {breakSeconds > 0 ? formatDuration(breakSeconds) : '0m'}
                  </p>
                  <span className="text-xs opacity-50 uppercase tracking-wide">Break Time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center column: Timer controls */}
          <div className="bg-primary dark:bg-primary-dark rounded-xl p-4 border-2 border-brd-primary dark:border-brd-primary-dark flex flex-col items-center gap-4 overflow-auto">
            {centerContent}
          </div>

          {/* Right column: Quick Stats */}
          <div className="bg-primary dark:bg-primary-dark rounded-xl p-4 border-2 border-brd-primary dark:border-brd-primary-dark flex flex-col gap-4 overflow-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-brd-primary dark:border-brd-primary-dark">
              <p className="font-bold">Quick Stats</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-txt-primary dark:text-txt-primary-dark">
              <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1">
                <MdOutlineCalendarToday className="w-4 h-4 text-blue-500" />
                <p className="text-base font-semibold mt-1">{sessionsWeek}</p>
                <p className="text-xs opacity-50 uppercase tracking-wide">This Week</p>
                <p className="text-xs opacity-60">{Math.floor(weekMinutes / 60)}h {weekMinutes % 60}min</p>
              </div>

              <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1">
                <MdLocalFireDepartment className={`w-4 h-4 ${
                  streak >= 7 ? 'text-orange-400' :
                  streak >= 3 ? 'text-yellow-400' :
                  'text-blue-500'
                }`} />
                <p className={`text-base font-semibold mt-1 ${
                  streak >= 7 ? 'text-orange-400' :
                  streak >= 3 ? 'text-yellow-400' : ''
                }`}>
                  {streak} days
                </p>
                <p className="text-xs opacity-50 uppercase tracking-wide">Streak</p>
              </div>

              <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <MdMenuBook className="w-4 h-4 text-blue-500" />
                  {isRunning && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  )}
                </div>
                <p className="text-base font-semibold mt-1 truncate">{subject}</p>
                <p className="text-xs opacity-50 uppercase tracking-wide">Top Subject</p>
              </div>

              <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1">
                <MdOutlineWatchLater className="w-4 h-4 text-blue-500" />
                <p className="text-base font-semibold mt-1">{bestTime}</p>
                <p className="text-xs opacity-50 uppercase tracking-wide">Best Time</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
