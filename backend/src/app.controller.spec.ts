import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getWelcome', () => {
    it('should return welcome message with correct structure', () => {
      const result = appController.getWelcome();

      expect(result).toHaveProperty('message', 'Welcome to EE40 - Crypto Place API');
      expect(result).toHaveProperty('version', '2.0.0');
      expect(result).toHaveProperty(
        'description',
        '提供加密貨幣、NFT、新聞等數據的 API 服務',
      );
      expect(result).toHaveProperty('documentation', '/api/docs');
      expect(result).toHaveProperty('endpoints');
      expect(result.endpoints).toHaveProperty('coins', '/api/coins/markets');
      expect(result.endpoints).toHaveProperty('nfts', '/api/nfts/list');
      expect(result.endpoints).toHaveProperty('news', '/api/news');
    });

    it('should return all required endpoints', () => {
      const result = appController.getWelcome();
      const endpoints = result.endpoints;

      expect(endpoints).toHaveProperty('coins');
      expect(endpoints).toHaveProperty('coinById');
      expect(endpoints).toHaveProperty('nfts');
      expect(endpoints).toHaveProperty('nftById');
      expect(endpoints).toHaveProperty('marketData');
      expect(endpoints).toHaveProperty('news');
      expect(endpoints).toHaveProperty('cryptoDetails');
      expect(endpoints).toHaveProperty('cryptoDetailsChart');
      expect(endpoints).toHaveProperty('cryptoMarketList');
    });
  });

  describe('healthCheck', () => {
    it('should return health status with correct structure', () => {
      const result = appController.healthCheck();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('memory');
      expect(result).toHaveProperty('node_version');

      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.uptime).toBe('number');
      expect(typeof result.memory).toBe('object');
      expect(typeof result.node_version).toBe('string');
    });

    it('should return valid ISO timestamp', () => {
      const result = appController.healthCheck();
      const timestamp = new Date(result.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should return memory usage object with expected properties', () => {
      const result = appController.healthCheck();
      const memory = result.memory;

      expect(memory).toHaveProperty('rss');
      expect(memory).toHaveProperty('heapTotal');
      expect(memory).toHaveProperty('heapUsed');
      expect(memory).toHaveProperty('external');
      expect(memory).toHaveProperty('arrayBuffers');
    });

    it('should return positive uptime', () => {
      const result = appController.healthCheck();

      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
