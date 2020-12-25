import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { providers } from './account.providers';
import { AccountRepository } from './repositories';
import { AccountService } from './services';
import { IsUsernameTakenValidator } from './validators';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, IsUsernameTakenValidator, ...providers],
  exports: [AccountService],
})
export class AccountModule {}
