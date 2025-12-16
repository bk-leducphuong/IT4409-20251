import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'myMasterKey123',
});

// Get the products index
const index = client.index('products');

export default index;
export { client };
