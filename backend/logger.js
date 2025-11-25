// backend/logger.js
import pino from 'pino';

const logger = pino({
  // In production, we want 'info' or 'error'. In dev, 'debug' is fine.
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty', // Makes logs colorful and readable during development
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

export default logger;
