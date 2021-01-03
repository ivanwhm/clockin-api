import { Test, TestingModule } from '@nestjs/testing';

import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('Should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('generateSalt', () => {
    it('Should generate an salt.', async () => {
      const result = await service.generateSalt();

      expect(result).toBeDefined();
    });
  });

  describe('hashPassword', () => {
    it('Should hash a password.', async () => {
      const result = await service.hashPassword('123456', '$2b$10$qP8NIPmxJpPZsZYGTdPgQ.');

      expect(result).toBeDefined();
      expect(result).toEqual('$2b$10$qP8NIPmxJpPZsZYGTdPgQ.aKymwyJcGBvLyZwCRFV14P1V7P7c4CG');
    });
  });

  describe('comparePasswords', () => {
    it('Should be equal.', async () => {
      const result = await service.comparePasswords('123456', '$2b$10$qP8NIPmxJpPZsZYGTdPgQ.aKymwyJcGBvLyZwCRFV14P1V7P7c4CG');

      expect(result).toBeTruthy();
    });
    it('Should not be equal.', async () => {
      const result = await service.comparePasswords('123456', '$2b$10$qP8NIPmxJpPZsZYGTdPgQ.E2nJegGg2YeTUEXGkxG2HNSw6WpOoH6');

      expect(result).toBeFalsy();
    });
  });
});
