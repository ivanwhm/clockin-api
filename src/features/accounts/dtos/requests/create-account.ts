import { IsNotEmpty, Matches, MaxLength, MinLength, Validate } from 'class-validator';

import { CompareValidator } from '../../../../core/validators/compare.validator';
import { IsUsernameTakenValidator } from '../../validators/is-username-taken.validator';

export class CreateAccount {
  @IsNotEmpty({ message: 'Username is required.' })
  @Matches(/^[a-zA-Z0-9_.]+$/, { message: 'Username is invalid.' })
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @MaxLength(30, { message: 'Username must have a maximum of 30 characters.' })
  @Validate(IsUsernameTakenValidator)
  public username: string;

  @IsNotEmpty({ message: 'Password is mandatory.' })
  @MinLength(8, { message: 'Password must have at least 8 characters.' })
  @MaxLength(150, { message: 'Password must have a maximum of 150 characters.' })
  public password: string;

  @IsNotEmpty({ message: 'Password confirmation is mandatory.' })
  @MinLength(8, { message: 'Password confirmation must have at least 8 characters.' })
  @MaxLength(150, { message: 'Password confirmation must have a maximum of 150 characters.' })
  @Validate(CompareValidator, ['password'], { message: 'The entered passwords are different.' })
  public passwordConfirmation: string;
}
