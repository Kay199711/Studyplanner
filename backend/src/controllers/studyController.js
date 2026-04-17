import prisma from '../config/database.js';

// POST /api/study/sessions — record a completed timer session
export const logSession = async (req, res, next) => {
  try {
    const { subject, durationSeconds, isBreak, mode } = req.body;

    if (!subject || durationSeconds == null || !mode) {
      return res.status(400).json({
        success: false,
        message: 'subject, durationSeconds, and mode are required',
      });
    }

    const session = await prisma.studySession.create({
      data: {
        subject,
        durationSeconds: parseInt(durationSeconds),
        isBreak: isBreak ?? false,
        mode,
      },
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// GET /api/study/stats — return today's stats, weekly totals, streak, and best study time
export const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd   = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const weekStart  = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

    // Today's sessions
    const todaySessions = await prisma.studySession.findMany({
      where: { completedAt: { gte: todayStart, lt: todayEnd } },
    });
    const todayStudy = todaySessions.filter(s => !s.isBreak);
    const todayBreak = todaySessions.filter(s => s.isBreak);

    // This week's study sessions (last 7 days)
    const weekSessions = await prisma.studySession.findMany({
      where: { isBreak: false, completedAt: { gte: weekStart, lt: todayEnd } },
    });
    const weekStudySeconds = weekSessions.reduce((sum, s) => sum + s.durationSeconds, 0);

    // Streak — consecutive days (going back from today) with at least 1 study session
    const allStudy = await prisma.studySession.findMany({
      where: { isBreak: false },
      orderBy: { completedAt: 'desc' },
    });

    const daysWithSessions = new Set(
      allStudy.map(s => {
        const d = new Date(s.completedAt);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );

    let streak = 0;
    let checkDate = new Date(todayStart);
    const todayKey = `${todayStart.getFullYear()}-${todayStart.getMonth()}-${todayStart.getDate()}`;
    // If nothing today yet, start streak check from yesterday
    if (!daysWithSessions.has(todayKey)) {
      checkDate = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    }
    while (true) {
      const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (!daysWithSessions.has(key)) break;
      streak++;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    }

    // Best time — find the 2-hour window with the most completed sessions
    const hourCounts = new Array(24).fill(0);
    for (const s of allStudy) {
      hourCounts[new Date(s.completedAt).getHours()]++;
    }
    let bestHour = -1;
    let bestCount = 0;
    for (let h = 0; h < 23; h++) {
      const windowCount = hourCounts[h] + hourCounts[h + 1];
      if (windowCount > bestCount) {
        bestCount = windowCount;
        bestHour = h;
      }
    }
    let bestTime = '2–4 PM';
    if (bestHour >= 0 && bestCount > 0) {
      const fmt = h => {
        const period  = h < 12 ? 'AM' : 'PM';
        const display = h % 12 === 0 ? 12 : h % 12;
        return `${display} ${period}`;
      };
      bestTime = `${fmt(bestHour)}–${fmt(bestHour + 2)}`;
    }

    res.json({
      success: true,
      data: {
        today: {
          sessions:     todayStudy.length,
          studySeconds: todayStudy.reduce((sum, s) => sum + s.durationSeconds, 0),
          breakSeconds: todayBreak.reduce((sum, s) => sum + s.durationSeconds, 0),
        },
        week: {
          sessions: weekSessions.length,
          minutes:  Math.floor(weekStudySeconds / 60),
        },
        streak,
        bestTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/study/settings — fetch persisted user preferences
export const getStudySettings = async (req, res, next) => {
  try {
    let settings = await prisma.studySettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.studySettings.create({ data: { id: 1, dailyGoal: 5 } });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/study/settings — update persisted user preferences
export const updateStudySettings = async (req, res, next) => {
  try {
    const { dailyGoal } = req.body;
    if (dailyGoal == null) {
      return res.status(400).json({ success: false, message: 'dailyGoal is required' });
    }
    const clamped = Math.min(20, Math.max(1, parseInt(dailyGoal)));
    const settings = await prisma.studySettings.upsert({
      where:  { id: 1 },
      update: { dailyGoal: clamped },
      create: { id: 1, dailyGoal: clamped },
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
