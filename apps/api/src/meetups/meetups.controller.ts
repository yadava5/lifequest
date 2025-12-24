import { Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { MeetupsService } from './meetups.service.js';

const querySchema = z.object({
  audience: z.enum(['LAID_OFF', 'RETIRED', 'SHARED']).optional(),
});

@Controller('meetups')
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {}

  @Get()
  async list(@Query() query: unknown) {
    const { audience } = querySchema.parse(query ?? {});
    return this.meetupsService.list(audience);
  }
}
