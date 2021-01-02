import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatedAccount } from '../dtos/responses/created-account';
import { Account } from '../schemas/account.schema';

@Injectable()
export class AccountRepository {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  async create(username: string, password: string): Promise<CreatedAccount> {
    const accountModel = new this.accountModel({ username, password });
    const createdAccount = await accountModel.save();

    return new CreatedAccount(createdAccount.username, createdAccount.createdAt);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return this.accountModel.exists({ username });
  }

  async deleteAll(): Promise<void> {
    await this.accountModel.deleteMany();
  }
}
