# Coupon/Discount System Documentation

## Overview

A comprehensive coupon and discount management system with support for percentage discounts, fixed amount discounts, and free shipping coupons.

## Features

✅ **Coupon Types:**
- Percentage discount (with optional maximum discount cap)
- Fixed amount discount
- Free shipping

✅ **Coupon Management:**
- Usage limits (total and per user)
- Expiration dates
- Minimum order value requirements
- Active/inactive status
- Usage tracking and statistics

✅ **User Features:**
- Apply/remove coupons from cart
- Real-time discount calculation
- Validation with clear error messages

✅ **Admin Features:**
- Create, read, update, delete coupons
- View coupon statistics
- Filter and search coupons
- Track usage across users

## API Endpoints

### User Routes

#### Apply Coupon to Cart
```http
POST /api/cart/apply-coupon
Authorization: Bearer {token}

Request Body:
{
  "code": "SUMMER2024"
}

Response:
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "coupon": {
      "code": "SUMMER2024",
      "description": "Summer sale - 20% off all items",
      "discount_type": "percentage",
      "discount_value": 20,
      "discount_amount": 100000
    },
    "cart": {
      "_id": "...",
      "items": [...],
      "applied_coupon": {...},
      "subtotal": 500000,
      "discount": 100000,
      "shipping_fee": 30000,
      "total": 430000
    }
  }
}
```

#### Remove Coupon from Cart
```http
DELETE /api/cart/remove-coupon
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Coupon removed successfully",
  "data": {
    "cart": {...}
  }
}
```

### Admin Routes

#### Create Coupon
```http
POST /api/admin/coupons
Authorization: Bearer {admin_token}

Request Body:
{
  "code": "NEWYEAR2025",
  "description": "New Year Sale - 25% off",
  "discount_type": "percentage",
  "discount_value": 25,
  "max_discount_amount": 150000,
  "min_order_value": 500000,
  "usage_limit": 500,
  "usage_limit_per_user": 1,
  "is_active": true,
  "valid_from": "2025-01-01T00:00:00.000Z",
  "valid_until": "2025-01-31T23:59:59.000Z"
}

Response:
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "coupon": {...}
  }
}
```

#### Get All Coupons (with filters)
```http
GET /api/admin/coupons?page=1&limit=20&is_active=true&discount_type=percentage&search=summer
Authorization: Bearer {admin_token}

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 20)
- is_active: Filter by active status (true/false)
- discount_type: Filter by type (percentage/fixed_amount/free_shipping)
- search: Search by code or description
- sort: Sort order (default: -createdAt)

Response:
{
  "success": true,
  "data": {
    "coupons": [...],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  }
}
```

#### Get Coupon by ID
```http
GET /api/admin/coupons/:id
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "data": {
    "coupon": {...}
  }
}
```

#### Get Coupon Statistics
```http
GET /api/admin/coupons/:id/stats
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "data": {
    "stats": {
      "code": "SUMMER2024",
      "total_usage": 245,
      "unique_users": 198,
      "usage_limit": 1000,
      "usage_remaining": 755,
      "is_active": true,
      "is_expired": false,
      "is_valid": true,
      "valid_from": "2024-06-01T00:00:00.000Z",
      "valid_until": "2024-08-31T23:59:59.000Z",
      "discount_type": "percentage",
      "discount_value": 20,
      "min_order_value": 500000
    }
  }
}
```

#### Update Coupon
```http
PUT /api/admin/coupons/:id
Authorization: Bearer {admin_token}

Request Body (partial update):
{
  "is_active": false,
  "usage_limit": 1500
}

Response:
{
  "success": true,
  "message": "Coupon updated successfully",
  "data": {
    "coupon": {...}
  }
}
```

