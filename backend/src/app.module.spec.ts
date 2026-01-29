import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { ApiModule } from './controllers/api/api.module';
import { MsalService } from './controllers/auth/services/msal.service';

// 模擬的 MsalService，用於測試目的，避免在測試期間進行實際的外部呼叫。
const mockMsalService = {
  getAuthUrl: jest.fn().mockResolvedValue({
    authUrl: 'https://mock-auth-url.com',
    state: 'mock-state',
    codeVerifier: 'mock-verifier',
  }),
  acquireTokenByCode: jest.fn().mockResolvedValue({
    azureId: 'mock-azure-id',
    email: 'test@example.com',
    name: 'Test User',
  }),
};

// 測試 AppModule 的設定和依賴注入
describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MsalService)
      .useValue(mockMsalService)
      .compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should import ConfigModule', () => {
    const configModule = module.get(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should import HttpModule', () => {
    const httpModule = module.get(HttpModule);
    expect(httpModule).toBeDefined();
  });

  it('should import ApiModule', () => {
    const apiModule = module.get(ApiModule);
    expect(apiModule).toBeDefined();
  });

  it('should compile successfully', async () => {
    const app = module.createNestApplication();
    expect(app).toBeDefined();
    await app.close();
  });
});
