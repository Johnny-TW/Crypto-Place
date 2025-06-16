import { ConfigService } from '@nestjs/config';

// Mock environment variables for testing
process.env.API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';

// Set up test database or other test-specific configurations
process.env.COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
process.env.CRYPTOCOMPARE_API_URL = 'https://min-api.cryptocompare.com';

// Global test setup
beforeAll(async () => {
  // Initialize test dependencies
  console.log('🧪 Starting test suite...');
});

afterAll(async () => {
  // Cleanup after all tests
  console.log('✅ Test suite completed');
});

// Global test utilities
beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks();
});

// Mock ConfigService for testing
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

// Test data factories
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
  description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017',
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

// Custom matchers for testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidTimestamp(): R;
    }
  }
}

expect.extend({
  toBeValidTimestamp(received: any) {
    const isValid = !isNaN(new Date(received).getTime());
    return {
      message: () => `expected ${received} to be a valid timestamp`,
      pass: isValid,
    };
  },
});