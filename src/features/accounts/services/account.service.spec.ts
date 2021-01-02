import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CreatedAccount } from '../dtos/responses/created-account';
import { AccountRepository } from '../repositories/account.repository';
import { AccountService } from './account.service';

const mockRepository = {
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
};

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: AccountRepository,
          useValue: mockRepository,
        },
        AccountService,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
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

      const result = await service.create(username, password);

      expect(result).toBeDefined();
      expect(result.username).toBe(username);
      expect(result.createdAt).toStrictEqual(new Date('2021-01-01T22:04:47.508Z'));
      expect(mockRepository.create).toBeCalledWith(username, password);
      expect(mockRepository.create).toBeCalledTimes(1);
    });

    it('Should thrown an exception.', async () => {
      const username = '';
      const password = '';

      await service.create(username, password).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: "An error happened while trying to create an account with username ''.",
        });
      });
      expect(mockRepository.create).toBeCalledWith(username, password);
      expect(mockRepository.create).toBeCalledTimes(1);
    });
  });

  describe('existsByUsername', () => {
    it('Should return true.', async () => {
      const username = 'exists';

      const result = await service.existsByUsername(username);

      expect(result).toBeDefined();
      expect(mockRepository.existsByUsername).toBeCalledWith(username);
      expect(mockRepository.existsByUsername).toBeCalledTimes(1);
    });

    it('Should return false.', async () => {
      const username = 'notExists';

      const result = await service.existsByUsername(username);

      expect(result).toBeFalsy();
      expect(mockRepository.existsByUsername).toBeCalledWith(username);
      expect(mockRepository.existsByUsername).toBeCalledTimes(1);
    });

    it('Should thrown an exception.', async () => {
      const username = '';

      await service.existsByUsername(username).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: "An error happened while trying to check wether the username '' exists or not.",
        });
      });
      expect(mockRepository.existsByUsername).toBeCalledWith(username);
      expect(mockRepository.existsByUsername).toBeCalledTimes(1);
    });
  });
});
