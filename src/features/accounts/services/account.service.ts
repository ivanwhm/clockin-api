import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { CreatedAccount } from '../dtos';
import { AccountRepository } from '../repositories';

@Injectable()
export class AccountService {
  constructor(private readonly repository: AccountRepository) {}

  async create(username: string, password: string): Promise<CreatedAccount> {
    try {
      return await this.repository.create(username, password);
    } catch (error) {
      throw new InternalServerErrorException(error.stack, 'An error ocurred while trying to create a account.');
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    return await this.repository.existsByUsername(username);
  }
}
