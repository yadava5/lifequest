import { registerAs } from '@nestjs/config';

type DatabaseConfig = {
  url: string;
};

export default registerAs<DatabaseConfig>('database', () => ({
  url: process.env.DATABASE_URL ?? 'postgresql://lifequest:lifequest@localhost:5432/lifequest',
}));
