# Admin Dashboard Analytics Feature

## Overview
This feature provides comprehensive analytics for the admin dashboard, including sales statistics, revenue reports, popular products, user statistics, and order analytics.

## API Endpoints

### 1. GET /api/admin/dashboard/stats
Get comprehensive dashboard statistics including revenue, orders, users, and products.

**Authentication:** Required (Bearer Token)  
**Role:** Admin

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string (ISO 8601) | No | Start date for filtering |
| endDate | string (ISO 8601) | No | End date for filtering |

#### Example Request
```bash
GET /api/admin/dashboard/stats?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 15000000,
      "orders_count": 150,
      "average_order_value": 100000
    },
    "orders": {
      "total": 200,
      "by_status": [
        {
          "status": "delivered",
          "count": 100,
          "total_amount": 10000000
        },
        {
          "status": "pending",
          "count": 25,
          "total_amount": 2500000
        }
      ],
      "pending": 25,
      "recent_7_days": 45
    },
    "users": {
      "total": 500,
      "active_customers": 450,
      "new_this_month": 50
    },
    "products": {
      "total_products": 100,
      "total_variants": 250,
      "low_stock": 15,
      "out_of_stock": 5
    }
  }
}
```

---

### 2. GET /api/admin/dashboard/sales
Get detailed sales analytics with time-based grouping (daily, weekly, or monthly).

**Authentication:** Required (Bearer Token)  
**Role:** Admin

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | string (ISO 8601) | No | 30 days ago | Start date for filtering |
| endDate | string (ISO 8601) | No | Today | End date for filtering |
| groupBy | string | No | daily | Grouping period: `daily`, `weekly`, `monthly` |

#### Example Request
```bash
GET /api/admin/dashboard/sales?startDate=2024-11-01&endDate=2024-12-01&groupBy=daily
Authorization: Bearer <token>
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-11-01T00:00:00.000Z",
      "end": "2024-12-01T23:59:59.999Z",
      "groupBy": "daily"
    },
    "summary": {
      "total_sales": 10000000,
      "total_orders": 100,
      "total_items_sold": 250,
      "average_order_value": 100000
    },
    "sales_data": [
      {
        "date": {
          "year": 2024,
          "month": 11,
          "day": 1
        },
        "total_sales": 500000,
        "order_count": 5,
        "average_order_value": 100000,
        "total_items_sold": 12
      }
    ],
    "payment_methods": [
      {
        "method": "cod",
        "count": 60,
        "total_amount": 6000000
      },
      {
        "method": "credit_card",
        "count": 40,
        "total_amount": 4000000
      }
    ]
  }
}
```

---

### 3. GET /api/admin/dashboard/top-products
Get top-selling products with detailed sales metrics.

**Authentication:** Required (Bearer Token)  
**Role:** Admin

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | string (ISO 8601) | No | All time | Start date for filtering |
| endDate | string (ISO 8601) | No | All time | End date for filtering |
| limit | integer | No | 10 | Number of products to return (1-100) |
| sortBy | string | No | revenue | Sort by: `revenue` or `quantity` |

#### Example Request
```bash
GET /api/admin/dashboard/top-products?limit=10&sortBy=revenue
Authorization: Bearer <token>
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "top_products": [
      {
        "product_id": "507f1f77bcf86cd799439011",
        "product_slug": "macbook-pro-14",
        "product_name": "MacBook Pro 14-inch",
        "category": "Laptops",
        "brand": "Apple",
        "total_quantity_sold": 50,
        "total_revenue": 5000000,
        "order_count": 45,
        "average_price": 100000,
        "image_url": "https://example.com/image.jpg"
      }
    ],
    "top_variants": [
      {
        "variant_id": "507f1f77bcf86cd799439012",
        "product_name": "MacBook Pro 14-inch",
        "sku": "MBP14-16-512-SLV",
        "attributes": {
          "RAM": "16GB",
          "Storage": "512GB SSD",
          "Color": "Silver"
        },
        "total_quantity_sold": 25,
        "total_revenue": 2500000,
        "image_url": "https://example.com/image.jpg"
      }
    ]
  }
}
```

---

## Features

### Sales Statistics
- Total revenue from completed orders
- Total number of orders
- Average order value
- Revenue breakdown by order status

### Revenue Reports
- Time-based sales analytics (daily, weekly, monthly)
- Sales trends over custom date ranges
- Payment method breakdown
- Total items sold

### Popular Products
- Top-selling products by revenue or quantity
- Product-level and variant-level analytics
- Includes category and brand information
- Display images for better visualization

### User Statistics
- Total registered users
- Active customers count
- New users this month

### Order Analytics
- Orders by status breakdown
- Recent orders (last 7 days)
- Pending orders requiring attention
- Revenue per status

### Product Inventory Insights
- Total products and variants
- Low stock alerts (< 10 units)
- Out of stock items

---

## Technical Implementation

### Files Created
1. **services/admin.dashboard.service.js** - Business logic for analytics
2. **controllers/admin.dashboard.controller.js** - Request handlers
3. **routes/admin.dashboard.route.js** - API route definitions

### Files Modified
1. **server.js** - Registered dashboard routes

### Dependencies
- Uses existing models: Order, User, Product, ProductVariant
- Leverages MongoDB aggregation framework for efficient queries
- Follows existing authentication and error handling patterns

---

## Usage Examples

### Using cURL

#### Get Dashboard Stats
```bash
curl -X GET "http://localhost:5001/api/admin/dashboard/stats" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Sales Analytics (Last 7 days, Daily)
```bash
curl -X GET "http://localhost:5001/api/admin/dashboard/sales?groupBy=daily" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Top 20 Products by Quantity
```bash
curl -X GET "http://localhost:5001/api/admin/dashboard/top-products?limit=20&sortBy=quantity" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript/Fetch
```javascript
const token = 'YOUR_TOKEN_HERE';

// Get dashboard stats
const stats = await fetch('http://localhost:5001/api/admin/dashboard/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json());

// Get monthly sales for 2024
const sales = await fetch('http://localhost:5001/api/admin/dashboard/sales?startDate=2024-01-01&endDate=2024-12-31&groupBy=monthly', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json());

// Get top 5 products
const topProducts = await fetch('http://localhost:5001/api/admin/dashboard/top-products?limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json());
```

---

## Performance Considerations

1. **Aggregation Pipeline**: Uses MongoDB aggregation for efficient data processing
2. **Indexing**: Leverages existing indexes on Order.createdAt and Order.status
3. **Date Filtering**: Optimized queries with date range filters
4. **Result Limiting**: Top products query limited to prevent large result sets

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (admin access required)
- `500` - Internal Server Error

---

## Testing

To test the endpoints, you'll need:
1. A valid admin user account
2. Authentication token (obtained from login)
3. Sample data in the database (orders, products, users)

You can use the seeding scripts if needed:
```bash
npm run seed
```

---

## Future Enhancements

Potential improvements:
1. Export data to CSV/Excel
2. Real-time dashboard updates (WebSocket)
3. Custom date range presets (Today, This Week, This Month, etc.)
4. Revenue forecasting based on historical data
5. Customer segmentation analytics
6. Product performance by category/brand
7. Geographical sales distribution
8. Cohort analysis for user retention
