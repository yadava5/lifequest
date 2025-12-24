import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import usersRouter from './routes/users.js';
import questsRouter from './routes/quests.js';
import rewardsRouter from './routes/rewards.js';
import meetupsRouter from './routes/meetups.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/quests', questsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/meetups', meetupsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

export default app;
