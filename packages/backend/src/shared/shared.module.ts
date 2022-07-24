import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DisabledGuard } from './guards/disabled.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: DisabledGuard,
    },
  ],
})
export class SharedModule {}
