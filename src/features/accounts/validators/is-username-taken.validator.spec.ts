import { Test } from '@nestjs/testing';

import { AccountService } from '../services/account.service';
import { IsUsernameTakenValidator } from './is-username-taken.validator';

const mockService = {
  existsByUsername: jest.fn().mockImplementation((username: string) => {
    return Promise.resolve(username !== 'exists');
  }),
};

describe('IsUsernameTakenValidator', () => {
  let validator: IsUsernameTakenValidator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: AccountService,
          useValue: mockService,
        },
        IsUsernameTakenValidator,
      ],
    }).compile();

    validator = module.get<IsUsernameTakenValidator>(IsUsernameTakenValidator);
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

      expect(await validator.validate(username)).toBeFalsy();
      expect(mockService.existsByUsername).toBeCalledWith(username);
      expect(mockService.existsByUsername).toBeCalledTimes(1);
    });

    it('Should exists.', async () => {
      const username = 'exists';

      expect(await validator.validate(username)).toBeTruthy();
      expect(mockService.existsByUsername).toBeCalledWith(username);
      expect(mockService.existsByUsername).toBeCalledTimes(1);
    });
  });

  describe('defaultMessage', () => {
    it('Should return the default message.', () => {
      expect(validator.defaultMessage()).toBe('Username has already been taken.');
    });
  });
});
