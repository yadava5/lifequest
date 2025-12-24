import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import { ContentModule } from './content/content.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { MeetupsModule } from './meetups/meetups.module.js';
import { QuestsModule } from './quests/quests.module.js';
import { RewardsModule } from './rewards/rewards.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    QuestsModule,
    RewardsModule,
    MeetupsModule,
    ContentModule,
  ],
})
export class AppModule {}
