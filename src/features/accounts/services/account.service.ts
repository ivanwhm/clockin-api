import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreatedAccount } from '../dtos/responses/created-account';
import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly repository: AccountRepository) {}

  async create(username: string, password: string): Promise<CreatedAccount> {
    try {
      return await this.repository.create(username, password);
    } catch (error) {
      const message = `An error happened while trying to create an account with username '${username}'.`;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      return await this.repository.existsByUsername(username);
    } catch (error) {
      const message = `An error happened while trying to check wether the username '${username}' exists or not.`;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
