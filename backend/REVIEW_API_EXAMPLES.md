# Review System API Examples

This document provides practical examples of how to use the Review and Rating System API endpoints.

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Examples

### 1. Get Product Reviews

**Basic Request:**
```bash
curl -X GET "http://localhost:5001/api/products/laptop-dell-xps-15/reviews"
```

**With Filters:**
```bash
# Get only 5-star verified reviews, sorted by most helpful
curl -X GET "http://localhost:5001/api/products/laptop-dell-xps-15/reviews?rating=5&verified_only=true&sort_by=helpful&page=1&limit=10"
```

**JavaScript/Fetch Example:**
```javascript
const response = await fetch(
  'http://localhost:5001/api/products/laptop-dell-xps-15/reviews?rating=5&sort_by=helpful',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

const data = await response.json();
console.log('Reviews:', data.data.reviews);
console.log('Statistics:', data.data.statistics);
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "674f8d1e2c3d4e5f6a7b8c9d",
        "product_id": "674f8d1e2c3d4e5f6a7b8c9e",
        "user_id": {
          "_id": "674f8d1e2c3d4e5f6a7b8c9f",
          "fullName": "Nguyễn Văn A",
          "avatar": "https://example.com/avatar.jpg"
        },
        "rating": 5,
        "title": "Tuyệt vời!",
        "comment": "Sản phẩm chất lượng cao, giao hàng nhanh chóng.",
        "images": [
          "https://example.com/review-image1.jpg"
        ],
        "helpful_count": 15,
        "verified_purchase": true,
        "createdAt": "2024-11-20T10:30:00.000Z",
        "updatedAt": "2024-11-20T10:30:00.000Z"
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

---

### 2. Add a Review

**Basic Request:**
```bash
curl -X POST "http://localhost:5001/api/products/laptop-dell-xps-15/reviews" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Tuyệt vời!",
    "comment": "Sản phẩm rất tốt, đáng tiền bát gạo. Giao hàng nhanh, đóng gói cẩn thận.",
    "images": [
      "https://example.com/my-review-image1.jpg",
      "https://example.com/my-review-image2.jpg"
    ]
  }'
```

**JavaScript/Fetch Example:**
```javascript
const token = 'YOUR_JWT_TOKEN';

const reviewData = {
  rating: 5,
  title: 'Tuyệt vời!',
  comment: 'Sản phẩm rất tốt, đáng tiền bát gạo.',
  images: [
    'https://example.com/review-image1.jpg',
    'https://example.com/review-image2.jpg'
  ]
};

const response = await fetch(
  'http://localhost:5001/api/products/laptop-dell-xps-15/reviews',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData)
  }
);

const data = await response.json();
if (data.success) {
  console.log('Review created successfully:', data.data.review);
} else {
  console.error('Error:', data.message);
}
```

**React Example:**
```javascript
import { useState } from 'react';

function AddReviewForm({ productSlug, token }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(
      `http://localhost:5001/api/products/${productSlug}/reviews`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, title, comment, images })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      alert('Review added successfully!');
      // Reset form or redirect
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        <option value={5}>5 ⭐</option>
        <option value={4}>4 ⭐</option>
        <option value={3}>3 ⭐</option>
        <option value={2}>2 ⭐</option>
        <option value={1}>1 ⭐</option>
      </select>
      
      <input
        type="text"
        placeholder="Review title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
      />
      
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={2000}
        required
      />
      
      <button type="submit">Submit Review</button>
    </form>
  );
}
```

---

### 3. Update a Review

**Request:**
```bash
curl -X PUT "http://localhost:5001/api/reviews/674f8d1e2c3d4e5f6a7b8c9d" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "title": "Cập nhật đánh giá",
    "comment": "Sau khi dùng một thời gian thì vẫn tốt nhưng có vài điểm nhỏ cần cải thiện."
  }'
```

**JavaScript/Fetch Example:**
```javascript
const reviewId = '674f8d1e2c3d4e5f6a7b8c9d';
const token = 'YOUR_JWT_TOKEN';

const updateData = {
  rating: 4,
  comment: 'Cập nhật: Sản phẩm vẫn tốt sau 1 tháng sử dụng'
};

const response = await fetch(
  `http://localhost:5001/api/reviews/${reviewId}`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  }
);

const data = await response.json();
console.log('Updated review:', data.data.review);
```

---

### 4. Delete a Review

**Request:**
```bash
curl -X DELETE "http://localhost:5001/api/reviews/674f8d1e2c3d4e5f6a7b8c9d" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript/Fetch Example:**
```javascript
const reviewId = '674f8d1e2c3d4e5f6a7b8c9d';
const token = 'YOUR_JWT_TOKEN';

const response = await fetch(
  `http://localhost:5001/api/reviews/${reviewId}`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }
);

