import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'myMasterKey123',
});

// Create or get the products index with explicit primary key
const initializeIndex = async () => {
  try {
    // Try to create the index with primary key, or get it if it already exists
    await client.createIndex('products', { primaryKey: 'id' });
  } catch (error) {
    // Index might already exist, which is fine
    if (error.code !== 'index_already_exists') {
      console.error('Error initializing MeiliSearch index:', error);
    }
  }
};

// Initialize index
initializeIndex();

// Get the products index
const index = client.index('products');

export default index;
export { client };
