# Meilisearch Integration

This document explains how Meilisearch is integrated into the backend for fast and powerful product search capabilities.

## Overview

Meilisearch is a powerful, fast, open-source search engine that provides:
- **Lightning-fast search** (queries in <50ms)
- **Typo tolerance** (handles spelling mistakes)
- **Faceted search** (filter by category, brand, price, etc.)
- **Highlighting** (shows matching terms in results)
- **Custom ranking** (relevance-based sorting)

## Architecture

The integration follows a dual-storage pattern:
- **MongoDB**: Source of truth for all product data
- **Meilisearch**: Optimized search index, automatically synchronized

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │ search  │   Backend    │  query  │ Meilisearch │
│             ├────────>│   (Node.js)  ├────────>│   Server    │
│             │<────────┤              │<────────┤             │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │ CRUD ops
                               ↓
                        ┌──────────────┐
                        │   MongoDB    │
                        │              │
                        └──────────────┘
```

## Setup

### 1. Start Meilisearch Server

Using Docker (recommended):

```bash
cd meilisearch
docker-compose up -d
```

This will start Meilisearch on `http://localhost:7700` with the master key defined in `docker-compose.yml`.

### 2. Configure Environment Variables

Add to your `.env` file:

```env
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=myMasterKey123
```

**Note**: Change the master key in production!

### 3. Initialize and Sync

Run the sync script to configure the index and sync existing products:

```bash
npm run sync:meilisearch
```

This will:
1. Configure the Meilisearch index with appropriate settings
2. Sync all existing products from MongoDB to Meilisearch

## How It Works

### Automatic Synchronization

The integration automatically keeps Meilisearch in sync with MongoDB through hooks in the admin product service:

- **Product Created**: Automatically added to Meilisearch index
- **Product Updated**: Automatically updated in Meilisearch index
- **Product Deleted**: Automatically removed from Meilisearch index
- **Variant Added/Updated/Deleted**: Parent product updated in Meilisearch

All synchronization happens asynchronously (non-blocking) to avoid impacting API response times.

### Search Flow

When a user searches for products:

1. **With search query**: Request goes to Meilisearch
   - Meilisearch performs fast full-text search
   - Returns product IDs and basic info
   - Backend fetches complete product details from MongoDB
   - Results returned with search relevance order preserved

2. **Without search query** (filter only): Request goes to MongoDB
   - Standard MongoDB queries for filtering
   - No Meilisearch overhead for simple filters

3. **Fallback**: If Meilisearch fails
   - Automatically falls back to MongoDB regex search
   - Ensures service availability

## Index Structure

Each product in the Meilisearch index contains:

```javascript
{
  id: "product_id",              // MongoDB _id
  name: "Product Name",          // Searchable
  slug: "product-slug",
  description: "...",            // Searchable
  category_id: "category_id",
  category_name: "Category",     // Searchable + Filterable
  category_slug: "category",     // Filterable
  brand_id: "brand_id",
  brand_name: "Brand Name",      // Searchable + Filterable
  brand_logo_url: "...",
  price: 1000,                   // Min variant price (Sortable)
  min_price: 1000,
  max_price: 2000,
  stock_quantity: 100,           // Total stock (Filterable)
  main_image_url: "...",
  variants_count: 3,
  sku: "SKU1 SKU2 SKU3",        // All SKUs (Searchable)
  createdAt: 1639612800000,     // Timestamp (Sortable)
  updatedAt: 1639612800000
}
```

### Index Settings

- **Searchable attributes**: name, description, brand_name, category_name, sku
- **Filterable attributes**: category_id, brand_id, price, stock_quantity, category_slug, brand_name
- **Sortable attributes**: price, createdAt, name
- **Ranking rules**: words, typo, proximity, attribute, sort, exactness, price:asc

## API Usage

### Search Products (User-facing)

**Endpoint**: `GET /api/products`

**Query Parameters**:
- `search` (string): Search query (triggers Meilisearch)
- `category` (string): Filter by category slug
- `brand` (string): Filter by brand name
- `sort_by` (string): Sort option (newest, price_asc, price_desc, name_asc, name_desc)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Example**:
```bash
# Search for "laptop"
GET /api/products?search=laptop

# Search for "laptop" in "electronics" category
GET /api/products?search=laptop&category=electronics

# Filter by brand without search
GET /api/products?brand=Apple&sort_by=price_asc
```

