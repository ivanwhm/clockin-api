import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { AccountRepository } from '../repositories/account.repository';
import { AccountService } from '../services/account.service';
import { IsUsernameTakenValidator } from './is-username-taken.validator';

describe('IsUsernameTakenValidator', () => {
  let validator: IsUsernameTakenValidator;
  let service: AccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('Account'),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useValue: () => {},
        },
        AccountRepository,
        AccountService,
        IsUsernameTakenValidator,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    validator = module.get<IsUsernameTakenValidator>(IsUsernameTakenValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instantiation', () => {
    it('Should exists', () => {
      expect(validator).toBeTruthy();
    });
  });

  describe('validate', () => {
    it('Should return false', async () => {
      jest.spyOn(service, 'existsByUsername').mockImplementation(() => Promise.resolve(true));
      expect(await validator.validate('username')).toBeFalsy();
    });

    it('Should return true', async () => {
      jest.spyOn(service, 'existsByUsername').mockImplementation(() => Promise.resolve(false));
      expect(await validator.validate('username')).toBeTruthy();
    });
  });

  describe('defaultMessage', () => {
    it('Should return default message', () => {
      expect(validator.defaultMessage()).toBe('Username has already been taken.');
    });
  });
});
