import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountController } from './account.controller';
import { AccountRepository } from './repositories/account.repository';
import { Account, AccountSchema } from './schemas/account.schema';
import { AccountService } from './services/account.service';
import { IsUsernameTakenValidator } from './validators/is-username-taken.validator';

@Module({
  imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, IsUsernameTakenValidator],
  exports: [AccountService],
})
export class AccountModule {}
