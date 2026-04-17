import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api.js';

// ─── Shared constants (exported so TimerWidget can import them) ───────────────

export const MODES = {
  study:     { label: 'Study (25m)',      seconds: 25 * 60 },
  break:     { label: 'Break (5m)',       seconds: 5  * 60 },
  longBreak: { label: 'Long Break (15m)', seconds: 15 * 60 },
  deepWork:  { label: 'Deep Work (50m)',  seconds: 50 * 60 },
  pomodoro:  { label: 'Pomodoro',         seconds: 25 * 60 },
  custom:    { label: 'Custom',           seconds: 0        },
};

export const SUBJECTS = ['Biology', 'Math', 'History', 'Chemistry', 'English', 'Physics'];

export const RING_RADIUS = 160;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const RING_COLOR = {
  study:     '#3B82F6',
  break:     '#22C55E',
  longBreak: '#F59E0B',
  deepWork:  '#8B5CF6',
  pomodoro:  '#3B82F6',
  custom:    '#EC4899',
};

// ─── Audio utilities ──────────────────────────────────────────────────────────

export const playChime = (type) => {
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

// ─── Context ──────────────────────────────────────────────────────────────────

const TimerContext = createContext(null);

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider');
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TimerProvider({ children }) {
  // Core timer
  const [mode, setMode]           = useState('study');
  const [timeLeft, setTimeLeft]   = useState(MODES.study.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject]     = useState('Biology');

  // Custom mode
  const [customMins, setCustomMins] = useState(25);
  const [customSecs, setCustomSecs] = useState(0);

  // Pomodoro
  const [pomodoroPhase, setPomodoroPhase]         = useState('study');
  const [pomodoroCount, setPomodoroCount]         = useState(0);
  const [pomStudyMins,     setPomStudyMins]       = useState(25);
  const [pomBreakMins,     setPomBreakMins]       = useState(5);
  const [pomLongBreakMins, setPomLongBreakMins]   = useState(15);

  // Audio / focus
  const [phaseChangeSound, setPhaseChangeSound] = useState(null);
  const [focusMode,    setFocusMode]    = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioRef = useRef(null);

  // Session stats
  const [sessionsToday, setSessionsToday] = useState(0);
  const [studySeconds,  setStudySeconds]  = useState(0);
  const [breakSeconds,  setBreakSeconds]  = useState(0);
  const [sessionsWeek,  setSessionsWeek]  = useState(0);
  const [weekMinutes,   setWeekMinutes]   = useState(0);
  const [streak,        setStreak]        = useState(0);
  const [bestTime,      setBestTime]      = useState('2–4 PM');
  const [dailyGoal,     setDailyGoal]     = useState(5);

  // API session logging queue
  const [sessionToLog, setSessionToLog] = useState(null);
  const dailyGoalMountRef = useRef(false);

  // ── Ambient audio ────────────────────────────────────────────────────────────

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

  // ── Effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (focusMode && musicEnabled) startAmbient();
    else stopAmbient();
  }, [focusMode, musicEnabled]);

  // Stop audio on unmount
  useEffect(() => () => stopAmbient(), []);

  // Fire chime once then clear
  useEffect(() => {
    if (!phaseChangeSound) return;
    playChime(phaseChangeSound);
    setPhaseChangeSound(null);
  }, [phaseChangeSound]);

  // Load stats + settings from API on mount
  useEffect(() => {
    Promise.all([api.getStudyStats(), api.getStudySettings()])
      .then(([statsRes, settingsRes]) => {
        const { today, week, streak: s, bestTime: bt } = statsRes.data;
        setSessionsToday(today.sessions);
        setStudySeconds(today.studySeconds);
        setBreakSeconds(today.breakSeconds);
        setSessionsWeek(week.sessions);
        setWeekMinutes(week.minutes);
        setStreak(s);
        setBestTime(bt);
        setDailyGoal(settingsRes.data.dailyGoal);
      })
      .catch(() => {});
  }, []);

  // Persist completed session when queued by the interval
  useEffect(() => {
    if (!sessionToLog) return;
    api.logStudySession(
      sessionToLog.subject,
      sessionToLog.durationSeconds,
      sessionToLog.isBreak,
      sessionToLog.mode,
    ).catch(() => {});
    setSessionToLog(null);
  }, [sessionToLog]);

  // Save dailyGoal on change, skipping the first render
  useEffect(() => {
    if (!dailyGoalMountRef.current) {
      dailyGoalMountRef.current = true;
      return;
    }
    api.updateStudySettings(dailyGoal).catch(() => {});
  }, [dailyGoal]);

  // ── Computed values ───────────────────────────────────────────────────────────

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

  const ringOffset = activeDuration > 0
    ? RING_CIRCUMFERENCE * (1 - timeLeft / activeDuration)
    : 0;

  const pomodoroLabel =
    pomodoroPhase === 'study'     ? `Study · Session ${pomodoroCount + 1} of 4` :
    pomodoroPhase === 'break'     ? `Short Break · ${pomodoroCount} of 4 done` :
    `Long Break · Cycle complete!`;

  // ── Countdown interval ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isRunning) return;

    const studySecs     = pomStudyMins     * 60;
    const breakSecs     = pomBreakMins     * 60;
    const longBreakSecs = pomLongBreakMins * 60;
    const snapshotDuration = activeDuration;
    const snapshotIsBreak  = isBreakMode;
    const snapshotSubject  = subject;

    const completedRef = { current: false };

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        if (prev <= 1) {
          if (completedRef.current) return 0;
          completedRef.current = true;
          if (mode === 'pomodoro') {
            if (pomodoroPhase === 'study') {
              const newCount = pomodoroCount + 1;
              setSessionsToday(s => s + 1);
              setStudySeconds(t => t + studySecs);
              setPhaseChangeSound('studyEnd');
              setSessionToLog({ subject: snapshotSubject, durationSeconds: studySecs, isBreak: false, mode: 'pomodoro' });
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
              const breakDuration = pomodoroPhase === 'break' ? breakSecs : longBreakSecs;
              setBreakSeconds(t => t + breakDuration);
              setPhaseChangeSound('breakEnd');
              setSessionToLog({ subject: snapshotSubject, durationSeconds: breakDuration, isBreak: true, mode: 'pomodoro' });
              setPomodoroPhase('study');
              return studySecs;
            }
          } else {
            setIsRunning(false);
            setPhaseChangeSound('studyEnd');
            if (snapshotIsBreak) {
              setBreakSeconds(t => t + snapshotDuration);
              setSessionToLog({ subject: snapshotSubject, durationSeconds: snapshotDuration, isBreak: true, mode });
            } else {
              setSessionsToday(s => s + 1);
              setStudySeconds(t => t + snapshotDuration);
              setSessionToLog({ subject: snapshotSubject, durationSeconds: snapshotDuration, isBreak: false, mode });
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

  // ── Handlers ──────────────────────────────────────────────────────────────────

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

  // ── Formatters ────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <TimerContext.Provider value={{
      mode, setMode,
      timeLeft, setTimeLeft,
      isRunning, setIsRunning,
      subject, setSubject,
      customMins, setCustomMins,
      customSecs, setCustomSecs,
      pomodoroPhase, setPomodoroPhase,
      pomodoroCount, setPomodoroCount,
      pomStudyMins, setPomStudyMins,
      pomBreakMins, setPomBreakMins,
      pomLongBreakMins, setPomLongBreakMins,
      focusMode, setFocusMode,
      musicEnabled, setMusicEnabled,
      sessionsToday, setSessionsToday,
      studySeconds, setStudySeconds,
      breakSeconds, setBreakSeconds,
      sessionsWeek,
      weekMinutes,
      streak,
      bestTime,
      dailyGoal, setDailyGoal,
      activeDuration,
      ringColor,
      isBreakMode,
      ringOffset,
      pomodoroLabel,
      handleModeChange,
      handleCustomChange,
      handlePomDurationChange,
      skipPhase,
      formatTime,
      formatDuration,
    }}>
      {children}
    </TimerContext.Provider>
  );
}
