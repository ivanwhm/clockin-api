import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { AccountService } from '../services/account.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUsernameTakenValidator implements ValidatorConstraintInterface {
  constructor(private readonly service: AccountService) {}

  async validate(username: string): Promise<boolean> {
    return !(await this.service.existsByUsername(username));
  }

  defaultMessage(): string {
    return 'Username has already been taken.';
  }
}
