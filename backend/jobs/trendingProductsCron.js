import cron from 'node-cron';
import { refreshTrendingProducts } from '../services/trending.service.js';
import logger from '../logger.js';

const DEFAULT_EXPRESSION = '*/15 * * * *';

const startTrendingProductsCron = () => {
  const cronExpression = process.env.TRENDING_CRON_EXPRESSION || DEFAULT_EXPRESSION;

  logger.info(
    `Starting trending products cron (${cronExpression}) - formula: score = sales_last_1h * 0.6 + sales_last_6h * 0.3 + sales_last_24h * 0.1`,
  );

  const task = cron.schedule(cronExpression, async () => {
    try {
      const { products } = await refreshTrendingProducts();
      logger.info(`Trending products cache refreshed (${products.length} items)`);
    } catch (error) {
      logger.error(`Trending products cron failed: ${error.message}`);
    }
  });

  return task;
};

export default startTrendingProductsCron;
