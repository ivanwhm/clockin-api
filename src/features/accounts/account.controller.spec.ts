import { Test } from '@nestjs/testing';

import { AccountController } from './account.controller';
import { CreatedAccount } from './dtos/responses/created-account';
import { AccountService } from './services/account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            create: jest.fn().mockImplementation((username: string) => {
              const result = new CreatedAccount(username, new Date('2021-01-01T22:04:47.508Z'));
              return Promise.resolve(result);
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Should create an account.', async () => {
      const spyService = jest.spyOn(service, 'create');

      const result = await controller.create({
        username: 'username',
        password: 'password',
        passwordConfirmation: 'password',
      });

      expect(result).toBeDefined();
      expect(result.username).toBe('username');
      expect(result.createdAt).toStrictEqual(new Date('2021-01-01T22:04:47.508Z'));
      expect(spyService).toBeCalledWith('username', 'password');
      expect(spyService).toBeCalledTimes(1);
    });
  });
});
