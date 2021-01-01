import { Test } from '@nestjs/testing';

import { CreatedAccount } from '../dtos/responses/created-account';
import { AccountRepository } from '../repositories/account.repository';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  let repository: AccountRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: AccountRepository,
          useValue: {
            create: jest.fn().mockImplementation((username: string) => {
              if (!username) {
                throw new Error();
              } else {
                const result = new CreatedAccount(username, new Date('2021-01-01T22:04:47.508Z'));
                return Promise.resolve(result);
              }
            }),
            existsByUsername: jest.fn().mockImplementation((username: string) => {
              if (!username) {
                throw new Error();
              } else {
                return Promise.resolve(username === 'exists');
              }
            }),
          },
        },
        AccountService,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<AccountRepository>(AccountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create an account.', async () => {
      const username = 'username';
      const password = 'password';
      const spyRepository = jest.spyOn(repository, 'create');

      const result = await service.create(username, password);

      expect(result).toBeTruthy();
      expect(result.username).toBe(username);
      expect(result.createdAt).toStrictEqual(new Date('2021-01-01T22:04:47.508Z'));
      expect(spyRepository).toBeCalledWith(username, password);
      expect(spyRepository).toBeCalledTimes(1);
    });

    it('Should thrown an exception.', async () => {
      try {
        await service.create('', '');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe("An error happened while trying to create an account with username ''.");
      }
    });
  });

  describe('existsByUsername', () => {
    it('Should return true.', async () => {
      const username = 'exists';
      const spyRepository = jest.spyOn(repository, 'existsByUsername');

      const result = await service.existsByUsername(username);

      expect(result).toBeTruthy();
      expect(spyRepository).toBeCalledWith(username);
      expect(spyRepository).toBeCalledTimes(1);
    });

    it('Should return false.', async () => {
      const username = 'notExists';
      const spyRepository = jest.spyOn(repository, 'existsByUsername');

      const result = await service.existsByUsername(username);

      expect(result).toBeFalsy();
      expect(spyRepository).toBeCalledWith(username);
      expect(spyRepository).toBeCalledTimes(1);
    });

    it('Should thrown an exception.', async () => {
      try {
        await service.existsByUsername('');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe("An error happened while trying to check wether the username '' exists or not.");
      }
    });
  });
});
