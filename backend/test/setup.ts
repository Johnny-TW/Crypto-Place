process.env.API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

process.env.COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
process.env.CRYPTOCOMPARE_API_URL = 'https://min-api.cryptocompare.com';

// Global mock for PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
  })),
}));

beforeAll(async () => {
  console.log('🧪 Starting test suite...');
});

afterAll(async () => {
  console.log('✅ Test suite completed');
});

beforeEach(() => {
  jest.clearAllMocks();
});

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      coingeckoApiUrl: 'https://api.coingecko.com/api/v3',
      cryptocompareApiUrl: 'https://min-api.cryptocompare.com',
      apiKey: 'test-api-key',
      port: 3000,
      nodeEnv: 'test',
    };
    return config[key];
  }),
};

export const createMockCoinData = (overrides = {}) => ({
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  current_price: 50000,
  market_cap: 950000000000,
  total_volume: 30000000000,
  ...overrides,
});

export const createMockNftData = (overrides = {}) => ({
  id: 'cryptopunks',
  name: 'CryptoPunks',
  description:
    'CryptoPunks launched as a fixed set of 10,000 items in mid-2017',
  ...overrides,
});

export const createMockNewsData = (overrides = {}) => ({
  Data: [
    {
      id: '1',
      title: 'Bitcoin News',
      body: 'Bitcoin price update',
      published_on: Date.now(),
      ...overrides,
    },
  ],
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeValidTimestamp(): R;
    }
  }
}

expect.extend({
  toBeValidTimestamp(received: string | number | Date) {
    const isValid = !isNaN(new Date(received).getTime());
    return {
      message: () => `expected ${received} to be a valid timestamp`,
      pass: isValid,
    };
  },
});
