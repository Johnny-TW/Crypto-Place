import dotenv from 'dotenv';

dotenv.config();

const corsConfig = {
  origin: [
    'http://localhost:3000',
    'http://10.33.29.200:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export default corsConfig;