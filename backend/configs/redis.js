import Redis from 'ioredis';
import logger from '../logger.js';

const redisUrl = process.env.REDIS_URL;

const redisOptions = redisUrl
  ? redisUrl
  : {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    };

const redis = new Redis(redisOptions);

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

export default redis;
