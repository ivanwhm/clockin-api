import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { SecurityService } from '../../../shared/services/security/security.service';
import { SharedModule } from '../../../shared/shared.module';
import { CreatedAccount } from '../dtos/responses/created-account';
import { AccountRepository } from '../repositories/account.repository';
import { AccountService } from './account.service';

const salt = '$2b$10$qP8NIPmxJpPZsZYGTdPgQ.';
const hashedPassword = '$2b$10$qP8NIPmxJpPZsZYGTdPgQ.aKymwyJcGBvLyZwCRFV14P1V7P7c4CG';
const createdAt = new Date('2021-01-01T22:04:47.508Z');

const mockRepository = {
  create: jest.fn().mockImplementation((username: string) => {
    if (username === 'username2') {
      throw new Error();
    } else {
      const result = new CreatedAccount(username, createdAt);
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

const mockSecurityService = {
  generateSalt: jest.fn().mockReturnValue(salt),
  hashPassword: jest.fn().mockReturnValue(hashedPassword),
};

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        {
          provide: AccountRepository,
          useValue: mockRepository,
        },
        {
          provide: SecurityService,
          useValue: mockSecurityService,
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
      expect(result.createdAt).toStrictEqual(createdAt);
      expect(mockSecurityService.generateSalt).toBeCalledTimes(1);
      expect(mockSecurityService.hashPassword).toBeCalledTimes(1);
      expect(mockSecurityService.hashPassword).toBeCalledWith(password, salt);
      expect(mockRepository.create).toBeCalledWith(username, hashedPassword, salt);
      expect(mockRepository.create).toBeCalledTimes(1);
    });

    it('Should thrown an exception.', async () => {
      const username = 'username2';
      const password = 'password2';

      await service.create(username, password).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: "An error happened while trying to create an account with username 'username2'.",
        });
      });
      expect(mockSecurityService.generateSalt).toBeCalledTimes(1);
      expect(mockSecurityService.hashPassword).toBeCalledTimes(1);
      expect(mockSecurityService.hashPassword).toBeCalledWith(password, salt);
      expect(mockRepository.create).toBeCalledWith(username, hashedPassword, salt);
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
