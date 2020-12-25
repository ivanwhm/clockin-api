import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ACCOUNT_MODEL } from 'src/core';

import { CreatedAccount } from '../dtos';
import { Account } from '../models';

@Injectable()
export class AccountRepository {
  constructor(@Inject(ACCOUNT_MODEL) private readonly accountModel: Model<Account>) {}

  async create(username: string, password: string): Promise<CreatedAccount> {
    const accountModel = new this.accountModel({ username, password });
    const createdAccount = await accountModel.save();

    return new CreatedAccount(createdAccount.username, createdAccount.createdAt);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return this.accountModel.exists({ username });
  }
}
