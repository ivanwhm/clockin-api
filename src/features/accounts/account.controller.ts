import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateAccount } from './dtos/requests/create-account';
import { CreatedAccount } from './dtos/responses/created-account';
import { AccountService } from './services/account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreateAccount): Promise<CreatedAccount> {
    const { username, password } = request;

    return await this.service.create(username, password);
  }
}
