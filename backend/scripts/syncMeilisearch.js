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
import { client } from '../configs/meilisearch.js';
import logger from '../logger.js';

const syncMeilisearch = async () => {
  try {
    logger.info('Starting Meilisearch synchronization...');

    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Ensure index exists with correct primary key
    logger.info('Setting up Meilisearch index...');
    try {
      // Try to get the index
      const index = await client.getIndex('products');
      const indexInfo = await index.fetchInfo();

      // Check if primary key is set correctly
      if (!indexInfo.primaryKey || indexInfo.primaryKey !== 'id') {
        logger.info('Primary key not set or incorrect, recreating index...');
        // Delete the index
        await client.deleteIndex('products');
        logger.info('Old index deleted');

        // Create new index with correct primary key
        await client.createIndex('products', { primaryKey: 'id' });
        logger.info('New index created with primary key: id');
      } else {
        logger.info('Index already exists with correct primary key');
      }
    } catch (error) {
      if (error.code === 'index_not_found') {
        // Create the index if it doesn't exist
        await client.createIndex('products', { primaryKey: 'id' });
        logger.info('Index created with primary key: id');
      } else {
        throw error;
      }
    }

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
