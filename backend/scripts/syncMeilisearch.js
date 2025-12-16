/**
 * Script to sync MongoDB products with Meilisearch
 * Run this script to:
 * 1. Configure Meilisearch index settings
 * 2. Sync all existing products to Meilisearch
 * 
 * Usage: node scripts/syncMeilisearch.js
 */

import 'dotenv/config';
import connectDB from '../configs/database.js';
import meilisearchService from '../services/meilisearch.service.js';
import logger from '../logger.js';

const syncMeilisearch = async () => {
  try {
    logger.info('Starting Meilisearch synchronization...');

    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Configure Meilisearch index
    logger.info('Configuring Meilisearch index...');
    await meilisearchService.configureIndex();
    logger.info('Meilisearch index configured successfully');

    // Get current index stats
    const statsBefore = await meilisearchService.getIndexStats();
    logger.info(`Current index contains ${statsBefore.numberOfDocuments} documents`);

    // Sync all products
    logger.info('Syncing all products to Meilisearch...');
    const result = await meilisearchService.syncAllProducts();
    
    logger.info(`✓ Successfully synced ${result.count} products to Meilisearch`);

    // Get updated stats
    const statsAfter = await meilisearchService.getIndexStats();
    logger.info(`Index now contains ${statsAfter.numberOfDocuments} documents`);

    logger.info('Meilisearch synchronization completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Synchronization failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

syncMeilisearch();