const data = await response.json();
if (data.success) {
  console.log('Review deleted successfully');
}
```

---

### 5. Mark Review as Helpful

**Request:**
```bash
curl -X POST "http://localhost:5001/api/reviews/674f8d1e2c3d4e5f6a7b8c9d/helpful" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript/Fetch Example:**
```javascript
const reviewId = '674f8d1e2c3d4e5f6a7b8c9d';
const token = 'YOUR_JWT_TOKEN';

const response = await fetch(
  `http://localhost:5001/api/reviews/${reviewId}/helpful`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }
);

const data = await response.json();
console.log('Helpful count:', data.data.helpful_count);
console.log('Is marked helpful:', data.data.is_helpful);
```

**React Component Example:**
```javascript
import { useState } from 'react';

function HelpfulButton({ reviewId, initialCount, token }) {
  const [helpfulCount, setHelpfulCount] = useState(initialCount);
  const [isHelpful, setIsHelpful] = useState(false);

  const handleClick = async () => {
    const response = await fetch(
      `http://localhost:5001/api/reviews/${reviewId}/helpful`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    const data = await response.json();
    if (data.success) {
      setHelpfulCount(data.data.helpful_count);
      setIsHelpful(data.data.is_helpful);
    }
  };

  return (
    <button onClick={handleClick}>
      {isHelpful ? '✓ Helpful' : 'Mark as Helpful'} ({helpfulCount})
    </button>
  );
}
```

---

## Complete React Component Example

Here's a complete example of a product review section in React:

```javascript
import React, { useState, useEffect } from 'react';

function ProductReviews({ productSlug, token }) {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    rating: '',
    sortBy: 'newest',
    page: 1
  });

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      sort_by: filter.sortBy,
      page: filter.page,
      ...(filter.rating && { rating: filter.rating })
    });

    const response = await fetch(
      `http://localhost:5001/api/products/${productSlug}/reviews?${params}`
    );

    const data = await response.json();
    if (data.success) {
      setReviews(data.data.reviews);
      setStatistics(data.data.statistics);
    }
    setLoading(false);
  };

  const handleMarkHelpful = async (reviewId) => {
    const response = await fetch(
      `http://localhost:5001/api/reviews/${reviewId}/helpful`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    const data = await response.json();
    if (data.success) {
      // Refresh reviews
      fetchReviews();
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="product-reviews">
      <div className="review-statistics">
        <h3>Customer Reviews</h3>
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{statistics.averageRating}</span>
            <span className="stars">⭐</span>
          </div>
          <div className="total-reviews">
            {statistics.totalReviews} reviews
          </div>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="rating-bar">
              <span>{star} ⭐</span>
              <div className="bar">
                <div 
                  className="fill" 
                  style={{ 
                    width: `${(statistics.ratingDistribution[star] / statistics.totalReviews) * 100}%` 
                  }}
                />
              </div>
              <span>{statistics.ratingDistribution[star]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="review-filters">
        <select 
          value={filter.rating} 
          onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select 
          value={filter.sortBy} 
          onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
        >
          <option value="newest">Newest First</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating_high">Highest Rating</option>
          <option value="rating_low">Lowest Rating</option>
        </select>
      </div>

      <div className="review-list">
        {reviews.map(review => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <img src={review.user_id.avatar} alt="avatar" />
              <div>
                <strong>{review.user_id.fullName}</strong>
                {review.verified_purchase && (
                  <span className="verified-badge">✓ Verified Purchase</span>
                )}
              </div>
              <div className="rating">{'⭐'.repeat(review.rating)}</div>
            </div>

            <h4>{review.title}</h4>
            <p>{review.comment}</p>

            {review.images.length > 0 && (
              <div className="review-images">
                {review.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Review" />
                ))}
              </div>
            )}

            <div className="review-footer">
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              <button onClick={() => handleMarkHelpful(review._id)}>
                👍 Helpful ({review.helpful_count})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
```

---

## Error Handling

Always handle errors appropriately:

```javascript
async function makeReviewRequest(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Review API Error:', error.message);
    throw error;
  }
}

// Usage
try {
  const data = await makeReviewRequest(
    'http://localhost:5001/api/products/laptop-dell-xps-15/reviews',
    { method: 'GET' }
  );
  console.log('Reviews:', data.data.reviews);
} catch (error) {
  // Handle error in UI
  alert(`Error: ${error.message}`);
}
```

## Testing the API

You can test the API using:
1. **Swagger UI**: http://localhost:5001/api-docs
2. **Postman**: Import the endpoints
3. **curl**: Use the examples above
4. **Your frontend application**: Integrate with React/Vue/Angular

## Notes

- All POST/PUT/DELETE operations require authentication
- Review images should be uploaded to a storage service first, then provide URLs
- The `verified_purchase` badge is automatically determined by the system
- Users can only review a product once
- Users can only edit/delete their own reviews
- The helpful marking feature uses toggle behavior (clicking again will unmark)
