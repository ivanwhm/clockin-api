import { Test } from '@nestjs/testing';

import { AccountController } from './account.controller';
import { CreatedAccount } from './dtos/responses/created-account';
import { AccountService } from './services/account.service';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            create: jest.fn().mockImplementation(() => {
              const result = new CreatedAccount('username', new Date('2021-01-01T22:04:47.508Z'));
              return Promise.resolve(result);
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('Should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Should create an account.', async () => {
      const request = {
        username: 'username',
        password: 'password',
        passwordConfirmation: 'password',
      };

      const result = await controller.create(request);

      expect(result).toBeDefined();
      expect(result.username).toBe('username');
      expect(result.createdAt).toStrictEqual(new Date('2021-01-01T22:04:47.508Z'));
    });
  });
});
