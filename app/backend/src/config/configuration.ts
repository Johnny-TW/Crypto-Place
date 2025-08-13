export default () => ({
  port: parseInt(process.env.PORT, 10) || 5001,
  apiKey: process.env.API_KEY,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',

  corsOrigin:
    process.env.CORS_ORIGIN || 'http://localhost:3000,http://10.33.29.200:5173',

  coingeckoApiUrl: 'https://api.coingecko.com/api/v3',
  cryptocompareApiUrl: 'https://data-api.cryptocompare.com',

  get corsOrigins() {
    return this.corsOrigin.split(',').map((origin) => origin.trim());
  },
});