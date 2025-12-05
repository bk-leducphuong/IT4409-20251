import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from '../configs/database.js';
import Review from '../models/review.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

dotenv.config();

// Vietnamese review templates for more realistic reviews
const reviewTemplates = {
  5: [
    'Sản phẩm tuyệt vời! Đáng đồng tiền bát gạo.',
    'Chất lượng xuất sắc, giao hàng nhanh chóng.',
    'Rất hài lòng với sản phẩm này. Hoàn hảo!',
    'Siêu phẩm! Mọi người nên mua ngay.',
    'Quá tuyệt vời! Vượt quá mong đợi của tôi.',
    'Sản phẩm chất lượng cao, giá cả hợp lý.',
    'Rất đáng mua! Tôi sẽ giới thiệu cho bạn bè.',
  ],
  4: [
    'Sản phẩm tốt, có một vài điểm nhỏ cần cải thiện.',
    'Khá hài lòng, đáng tiền.',
    'Chất lượng ổn, giao hàng nhanh.',
    'Tốt nhưng có thể tốt hơn nữa.',
    'Sản phẩm như mô tả, giao hàng đúng hẹn.',
  ],
  3: [
    'Sản phẩm tạm được, giá hơi cao so với chất lượng.',
    'Bình thường, không có gì đặc biệt.',
    'Chất lượng trung bình, cần cải thiện.',
    'Được cái giá tốt, nhưng chất lượng bình thường.',
  ],
  2: [
    'Không như mong đợi, chất lượng kém.',
    'Giao hàng chậm, sản phẩm không tốt lắm.',
    'Hơi thất vọng với chất lượng.',
    'Không đáng tiền, cần cải thiện nhiều.',
  ],
  1: [
    'Rất tệ! Không nên mua.',
    'Chất lượng kém, giao hàng lâu.',
    'Không giống hình, rất thất vọng.',
    'Tệ nhất từng mua. Không khuyến khích.',
  ],
};

const additionalComments = [
  'Đóng gói cẩn thận.',
  'Giao hàng nhanh.',
  'Bao bì đẹp.',
  'Sẽ ủng hộ shop lâu dài.',
  'Sản phẩm đúng như mô tả.',
  'Màu sắc đẹp.',
  'Thiết kế hiện đại.',
  'Pin trâu.',
  'Màn hình sắc nét.',
  'Âm thanh tốt.',
  'Hiệu năng mạnh mẽ.',
  'Giá hơi cao.',
  'Cần thêm phụ kiện kèm theo.',
];

const reviewTitles = {
  5: [
    'Tuyệt vời!',
    'Hoàn hảo',
    'Quá đỉnh!',
    'Siêu hài lòng',
    'Đáng tiền',
    'Chất lượng tốt',
    'Xuất sắc',
  ],
  4: ['Khá tốt', 'Hài lòng', 'Tốt', 'Ổn', 'Đáng mua'],
  3: ['Bình thường', 'Tạm được', 'OK', 'Ổn áp'],
  2: ['Không tốt lắm', 'Hơi thất vọng', 'Chưa ưng', 'Cần cải thiện'],
  1: ['Rất tệ', 'Thất vọng', 'Không nên mua', 'Kém'],
};

