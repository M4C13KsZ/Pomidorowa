import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId!, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body as { name?: string };
    if (!name?.trim()) {
      res.status(400).json({ error: 'Task name is required' });
      return;
    }

    const task = await prisma.task.create({
      data: { userId: req.userId!, name: name.trim() },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { name } = req.body as { name?: string };

    if (!name?.trim()) {
      res.status(400).json({ error: 'Task name is required' });
      return;
    }

    const task = await prisma.task.findFirst({ where: { id, userId: req.userId! } });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);

    const task = await prisma.task.findFirst({ where: { id, userId: req.userId! } });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.update({ where: { id }, data: { isActive: false } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
