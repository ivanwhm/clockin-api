import { Test } from '@nestjs/testing';

import { AccountService } from '../services/account.service';
import { IsUsernameTakenValidator } from './is-username-taken.validator';

describe('IsUsernameTakenValidator', () => {
  let validator: IsUsernameTakenValidator;
  let service: AccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsUsernameTakenValidator,
        {
          provide: AccountService,
          useValue: {
            existsByUsername: jest.fn().mockImplementation((username: string) => {
              return Promise.resolve(username !== 'exists');
            }),
          },
        },
      ],
    }).compile();

    validator = module.get<IsUsernameTakenValidator>(IsUsernameTakenValidator);
    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined.', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('Should not exists.', async () => {
      const username = 'notExists';
      const spyService = jest.spyOn(service, 'existsByUsername');

      expect(await validator.validate(username)).toBeFalsy();
      expect(spyService).toBeCalledWith(username);
      expect(spyService).toBeCalledTimes(1);
    });

    it('Should exists.', async () => {
      const username = 'exists';
      const spyService = jest.spyOn(service, 'existsByUsername');

      expect(await validator.validate(username)).toBeTruthy();
      expect(spyService).toBeCalledWith(username);
      expect(spyService).toBeCalledTimes(1);
    });
  });

  describe('defaultMessage', () => {
    it('Should return the default message.', () => {
      expect(validator.defaultMessage()).toBe('Username has already been taken.');
    });
  });
});
