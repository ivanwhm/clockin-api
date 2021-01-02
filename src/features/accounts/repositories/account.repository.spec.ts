import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { AccountSchema } from '../schemas/account.schema';
import { AccountRepository } from './account.repository';

describe('AccountRepository', () => {
  let mongod: MongoMemoryServer;
  let repository: AccountRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = new MongoMemoryServer();
            const mongoUri = await mongod.getUri();
            return {
              uri: mongoUri,
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
              useFindAndModify: false,
            };
          },
        }),
        MongooseModule.forFeature([
          {
            name: 'Account',
            schema: AccountSchema,
          },
        ]),
      ],
      providers: [AccountRepository],
    }).compile();

    repository = module.get<AccountRepository>(AccountRepository);
  });

  it('Should be defined.', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('Should create an account.', async () => {
      const result = await repository.create('username', 'password');

      expect(result).toBeDefined();
      expect(result.username).toBe('username');
    });
  });

  describe('existsByUsername', () => {
    it('Should not exist.', async () => {
      await repository.deleteAll();

      const result = await repository.existsByUsername('username');

      expect(result).toBeFalsy();
    });

    it('Should exist.', async () => {
      await repository.deleteAll();
      await repository.create('username', 'password');

      const result = await repository.existsByUsername('username');

      expect(result).toBeTruthy();
    });
  });

  describe('deleteAll', () => {
    it('Should delete everything.', async () => {
      await repository.create('username', 'password');
      await repository.deleteAll();

      const result = await repository.existsByUsername('username');

      expect(result).toBeFalsy();
    });
  });

  afterAll(async () => {
    if (mongod) await mongod.stop();
  });
});
