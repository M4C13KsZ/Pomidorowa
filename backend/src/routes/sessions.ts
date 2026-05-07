import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// Save a completed session — only accepts full 25-minute sessions (1500s)
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, taskName, durationSeconds } = req.body as {
      taskId?: number;
      taskName?: string;
      durationSeconds?: number;
    };

    if (!taskName?.trim()) {
      res.status(400).json({ error: 'Task name is required' });
      return;
    }
    if (durationSeconds !== 1500) {
      res.status(400).json({ error: 'Only full 25-minute sessions (1500s) can be saved' });
      return;
    }

    const session = await prisma.session.create({
      data: {
        userId: req.userId!,
        taskId: taskId ?? null,
        taskName: taskName.trim(),
        durationSeconds,
      },
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get today's sessions with aggregated stats
router.get('/today', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const sessions = await prisma.session.findMany({
      where: {
        userId: req.userId!,
        completedAt: { gte: startOfDay },
      },
      orderBy: { completedAt: 'desc' },
    });

    const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);

    const taskMap = new Map<string, number>();
    for (const s of sessions) {
      taskMap.set(s.taskName, (taskMap.get(s.taskName) ?? 0) + 1);
    }
    const taskSummary = Array.from(taskMap.entries()).map(([taskName, pomodoros]) => ({
      taskName,
      pomodoros,
    }));

    res.json({
      totalSeconds,
      totalPomodoros: sessions.length,
      sessions,
      taskSummary,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
