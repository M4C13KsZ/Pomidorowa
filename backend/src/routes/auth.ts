import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

function isValidEmail(email: string): boolean {
  return email.includes('@');
}

router.post('/register', async (req: Request, res: Response): Promise<void> => {});

router.post('/login', async (req: Request, res: Response): Promise<void> => {});

export default router;
