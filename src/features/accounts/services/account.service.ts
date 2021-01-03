import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { SecurityService } from '../../../shared/services/security/security.service';
import { CreatedAccount } from '../dtos/responses/created-account';
import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly repository: AccountRepository, private readonly securityService: SecurityService) {}

  async create(username: string, password: string): Promise<CreatedAccount> {
    try {
      const salt = await this.securityService.generateSalt();
      const hashedPassword = await this.securityService.hashPassword(password, salt);

      return this.repository.create(username, hashedPassword, salt);
    } catch (error) {
      const message = `An error happened while trying to create an account with username '${username}'.`;
      throw new InternalServerErrorException(message);
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      return this.repository.existsByUsername(username);
    } catch (error) {
      const message = `An error happened while trying to check wether the username '${username}' exists or not.`;
      throw new InternalServerErrorException(message);
    }
  }
}
