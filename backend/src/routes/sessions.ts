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

export default router;
