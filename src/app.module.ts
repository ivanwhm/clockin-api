import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { DatabaseModule } from './core';
import { AccountModule } from './features';
import { SharedModule } from './shared';
import { HttpErrorFilter } from './shared/filters';

@Module({
  imports: [DatabaseModule, AccountModule, SharedModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
