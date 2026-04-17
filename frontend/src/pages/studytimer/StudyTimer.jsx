import { useState, useEffect, useRef } from 'react';
import { MdOutlineTimer, MdOutlineFlag, MdOutlineAccessTime, MdOutlineCoffee,
         MdOutlineCalendarToday, MdLocalFireDepartment, MdMenuBook, MdOutlineWatchLater,
         MdFullscreen, MdFullscreenExit, MdMusicNote, MdMusicOff } from 'react-icons/md';

// timer modes 
const MODES = {
  study:     { label: 'Study (25m)',      seconds: 25 * 60 },
  break:     { label: 'Break (5m)',       seconds: 5  * 60 },
  longBreak: { label: 'Long Break (15m)', seconds: 15 * 60 },
  deepWork:  { label: 'Deep Work (50m)',  seconds: 50 * 60 },
  pomodoro:  { label: 'Pomodoro',         seconds: 25 * 60 },
  custom:    { label: 'Custom',           seconds: 0        },
};

// default subjects selection
const SUBJECTS = ['Biology', 'Math', 'History', 'Chemistry', 'English', 'Physics'];

// Ring around timer
const RING_RADIUS = 160;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// different color modes for pomodoro phases
const RING_COLOR = {
  study:     '#3B82F6',
  break:     '#22C55E',
  longBreak: '#F59E0B',
  deepWork:  '#8B5CF6',
  pomodoro:  '#3B82F6',
  custom:    '#EC4899',
};

const playChime = (type) => {
  try {
    const ctx = new (window.AudioContext || window['webkitAudioContext'])();
    const createTone = (freq, startTime, duration) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    if (type === 'studyEnd') {
      createTone(880, ctx.currentTime,        0.6);
      createTone(660, ctx.currentTime + 0.35, 0.9);
    } else {
      createTone(660, ctx.currentTime,        0.6);
      createTone(880, ctx.currentTime + 0.35, 0.9);
    }
  } catch (_) {}
};

// Looping brown ambient noise in focus mode
const createBrownNoiseBuffer = (ctx) => {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  return buffer;
};

const numInputClass =
  'w-14 text-center text-sm font-mono font-bold rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark py-1 outline-none';

