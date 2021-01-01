import { getModelToken } from '@nestjs/mongoose';
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
          provide: getModelToken('Account'),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useValue: () => {},
        },
        AccountRepository,
        AccountService,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<AccountRepository>(AccountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create an account', async () => {
      const createdDate = new Date();
      const createdUsername = 'username';
      const mockCreate = new CreatedAccount(createdUsername, createdDate);

      jest.spyOn(repository, 'create').mockImplementation(() => Promise.resolve(mockCreate));

      const result = await service.create(createdUsername, 'password');

      expect(result).toBeTruthy();
      expect(result.username).toBe(createdUsername);
      expect(result.createdAt).toBe(createdDate);
    });

    it('Should thrown an exception', async () => {
      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error();
      });

      try {
        await service.create('username', 'password');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe("An error happened while trying to create an account with username 'username'.");
      }
    });
  });

  describe('existsByUsername', () => {
    it('Should return true', async () => {
      jest.spyOn(repository, 'existsByUsername').mockImplementation(() => Promise.resolve(true));

      const result = await service.existsByUsername('username');

      expect(result).toBeTruthy();
    });

    it('Should return false', async () => {
      jest.spyOn(repository, 'existsByUsername').mockImplementation(() => Promise.resolve(false));

      const result = await service.existsByUsername('username');

      expect(result).toBeFalsy();
    });

    it('Should thrown an exception', async () => {
      jest.spyOn(repository, 'existsByUsername').mockImplementation(() => {
        throw new Error();
      });

      try {
        await service.existsByUsername('username');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe("An error happened while trying to check wether the username 'username' exists or not.");
      }
    });
  });
});
