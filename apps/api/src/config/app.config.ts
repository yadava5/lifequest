import { registerAs } from '@nestjs/config';

type AppConfig = {
  port: number;
  corsOrigin: string;
};

export default registerAs<AppConfig>('app', () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
}));
