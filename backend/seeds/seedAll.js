import dotenv from 'dotenv';
import connectDB from '../configs/database.js';
import seedBrands from './seedBrands.js';
import seedCategories from './seedCategories.js';
import seedUsers from './seedUsers.js';
import seedProducts from './seedProducts.js';
import seedOrders from './seedOrders.js';
import seedReviews from './seedReviews.js';

dotenv.config();

const seedAll = async () => {
  try {
    console.log('🌱 Bắt đầu seed tất cả dữ liệu...\n');

    await connectDB();

    // Seed in order (brands and categories first, then products)
    console.log('1️⃣  Seeding Brands...');
    await seedBrands();
    console.log('');

    console.log('2️⃣  Seeding Categories...');
    await seedCategories();
    console.log('');

    console.log('3️⃣  Seeding Users...');
    await seedUsers();
    console.log('');

    console.log('4️⃣  Seeding Products (with variants and images)...');
    await seedProducts();
    console.log('');

    console.log('5️⃣  Seeding Orders...');
    await seedOrders();
    console.log('');

    console.log('6️⃣  Seeding Reviews...');
    await seedReviews();
    console.log('');

    console.log('🎉 ĐÃ SEED TẤT CẢ DỮ LIỆU THÀNH CÔNG!');
    console.log('');
    console.log('📊 Tóm tắt:');
    console.log('   ✅ Brands: ~15 brands');
    console.log('   ✅ Categories: ~20 categories (parent + subcategories)');
    console.log('   ✅ Users: ~20 users');
    console.log('   ✅ Products: ~50 products');
    console.log('   ✅ Product Variants: ~150 variants');
    console.log('   ✅ Product Images: ~500 images');
    console.log('   ✅ Orders: ~30-50 orders');
    console.log('   ✅ Reviews: ~50-150 reviews');
    console.log('');
    console.log('ℹ️  Thông tin đăng nhập:');
    console.log('   - Email user: (xem trong database)');
    console.log('   - Password: password123');
    console.log('   - Email admin: admin@example.com (nếu đã seed)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error);
    process.exit(1);
  }
};

seedAll();
