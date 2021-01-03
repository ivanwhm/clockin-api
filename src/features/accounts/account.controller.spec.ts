import { Test } from '@nestjs/testing';

import { AccountController } from './account.controller';
import { CreatedAccount } from './dtos/responses/created-account';
import { AccountService } from './services/account.service';

const createdAt = new Date('2021-01-01T22:04:47.508Z');

const mockService = {
  create: jest.fn().mockImplementation((username: string) => {
    const result = new CreatedAccount(username, createdAt);
    return Promise.resolve(result);
  }),
};

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Should create an account.', async () => {
      const result = await controller.create({
        username: 'username',
        password: 'password',
        passwordConfirmation: 'password',
      });

      expect(result).toBeDefined();
      expect(result.username).toBe('username');
      expect(result.createdAt).toStrictEqual(createdAt);
      expect(mockService.create).toBeCalledWith('username', 'password');
      expect(mockService.create).toBeCalledTimes(1);
    });
  });
});
