import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatedAccount } from '../dtos/responses/created-account';
import { Account } from '../schemas/account.schema';

@Injectable()
export class AccountRepository {
  constructor(@InjectModel(Account.name) private readonly model: Model<Account>) {}

  async create(username: string, password: string): Promise<CreatedAccount> {
    const created = await this.model.create({ username, password } as any);

    return new CreatedAccount(created.username, created.createdAt);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return this.model.exists({ username });
  }
}
