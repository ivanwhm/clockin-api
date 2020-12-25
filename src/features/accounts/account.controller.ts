import { Body, Controller, Post } from '@nestjs/common';

import { CreateAccount, CreatedAccount } from './dtos';
import { AccountService } from './services';

@Controller('accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Post()
  async create(@Body() payload: CreateAccount): Promise<CreatedAccount> {
    return this.service.create(payload.username, payload.password);
  }
}
