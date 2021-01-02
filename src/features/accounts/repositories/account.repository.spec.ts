import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { Account } from '../schemas/account.schema';
import { AccountRepository } from './account.repository';

const mockRepository = {
  create: jest.fn().mockReturnValue({
    username: 'username',
    createdAt: new Date('2021-01-01T22:04:47.508Z'),
  }),
  exists: jest.fn().mockImplementation((args: any) => {
    return Promise.resolve(args.username === 'exist');
  }),
};

describe('AccountRepository', () => {
  let repository: AccountRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Account.name),
          useValue: mockRepository,
        },
        AccountRepository,
      ],
    }).compile();

    repository = module.get<AccountRepository>(AccountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined.', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('Should create an account.', async () => {
      const username = 'username';
      const password = 'password';

      const result = await repository.create(username, password);

      expect(result).toBeDefined();
      expect(result.username).toBe(username);
      expect(mockRepository.create).toBeCalledWith({ username, password });
      expect(mockRepository.create).toBeCalledTimes(1);
    });
  });

  describe('existsByUsername', () => {
    it('Should not exist.', async () => {
      const username = 'notExist';

      const result = await repository.existsByUsername(username);

      expect(result).toBeFalsy();
      expect(mockRepository.exists).toBeCalledWith({ username });
      expect(mockRepository.exists).toBeCalledTimes(1);
    });

    it('Should exist.', async () => {
      const username = 'exist';

      const result = await repository.existsByUsername(username);

      expect(result).toBeTruthy();
      expect(mockRepository.exists).toBeCalledWith({ username });
      expect(mockRepository.exists).toBeCalledTimes(1);
    });
  });
});