export default function StudyTimer() {
  const [mode, setMode]           = useState('study');
  const [timeLeft, setTimeLeft]   = useState(MODES.study.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject]     = useState('Biology');

  const [customMins, setCustomMins] = useState(25);
  const [customSecs, setCustomSecs] = useState(0);


  const [pomodoroPhase, setPomodoroPhase] = useState('study');
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const [pomStudyMins,     setPomStudyMins]     = useState(25);
  const [pomBreakMins,     setPomBreakMins]     = useState(5);
  const [pomLongBreakMins, setPomLongBreakMins] = useState(15);
  
  const [phaseChangeSound, setPhaseChangeSound] = useState(null);

  const [focusMode,    setFocusMode]    = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioRef = useRef(null); 

  const [sessionsToday, setSessionsToday] = useState(0);
  const [studySeconds, setStudySeconds]   = useState(0);
  const [breakSeconds, setBreakSeconds]   = useState(0);

  const sessionsWeek = 24;
  const weekMinutes  = 390;
  const streak       = 7;
  const [dailyGoal, setDailyGoal] = useState(5);

  const startAmbient = () => {
    if (audioRef.current) return;
    try {
      const ctx = new (window.AudioContext || window['webkitAudioContext'])();
      const buffer = createBrownNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();

      audioRef.current = { ctx, source, gainNode };
    } catch (_) {}
  };

  // Fades out ambient audio 
  const stopAmbient = () => {
    if (!audioRef.current) return;
    const { gainNode, source, ctx } = audioRef.current;
    audioRef.current = null;
    try {
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
      setTimeout(() => {
        try { source.stop(); ctx.close(); } catch (_) {}
      }, 1600);
    } catch (_) {}
  };

  // Start or stop ambient audio 
  useEffect(() => {
    if (focusMode && musicEnabled) {
      startAmbient();
    } else {
      stopAmbient();
    }
  }, [focusMode, musicEnabled]);

  useEffect(() => () => stopAmbient(), []);

  // audio queue when finishing pomodoro phase
  useEffect(() => {
    if (!phaseChangeSound) return;
    playChime(phaseChangeSound);
    setPhaseChangeSound(null);
  }, [phaseChangeSound]);

  const activeDuration =
    mode === 'custom'   ? customMins * 60 + customSecs :
    mode === 'pomodoro' ? (
      pomodoroPhase === 'study'     ? pomStudyMins     * 60 :
      pomodoroPhase === 'break'     ? pomBreakMins     * 60 :
                                      pomLongBreakMins * 60
    ) :
    MODES[mode].seconds;

  const ringColor = mode === 'pomodoro' ? RING_COLOR[pomodoroPhase] : RING_COLOR[mode];

  const isBreakMode = mode === 'break' || mode === 'longBreak'
    || (mode === 'pomodoro' && pomodoroPhase !== 'study');


  useEffect(() => {
    if (!isRunning) return;

    const studySecs     = pomStudyMins     * 60;
    const breakSecs     = pomBreakMins     * 60;
    const longBreakSecs = pomLongBreakMins * 60;
    const snapshotDuration = activeDuration;
    const snapshotIsBreak  = isBreakMode;

    const completedRef = { current: false };

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        if (prev <= 1) {
          if (completedRef.current) return 0;
          completedRef.current = true;
          if (mode === 'pomodoro') {
            // advance to the next phase automatically
            if (pomodoroPhase === 'study') {
              const newCount = pomodoroCount + 1;
              setSessionsToday(s => s + 1);
              setStudySeconds(t => t + studySecs);
              setPhaseChangeSound('studyEnd');
              if (newCount % 4 === 0) {
                setPomodoroCount(0);
                setPomodoroPhase('longBreak');
                return longBreakSecs;
              } else {
                setPomodoroCount(newCount);
                setPomodoroPhase('break');
                return breakSecs;
              }
            } else {
              setBreakSeconds(t => t + (pomodoroPhase === 'break' ? breakSecs : longBreakSecs));
              setPhaseChangeSound('breakEnd');
              setPomodoroPhase('study');
              return studySecs;
            }
          } else {
            setIsRunning(false);
            setPhaseChangeSound('studyEnd');
            if (snapshotIsBreak) {
              setBreakSeconds(t => t + snapshotDuration);
            } else {
              setSessionsToday(s => s + 1);
              setStudySeconds(t => t + snapshotDuration);
            }
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, pomodoroPhase, pomodoroCount,
      pomStudyMins, pomBreakMins, pomLongBreakMins,
      activeDuration, isBreakMode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setPomodoroPhase('study');
    setPomodoroCount(0);
    const duration =
      newMode === 'custom'   ? customMins * 60 + customSecs :
      newMode === 'pomodoro' ? pomStudyMins * 60 :
      MODES[newMode].seconds;
    setTimeLeft(duration);
  };

  const handleCustomChange = (mins, secs) => {
    setCustomMins(mins);
    setCustomSecs(secs);
    if (!isRunning) setTimeLeft(mins * 60 + secs);
  };

  // Update a pomodoro phase 
  const handlePomDurationChange = (phase, mins) => {
    const clamped = Math.min(99, Math.max(1, Number(mins)));
    if (phase === 'study') {
      setPomStudyMins(clamped);
      if (pomodoroPhase === 'study' && !isRunning) setTimeLeft(clamped * 60);
    } else if (phase === 'break') {
      setPomBreakMins(clamped);
      if (pomodoroPhase === 'break' && !isRunning) setTimeLeft(clamped * 60);
    } else {
      setPomLongBreakMins(clamped);
      if (pomodoroPhase === 'longBreak' && !isRunning) setTimeLeft(clamped * 60);
    }
  };

  // Manually skip the current pomodoro phase
  const skipPhase = () => {
    setIsRunning(false);
    if (pomodoroPhase === 'study') {
      playChime('studyEnd');
      const newCount = pomodoroCount + 1;
      if (newCount % 4 === 0) {
        setPomodoroCount(0);
        setPomodoroPhase('longBreak');
        setTimeLeft(pomLongBreakMins * 60);
      } else {
        setPomodoroCount(newCount);
        setPomodoroPhase('break');
        setTimeLeft(pomBreakMins * 60);
      }
    } else {
      playChime('breakEnd');
      setPomodoroPhase('study');
      setTimeLeft(pomStudyMins * 60);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDuration = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const ringOffset = activeDuration > 0
    ? RING_CIRCUMFERENCE * (1 - timeLeft / activeDuration)
    : 0;

  const pomodoroLabel =
    pomodoroPhase === 'study'     ? `Study · Session ${pomodoroCount + 1} of 4` :
    pomodoroPhase === 'break'     ? `Short Break · ${pomodoroCount} of 4 done` :
    `Long Break · Cycle complete!`;

  const centerContent = (
    <>
      {/* header with focus mode  */}
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

      {/* Mode selector dropdown */}
      <select
        value={mode}
        onChange={e => handleModeChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-brd-primary dark:border-brd-primary-dark bg-primary dark:bg-primary-dark text-txt-primary dark:text-txt-primary-dark text-sm cursor-pointer"
      >
        {Object.entries(MODES).map(([key, val]) => (
          <option key={key} value={key}>{val.label}</option>
        ))}
      </select>

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

      {/* Pomodoro phase duration config, only visible in pomodoro mode */}
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

      {/* Circular progress ring and countdown clock */}
      <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>
        <svg width="360" height="360" className="absolute">
          {/* Background ring */}
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

        {/* Clock display and pomodoro session indicators */}
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

  return (
    <div className="h-full p-4 flex flex-col overflow-hidden">

      {/* Page header hidden in focus mode*/}
      {!focusMode && (
        <h1 className="text-xl font-semibold mb-4 flex items-center gap-2 text-txt-primary dark:text-txt-primary-dark">
          <MdOutlineTimer className="w-6 h-6" />
          Study Timer
        </h1>
      )}

      {/* Focus mode: centered single-column layout */}
      {focusMode ? (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="bg-primary dark:bg-primary-dark rounded-xl p-4 border-2 border-brd-primary dark:border-brd-primary-dark flex flex-col items-center gap-4 overflow-auto w-full max-w-lg">
            {centerContent}
          </div>
        </div>
      ) : (
        // Normal mode: three-column grid — Progress | Timer | Stats
        <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">

          {/* Left column: Today's Progress */}
          <div className="bg-primary dark:bg-primary-dark rounded-xl p-4 border-2 border-brd-primary dark:border-brd-primary-dark flex flex-col gap-4 overflow-auto">

            {/* Progress panel header with reset button and running status badge */}
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

            {/* Visual progress bar  */}
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

            {/* Stat cards */}
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

            {/* Stat cards: weekly sessions, streak, active subject, and best study time */}
            <div className="grid grid-cols-2 gap-2 text-txt-primary dark:text-txt-primary-dark">

              <div className="rounded-xl bg-secondary dark:bg-secondary-dark p-3 flex flex-col gap-1">
                <MdOutlineCalendarToday className="w-4 h-4 text-blue-500" />
                <p className="text-base font-semibold mt-1">{sessionsWeek}</p>
                <p className="text-xs opacity-50 uppercase tracking-wide">This Week</p>
                <p className="text-xs opacity-60">{Math.floor(weekMinutes / 60)}h {weekMinutes % 60}min</p>
              </div>

              {/* Streak card — color shifts from blue → yellow → orange as streak grows */}
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
                <p className="text-base font-semibold mt-1">2–4 PM</p>
                <p className="text-xs opacity-50 uppercase tracking-wide">Best Time</p>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
