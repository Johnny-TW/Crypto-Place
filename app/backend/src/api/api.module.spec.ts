import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import configuration from '../config/configuration';

describe('ApiModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ApiModule,
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ApiController', () => {
    const controller = module.get<ApiController>(ApiController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(ApiController);
  });

  it('should have ApiService', () => {
    const service = module.get<ApiService>(ApiService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(ApiService);
  });

  it('should import HttpModule', () => {
    const httpModule = module.get(HttpModule);
    expect(httpModule).toBeDefined();
  });

  it('should compile successfully', async () => {
    const app = module.createNestApplication();
    expect(app).toBeDefined();
    await app.close();
  });
});
