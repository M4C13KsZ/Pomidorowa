import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import sessionsRoutes from './routes/sessions';
//import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? '3000', 10);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/sessions', sessionsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

//app.use(errorHandler);

app.listen(port, () => {
  console.log(`FocusTrack API listening on port ${port}`);
});