#### Delete Coupon
```http
DELETE /api/admin/coupons/:id
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

## Coupon Types

### 1. Percentage Discount
Applies a percentage discount to the cart subtotal.

**Fields:**
- `discount_value`: Percentage (0-100)
- `max_discount_amount`: Optional maximum discount cap

**Example:**
```json
{
  "discount_type": "percentage",
  "discount_value": 20,
  "max_discount_amount": 100000
}
```

If cart subtotal is 600,000 VND:
- 20% discount = 120,000 VND
- Capped at 100,000 VND
- **Final discount: 100,000 VND**

### 2. Fixed Amount Discount
Applies a fixed amount discount to the cart subtotal.

**Fields:**
- `discount_value`: Amount in VND

**Example:**
```json
{
  "discount_type": "fixed_amount",
  "discount_value": 50000
}
```

**Discount: 50,000 VND** (regardless of cart total)

### 3. Free Shipping
Removes shipping fees from the order.

**Fields:**
- `discount_value`: Not used (set to 0)

**Example:**
```json
{
  "discount_type": "free_shipping",
  "discount_value": 0
}
```

**Discount: Equal to shipping fee** (e.g., 30,000 VND)

## Validation Rules

### Coupon Validity
A coupon is valid when ALL conditions are met:
- ✅ `is_active` is `true`
- ✅ Current date is between `valid_from` and `valid_until`
- ✅ `usage_limit` not exceeded (if set)
- ✅ User hasn't exceeded `usage_limit_per_user`
- ✅ Cart subtotal meets `min_order_value` requirement

### Error Messages
- **"Invalid coupon code"** - Coupon doesn't exist
- **"This coupon has expired"** - Current date > valid_until
- **"This coupon is no longer active"** - is_active = false
- **"This coupon has reached its usage limit"** - Total usage limit exceeded
- **"You have already used this coupon the maximum number of times"** - User limit exceeded
- **"Minimum order value of X VND is required to use this coupon"** - Cart subtotal < min_order_value

## Usage Flow

### 1. User Applies Coupon
```
User → POST /api/cart/apply-coupon → Validation → Calculate Discount → Save to Cart
```

1. User enters coupon code
2. System validates coupon (expiry, limits, etc.)
3. Checks if cart meets minimum order value
4. Calculates discount amount
5. Saves applied coupon to cart (not recorded in usage yet)
6. Returns updated cart with discount

### 2. User Completes Order
```
User → POST /api/orders → Record Coupon Usage → Clear Cart → Create Order
```

1. Order is created with coupon information snapshot
2. Coupon usage is recorded (increment counters)
3. Cart is cleared including applied coupon
4. Order includes discount in total calculation

### 3. User Cancels Order
```
User → DELETE /api/orders/:id/cancel → Restore Coupon Usage → Update Order
```

1. Order status changed to "cancelled"
2. Stock quantities restored
3. **Coupon usage decremented** (user can use it again)

## Database Schema

### Coupon Model
```javascript
{
  code: String,              // Unique, uppercase (e.g., "SUMMER2024")
  description: String,       // Human-readable description
  discount_type: String,     // "percentage" | "fixed_amount" | "free_shipping"
  discount_value: Number,    // Percentage (0-100) or amount in VND
  max_discount_amount: Number, // Optional cap for percentage discounts
  min_order_value: Number,   // Minimum cart subtotal required
  usage_limit: Number,       // Total usage limit (null = unlimited)
  usage_limit_per_user: Number, // Per-user limit (default: 1)
  usage_count: Number,       // Current total usage count
  used_by: [{                // Track user usage
    user_id: ObjectId,
    usage_count: Number,
    last_used_at: Date
  }],
  is_active: Boolean,        // Active status
  valid_from: Date,          // Start date
  valid_until: Date,         // Expiration date
  created_by: ObjectId,      // Admin who created it
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model (Updated)
```javascript
{
  user_id: ObjectId,
  items: [{
    product_variant_id: ObjectId,
    quantity: Number
  }],
  applied_coupon: {          // Applied coupon (not yet used)
    coupon_id: ObjectId,
    code: String,
    discount_type: String,
    discount_value: Number,
    discount_amount: Number  // Calculated discount
  }
}
```

### Order Model (Updated)
```javascript
{
  // ... existing fields
  discount: Number,          // Total discount amount
  coupon: {                  // Coupon snapshot (if used)
    coupon_id: ObjectId,
    code: String,
    discount_type: String,
    discount_value: Number,
    discount_amount: Number
  },
  total: Number              // subtotal + tax + shipping - discount
}
```

## Seeding Data

### Seed Coupons Only
```bash
node seeds/seedCoupons.js
```

### Seed All Data (including coupons)
```bash
node seeds/seedAll.js
```

### Sample Coupons Created
| Code | Type | Value | Min Order | Limit | Status |
|------|------|-------|-----------|-------|--------|
| WELCOME10 | Percentage | 10% (max 50k) | 0 | Unlimited | Active |
| SUMMER2024 | Percentage | 20% (max 100k) | 500k | 1000 | Active |
| SAVE50K | Fixed | 50,000 VND | 300k | 500 | Active |
| FREESHIP | Free Shipping | - | 200k | Unlimited | Active |
| MEGA50 | Percentage | 50% (max 200k) | 1M | 100 | Active |
| VIP100K | Fixed | 100,000 VND | 1.5M | 50 | Active |

## Testing

### Test Scenarios

#### 1. Apply Valid Coupon
```bash
# Login as user
POST /api/auth/login
# Add items to cart
POST /api/cart/items
# Apply coupon
POST /api/cart/apply-coupon
Body: { "code": "WELCOME10" }
```

#### 2. Apply Expired Coupon
```bash
POST /api/cart/apply-coupon
Body: { "code": "EXPIRED" }
# Expected: Error "This coupon has expired"
```

#### 3. Apply Coupon with Insufficient Order Value
```bash
# Cart subtotal: 100,000 VND
POST /api/cart/apply-coupon
Body: { "code": "SUMMER2024" }  # Requires min 500,000 VND
# Expected: Error about minimum order value
```

#### 4. Apply Coupon After Usage Limit
```bash
# Use coupon and complete order
POST /api/orders
# Try to use same coupon again (if usage_limit_per_user = 1)
POST /api/cart/apply-coupon
Body: { "code": "WELCOME10" }
# Expected: Error about usage limit
```

#### 5. Remove Coupon
```bash
DELETE /api/cart/remove-coupon
# Expected: Coupon removed, discount cleared
```

## Best Practices

### For Admins

1. **Set Realistic Limits**
   - Use `usage_limit` to control budget
   - Set `usage_limit_per_user` to prevent abuse
   - Use `max_discount_amount` for percentage discounts

2. **Use Clear Codes**
   - Make codes memorable and relevant
   - Use uppercase for consistency
   - Examples: SUMMER2024, FREESHIP, SAVE50K

3. **Set Appropriate Dates**
   - `valid_from` should be in the future or now
   - `valid_until` should be after `valid_from`
   - Consider timezone (currently using server timezone)

4. **Monitor Usage**
   - Check coupon statistics regularly
   - Deactivate coupons that are being abused
   - Track which coupons are most effective

### For Developers

1. **Always Validate**
   - Validate coupon on application AND checkout
   - Coupon might expire between application and checkout

2. **Use Snapshots**
   - Store coupon data in orders (not just reference)
   - Allows order history even if coupon is deleted

3. **Handle Edge Cases**
   - Cart total might decrease below min_order_value
   - Coupon might be deactivated after application
   - User might reach usage limit between apply and checkout

4. **Restore on Cancellation**
   - Always decrement usage when order is cancelled/refunded
   - Allows fair reuse of limited coupons

## Security Considerations

1. **Admin Only Creation**
   - Only authenticated admins can create/modify coupons
   - Enforced by `requireAdmin` middleware

2. **Rate Limiting**
   - Consider adding rate limiting to prevent brute-force attempts

3. **Code Generation**
   - Use unpredictable codes for high-value coupons
   - Avoid sequential patterns (e.g., COUPON001, COUPON002)

4. **Audit Trail**
   - Track who created each coupon (`created_by`)
   - Monitor usage patterns for suspicious activity

## Troubleshooting

### Coupon Not Applying
- Check if coupon is active (`is_active: true`)
- Verify current date is within valid range
- Ensure cart meets minimum order value
- Check if user has exceeded usage limit

### Discount Amount Wrong
- Verify discount_type matches expected calculation
- Check if max_discount_amount is capping the discount
- Ensure cart subtotal is calculated correctly
- For free_shipping, verify shipping fee is set

### Usage Count Not Updating
- Usage is only recorded when order is created
- Applying coupon to cart does NOT increment usage
- Check if order was successfully created

### Coupon Still Valid After Expiration
- Verify system time is correct
- Check `valid_until` date format
- Ensure coupon validation is running on each request

## Future Enhancements

Potential features to add:

- [ ] Coupon categories/tags
- [ ] Product-specific coupons (only for certain products)
- [ ] User-specific coupons (only for certain users/groups)
- [ ] Stackable coupons (apply multiple at once)
- [ ] Auto-apply coupons (best coupon automatically applied)
- [ ] Coupon redemption via email/SMS
- [ ] A/B testing for coupon effectiveness
- [ ] Scheduled activation/deactivation
- [ ] Coupon templates for quick creation
- [ ] Analytics dashboard for coupon performance

## Support

For issues or questions:
- Check error messages in API responses
- Review validation rules above
- Check server logs for detailed errors
- Verify database coupon records directly if needed