const seedReviews = async () => {
  try {
    await connectDB();

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu reviews cũ');

    // Get users (excluding admin)
    const users = await User.find({ role: { $ne: 'admin' }, deleted: false });
    if (users.length === 0) {
      console.log('⚠️  Không có user nào. Vui lòng seed users trước.');
      return;
    }

    // Get all products
    const products = await Product.find({});
    if (products.length === 0) {
      console.log('⚠️  Không có product nào. Vui lòng seed products trước.');
      return;
    }

    // Get delivered orders to identify verified purchases
    const deliveredOrders = await Order.find({ status: 'delivered' });

    const reviews = [];
    const reviewCount = faker.number.int({ min: 50, max: 150 });

    // Keep track of user-product combinations to avoid duplicates
    const reviewedPairs = new Set();

    for (let i = 0; i < reviewCount; i++) {
      const user = faker.helpers.arrayElement(users);
      const product = faker.helpers.arrayElement(products);

      // Create unique key for user-product pair
      const pairKey = `${user._id}-${product._id}`;

      // Skip if this user already reviewed this product
      if (reviewedPairs.has(pairKey)) {
        continue;
      }
      reviewedPairs.add(pairKey);

      // Determine rating with weighted distribution (more positive reviews)
      const ratingWeights = [
        { rating: 5, weight: 0.4 }, // 40%
        { rating: 4, weight: 0.3 }, // 30%
        { rating: 3, weight: 0.15 }, // 15%
        { rating: 2, weight: 0.1 }, // 10%
        { rating: 1, weight: 0.05 }, // 5%
      ];

      let rating = 5;
      const rand = Math.random();
      let cumulative = 0;
      for (const { rating: r, weight } of ratingWeights) {
        cumulative += weight;
        if (rand < cumulative) {
          rating = r;
          break;
        }
      }

      // Check if this is a verified purchase
      const hasOrder = deliveredOrders.some(
        (order) =>
          order.user_id.toString() === user._id.toString() &&
          order.items.some((item) => item.product_slug === product.slug),
      );

      // Generate review content
      const title = faker.helpers.arrayElement(reviewTitles[rating]);
      const baseComment = faker.helpers.arrayElement(reviewTemplates[rating]);

      // Add additional comments randomly
      const additionalCommentsCount = faker.number.int({ min: 0, max: 3 });
      const selectedAdditionalComments = faker.helpers
        .arrayElements(additionalComments, additionalCommentsCount)
        .join(' ');

      const comment = `${baseComment} ${selectedAdditionalComments}`.trim();

      // Add images to some reviews (30% chance for high ratings)
      const images = [];
      if (rating >= 4 && faker.datatype.boolean(0.3)) {
        const imageCount = faker.number.int({ min: 1, max: 3 });
        for (let j = 0; j < imageCount; j++) {
          images.push(faker.image.urlLoremFlickr({ category: 'tech', width: 600, height: 600 }));
        }
      }

      // Random helpful count (more for verified purchases and high ratings)
      const maxHelpfulCount = hasOrder && rating >= 4 ? 50 : 20;
      const helpful_count = faker.number.int({ min: 0, max: maxHelpfulCount });

      // Generate random helpful_users based on helpful_count
      const helpful_users = [];
      const availableUsers = users.filter((u) => u._id.toString() !== user._id.toString());
      if (helpful_count > 0 && availableUsers.length > 0) {
        const helpfulUserCount = Math.min(helpful_count, availableUsers.length);
        const selectedUsers = faker.helpers.arrayElements(availableUsers, helpfulUserCount);
        helpful_users.push(...selectedUsers.map((u) => u._id));
      }

      // Create review with random created date (last 3 months)
      const createdAt = faker.date.recent({ days: 90 });

      reviews.push({
        product_id: product._id,
        user_id: user._id,
        rating,
        title,
        comment,
        images,
        helpful_count,
        helpful_users,
        verified_purchase: hasOrder,
        deleted: false,
        createdAt,
        updatedAt: createdAt,
      });
    }

    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Đã seed ${createdReviews.length} reviews thành công!`);
    console.log('');
    console.log('📊 Thống kê reviews:');

    // Count by rating
    const ratingCounts = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    ratingCounts.forEach((stat) => {
      console.log(`   - ${stat._id} sao: ${stat.count} reviews`);
    });

    // Count verified purchases
    const verifiedCount = await Review.countDocuments({ verified_purchase: true });
    console.log(`   - Verified purchases: ${verifiedCount} reviews`);

    // Count reviews with images
    const withImagesCount = await Review.countDocuments({ images: { $ne: [], $exists: true } });
    console.log(`   - With images: ${withImagesCount} reviews`);

    // Average rating
    const avgRating = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    if (avgRating.length > 0) {
      console.log(`   - Average rating: ${avgRating[0].averageRating.toFixed(2)} sao`);
    }

    return createdReviews;
  } catch (error) {
    console.error('❌ Lỗi seed reviews:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedReviews()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedReviews;
