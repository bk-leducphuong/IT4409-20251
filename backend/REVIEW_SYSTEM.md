# Review and Rating System Documentation

## Overview
This document describes the implementation of the review and rating system for the e-commerce backend.

## Features
- ⭐ 5-star rating system
- 📝 Review title and comment
- 🖼️ Support for up to 5 images per review
- ✅ Verified purchase badges
- 👍 Helpful review marking
- 📊 Rating statistics and distribution
- 🔒 User ownership validation
- 🗑️ Soft delete for reviews

## API Endpoints

### 1. Get Product Reviews
**Endpoint:** `GET /api/products/:slug/reviews`

**Description:** Retrieve all reviews for a specific product with filtering and pagination.

**Parameters:**
- `slug` (path) - Product slug (required)
- `rating` (query) - Filter by rating (1-5)
- `verified_only` (query) - Show only verified purchases (boolean)
- `sort_by` (query) - Sort order: `newest`, `helpful`, `rating_high`, `rating_low` (default: `newest`)
- `page` (query) - Page number (default: 1)
- `limit` (query) - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "review_id",
        "user_id": {
          "fullName": "John Doe",
          "avatar": "avatar_url"
        },
        "rating": 5,
        "title": "Tuyệt vời!",
        "comment": "Sản phẩm rất tốt. Đóng gói cẩn thận.",
        "images": ["image1_url", "image2_url"],
        "helpful_count": 10,
        "verified_purchase": true,
        "createdAt": "2024-12-04T10:00:00.000Z",
        "updatedAt": "2024-12-04T10:00:00.000Z"
      }
    ],
    "statistics": {
      "averageRating": 4.5,
      "totalReviews": 100,
      "ratingDistribution": {
        "5": 50,
        "4": 30,
        "3": 10,
        "2": 7,
        "1": 3
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  }
}
```

### 2. Add Review
**Endpoint:** `POST /api/products/:slug/reviews`

**Authentication:** Required (Bearer token)

**Description:** Add a new review for a product. Users can only review a product once.

**Parameters:**
- `slug` (path) - Product slug (required)

**Request Body:**
```json
{
  "rating": 5,
  "title": "Tuyệt vời!",
  "comment": "Sản phẩm rất tốt. Đóng gói cẩn thận.",
  "images": ["image1_url", "image2_url"]
}
```

**Validation:**
- `rating`: Required, must be 1-5
- `comment`: Required, max 2000 characters
- `title`: Optional, max 200 characters
- `images`: Optional, max 5 images

**Response (201):**
```json
{
  "success": true,
  "message": "Đã thêm đánh giá thành công",
  "data": {
    "review": {
      "_id": "review_id",
      "product_id": "product_id",
      "user_id": {
        "_id": "user_id",
        "fullName": "John Doe",
        "avatar": "avatar_url"
      },
      "rating": 5,
      "title": "Tuyệt vời!",
      "comment": "Sản phẩm rất tốt. Đóng gói cẩn thận.",
      "images": ["image1_url", "image2_url"],
      "helpful_count": 0,
      "verified_purchase": true,
      "createdAt": "2024-12-04T10:00:00.000Z",
      "updatedAt": "2024-12-04T10:00:00.000Z"
    }
  }
}
```

### 3. Update Review
**Endpoint:** `PUT /api/reviews/:id`

**Authentication:** Required (Bearer token)

**Description:** Update an existing review. Only the review owner can update it.

**Parameters:**
- `id` (path) - Review ID (required)

**Request Body:**
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment",
  "images": ["new_image_url"]
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response (200):**
```json
{
  "success": true,
  "message": "Đã cập nhật đánh giá thành công",
  "data": {
    "review": {
      // Updated review object
    }
  }
}
```

### 4. Delete Review
**Endpoint:** `DELETE /api/reviews/:id`

**Authentication:** Required (Bearer token)

**Description:** Delete a review (soft delete). Only the review owner can delete it.

**Parameters:**
- `id` (path) - Review ID (required)

**Response (200):**
```json
{
  "success": true,
  "message": "Đã xóa đánh giá thành công"
}
```

### 5. Mark Review as Helpful
**Endpoint:** `POST /api/reviews/:id/helpful`

**Authentication:** Required (Bearer token)

**Description:** Mark a review as helpful or unmark it (toggle behavior).

**Parameters:**
- `id` (path) - Review ID (required)

**Response (200):**
```json
{
  "success": true,
  "message": "Đã đánh dấu hữu ích",
  "data": {
    "helpful_count": 11,
    "is_helpful": true
  }
}
```

## Database Schema

### Review Model
```javascript
{
  product_id: ObjectId,           // Reference to Product
  user_id: ObjectId,              // Reference to User
  rating: Number,                 // 1-5
  title: String,                  // Max 200 chars
  comment: String,                // Max 2000 chars, required
  images: [String],               // Max 5 images
  helpful_count: Number,          // Count of helpful marks
  helpful_users: [ObjectId],      // Users who marked helpful
  verified_purchase: Boolean,     // Auto-detected from orders
  deleted: Boolean,               // Soft delete flag
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Compound unique index: `product_id + user_id` (prevents duplicate reviews)
- Index: `product_id + rating`
- Index: `product_id + verified_purchase`

## Business Logic

### Verified Purchase Detection
The system automatically checks if the user has a delivered order containing the product:
- Queries the `orders` collection
- Checks for orders with status `delivered`
- Verifies if the order contains the product being reviewed
- Sets `verified_purchase: true` if found

### Helpful Marking
- Users can mark any review as helpful
- Toggle behavior: marking again will unmark
- Users tracked in `helpful_users` array to prevent duplicates
- `helpful_count` automatically updated

### Review Statistics
Calculated in real-time for each product:
- Average rating (1 decimal place)
- Total review count
- Rating distribution (count per star level)

### Duplicate Prevention
- Compound unique index on `(product_id, user_id)`
- Service layer validation before insert
- Returns appropriate error message if duplicate

## Seeding Data

### Run Review Seed
```bash
npm run seed:reviews
```

### Run All Seeds (including reviews)
```bash
npm run seed:all
```

### Seed Features
- Generates 50-150 realistic Vietnamese reviews
- Weighted rating distribution (more 4-5 star reviews)
- Automatic verified purchase detection
- Random images for high-rated reviews
- Random helpful counts
- Created dates within last 3 months

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
The review system includes comprehensive unit tests for:
- Getting product reviews with filters
- Adding reviews with validation
- Updating reviews with ownership check
- Deleting reviews with ownership check
- Marking reviews as helpful
- Error handling scenarios

### Test File
Location: `controllers/__test__/review.controller.test.js`

## Error Handling

### Common Errors

**400 Bad Request:**
- Missing required fields (rating, comment)
- Invalid rating (not 1-5)
- User already reviewed this product

**403 Forbidden:**
- Attempting to update/delete someone else's review
- Review not found

**404 Not Found:**
- Product not found
- Review not found (for helpful marking)

**500 Internal Server Error:**
- Database errors
- Unexpected server errors

## Security Considerations

1. **Authentication Required:** All write operations require authentication
2. **Ownership Validation:** Users can only edit/delete their own reviews
3. **Input Validation:** All inputs validated for type and length
4. **Soft Delete:** Reviews are soft-deleted, not permanently removed
5. **Rate Limiting:** Consider adding rate limiting for review creation

## Future Enhancements

Potential improvements:
- Admin moderation endpoints
- Review flagging/reporting
- Review responses from sellers
- Review editing history
- Email notifications for new reviews
- Review media upload to cloud storage
- Machine learning for review sentiment analysis
- Review sorting by relevance

## API Documentation

The full API documentation is available via Swagger UI:
```
http://localhost:5001/api-docs
```

Navigate to the "Reviews" section to see interactive API documentation and try out the endpoints.