**Response**:
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    },
    "searchTimeMs": 12  // Only included when using Meilisearch
  }
}
```

### Admin Endpoints

#### Sync All Products

**Endpoint**: `POST /api/admin/meilisearch/sync`

Manually trigger a full synchronization of all products.

**Response**:
```json
{
  "success": true,
  "message": "Products synced successfully",
  "data": {
    "success": true,
    "count": 150
  }
}
```

#### Configure Index

**Endpoint**: `POST /api/admin/meilisearch/configure`

Reconfigure the Meilisearch index settings.

#### Get Index Stats

**Endpoint**: `GET /api/admin/meilisearch/stats`

Get statistics about the Meilisearch index.

**Response**:
```json
{
  "success": true,
  "data": {
    "numberOfDocuments": 150,
    "isIndexing": false,
    "fieldDistribution": {...}
  }
}
```

#### Clear Index

**Endpoint**: `DELETE /api/admin/meilisearch/clear`

Clear all documents from the index (useful for development/testing).

## Scripts

### Sync Script

Run manually to sync products:

```bash
npm run sync:meilisearch
```

This is useful when:
- First setting up Meilisearch
- After bulk data imports
- After index configuration changes
- After recovering from errors

## Search Features

### Typo Tolerance

Meilisearch automatically handles typos:
- "lapto" → finds "laptop"
- "aple" → finds "apple"

### Prefix Search

Partial words work out of the box:
- "lap" → finds "laptop"
- "pho" → finds "phone"

### Multi-word Search

Searches across all searchable fields:
- "apple laptop" → finds "Apple MacBook Pro"
- "red nike shoes" → finds Nike shoes with "red" in description

### Faceted Filtering

Combine search with filters:
```bash
GET /api/products?search=laptop&category=electronics&brand=Dell&sort_by=price_asc
```

### Price Range (Coming Soon)

```bash
GET /api/products?search=laptop&minPrice=500&maxPrice=1500
```

## Monitoring

### Check Meilisearch Health

```bash
curl http://localhost:7700/health
```

### View Index in Browser

Visit: `http://localhost:7700` (requires API key)

### Check Synchronization Status

```bash
# Get index stats
curl -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  http://localhost:5001/api/admin/meilisearch/stats
```

## Troubleshooting

### Meilisearch Not Running

```bash
cd meilisearch
docker-compose ps
docker-compose up -d  # Start if not running
```

### Products Not Appearing in Search

1. Check if products exist in MongoDB
2. Run sync script: `npm run sync:meilisearch`
3. Check index stats: `GET /api/admin/meilisearch/stats`
4. Check logs for sync errors

### Search Returns No Results

1. Check Meilisearch logs: `docker-compose logs -f meilisearch`
2. Verify index configuration
3. Try clearing and resyncing: 
   ```bash
   curl -X DELETE http://localhost:5001/api/admin/meilisearch/clear
   npm run sync:meilisearch
   ```

### API Key Errors

Ensure the master key in `docker-compose.yml` matches `configs/meilisearch.js`.

## Performance

- **Average search time**: <50ms
- **Index size**: ~1KB per product
- **Memory usage**: ~100MB for 10,000 products
- **Sync time**: ~1 second per 1,000 products

## Security

### Production Checklist

- [ ] Change master key in `docker-compose.yml`
- [ ] Use environment variables for sensitive keys
- [ ] Use search-only API key on frontend
- [ ] Keep admin API key on backend only
- [ ] Enable HTTPS for Meilisearch in production
- [ ] Restrict Meilisearch network access

### API Keys

Meilisearch has different API keys for different permissions:

- **Master Key**: Full access (backend only)
- **Admin Key**: Create/update/delete documents (backend only)
- **Search Key**: Read-only search (can be exposed to frontend)

The search key is stored in `meilisearch/keys.json` for your reference.

## Best Practices

1. **Always sync after bulk operations**: After seeding data or bulk imports
2. **Monitor index size**: Keep an eye on disk usage
3. **Use appropriate filters**: Combine Meilisearch search with MongoDB filters
4. **Handle failures gracefully**: The fallback to MongoDB ensures availability
5. **Log sync errors**: Check logs regularly for synchronization issues

## Future Enhancements

Potential improvements:

- [ ] Add price range filtering
- [ ] Implement search suggestions/autocomplete
- [ ] Add search analytics
- [ ] Implement geo-search for products
- [ ] Add synonym support
- [ ] Implement custom stop words
- [ ] Add search result highlighting

## Resources

- [Meilisearch Documentation](https://docs.meilisearch.com/)
- [Meilisearch Node.js SDK](https://github.com/meilisearch/meilisearch-js)
- [Search API Reference](https://docs.meilisearch.com/reference/api/search.html)
