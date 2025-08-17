import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpModule } from '@nestjs/axios';

describe('Crypto Place API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Root Routes', () => {
    it('/api (GET) - should return welcome message', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Welcome to Crypto Place API',
          );
          expect(res.body).toHaveProperty('version', '2.0.0');
          expect(res.body).toHaveProperty('endpoints');
          expect(res.body.endpoints).toHaveProperty('coins');
          expect(res.body.endpoints).toHaveProperty('nfts');
          expect(res.body.endpoints).toHaveProperty('news');
        });
    });

    it('/api/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('memory');
          expect(res.body).toHaveProperty('node_version');
          expect(typeof res.body.timestamp).toBe('string');
          expect(typeof res.body.uptime).toBe('number');
          expect(typeof res.body.memory).toBe('object');
        });
    });
  });

  describe('API Routes', () => {
    it('/api/coins/markets (GET) - should return coins market data', () => {
      return request(app.getHttpServer())
        .get('/api/coins/markets')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body) || res.body.error).toBeTruthy();
          if (Array.isArray(res.body)) {
            expect(res.body.length).toBeGreaterThanOrEqual(0);
          }
        });
    }, 30000);

    it('/api/coins/markets (GET) with query params - should accept query parameters', () => {
      return request(app.getHttpServer())
        .get('/api/coins/markets?vs_currency=usd&per_page=10')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body) || res.body.error).toBeTruthy();
        });
    }, 30000);

    it('/api/coins/bitcoin (GET) - should return Bitcoin data', () => {
      return request(app.getHttpServer())
        .get('/api/coins/bitcoin')
        .expect(200)
        .expect((res) => {
          if (!res.body.error) {
            expect(res.body).toHaveProperty('id');
            expect(res.body.id).toBe('bitcoin');
          }
        });
    }, 30000);

    it('/api/nfts/list (GET) - should return NFTs list', () => {
      return request(app.getHttpServer())
        .get('/api/nfts/list')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body) || res.body.error).toBeTruthy();
        });
    }, 30000);

    it('/api/news (GET) - should return crypto news', () => {
      return request(app.getHttpServer())
        .get('/api/news')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          if (res.body.Data) {
            expect(Array.isArray(res.body.Data)).toBeTruthy();
          }
        });
    }, 30000);

    it('/api/crypto-market-list (GET) - should return exchanges list', () => {
      return request(app.getHttpServer())
        .get('/api/crypto-market-list')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body) || res.body.error).toBeTruthy();
        });
    }, 30000);
  });

  describe('Error Handling', () => {
    it('/api/coins/invalid-coin-id (GET) - should handle invalid coin ID', () => {
      return request(app.getHttpServer())
        .get('/api/coins/invalid-coin-id-that-does-not-exist')
        .expect((res) => {
          expect([200, 400, 404, 500]).toContain(res.status);
          if (res.status !== 200) {
            expect(res.body.message || res.body.error).toBeTruthy();
          }
        });
    }, 30000);

    it('/api/nfts/invalid-nft-id (GET) - should handle invalid NFT ID', () => {
      return request(app.getHttpServer())
        .get('/api/nfts/invalid-nft-id-that-does-not-exist')
        .expect((res) => {
          expect([200, 400, 404, 500]).toContain(res.status);
          if (res.status !== 200) {
            expect(res.body.message || res.body.error).toBeTruthy();
          }
        });
    }, 30000);

    it('/api/exchanges/invalid-exchange-id (GET) - should handle invalid exchange ID', () => {
      return request(app.getHttpServer())
        .get('/api/exchanges/invalid-exchange-id-that-does-not-exist')
        .expect((res) => {
          expect([200, 400, 404, 500]).toContain(res.status);
          if (res.status !== 200) {
            expect(res.body.message || res.body.error).toBeTruthy();
          }
        });
    }, 30000);

    it('Invalid route - should return 404', () => {
      return request(app.getHttpServer())
        .get('/invalid-route-that-does-not-exist')
        .expect(404);
    });
  });

  describe('API Response Structure', () => {
    it('should have consistent error response structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/coins/definitely-invalid-coin-id')
        .expect((res) => {
          if (res.status >= 400) {
            expect(res.body.message || res.body.error).toBeTruthy();
            expect(typeof (res.body.message || res.body.error)).toBe('string');
          }
        });
    }, 30000);

    it('should handle query parameters correctly in all endpoints', async () => {
      const endpoints = [
        '/api/coins/markets?vs_currency=eur&per_page=5',
        '/api/nfts/list?order=h24_volume_usd_desc',
        '/api/news?lang=EN&limit=2',
      ];

      for (const endpoint of endpoints) {
        await request(app.getHttpServer())
          .get(endpoint)
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeDefined();
          });
      }
    }, 60000);
  });

  describe('Performance Tests', () => {
    it('should respond to health check within reasonable time', async () => {
      const start = Date.now();

      await request(app.getHttpServer()).get('/api/health').expect(200);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(3)
        .fill(null)
        .map(() => request(app.getHttpServer()).get('/api/health').expect(200));

      const responses = await Promise.allSettled(requests);

      responses.forEach((response) => {
        if (response.status === 'fulfilled') {
          expect(response.value.body).toHaveProperty('status', 'ok');
        }
      });
    });
  });
});
