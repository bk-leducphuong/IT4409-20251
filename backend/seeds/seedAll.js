import dotenv from 'dotenv';
import connectDB from '../configs/database.js';
import seedBrands from './seedBrands.js';
import seedCategories from './seedCategories.js';
import seedUsers from './seedUsers.js';
import seedProducts from './seedProducts.js';
import seedOrders from './seedOrders.js';
import seedReviews from './seedReviews.js';
import mongoose from 'mongoose';
import Address from '../models/address.js';
import Coupon from '../models/coupon.js';

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

    console.log('7️⃣  Seeding Addresses...');
    await seedAddresses();
    console.log('');

    console.log('8️⃣  Seeding Coupons...');
    await seedCoupons();
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
    console.log('   ✅ Addresses: ~10-15 addresses');
    console.log('   ✅ Coupons: ~8 coupons');
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

// Seed addresses function
const seedAddresses = async () => {
  try {
    const User = mongoose.model('User');

    // Get some users from database
    const users = await User.find({ deleted: false, role: 'customer' }).limit(5);

    if (users.length === 0) {
      console.log('⚠️  Không tìm thấy user nào để tạo địa chỉ.');
      return;
    }

    // Clear existing addresses
    await Address.deleteMany({});

    // Sample addresses for Vietnam
    const addressTemplates = [
      {
        addressLine1: '123 Nguyễn Trãi',
        addressLine2: 'Tầng 4, Tòa nhà A',
        city: 'Thanh Xuân',
        province: 'Hà Nội',
        postalCode: '100000',
      },
      {
        addressLine1: '456 Lê Lợi',
        addressLine2: 'Căn hộ 5B',
        city: 'Quận 1',
        province: 'Hồ Chí Minh',
        postalCode: '700000',
      },
      {
        addressLine1: '789 Trần Hưng Đạo',
        addressLine2: '',
        city: 'Hải Châu',
        province: 'Đà Nẵng',
        postalCode: '550000',
      },
      {
        addressLine1: '321 Hoàng Diệu',
        addressLine2: 'Nhà riêng',
        city: 'Ninh Kiều',
        province: 'Cần Thơ',
        postalCode: '900000',
      },
      {
        addressLine1: '654 Phan Chu Trinh',
        addressLine2: '',
        city: 'Hải An',
        province: 'Hải Phòng',
        postalCode: '180000',
      },
      {
        addressLine1: '111 Lê Duẩn',
        addressLine2: 'Biệt thự số 3',
        city: 'Huế',
        province: 'Thừa Thiên Huế',
        postalCode: '530000',
      },
      {
        addressLine1: '222 Nguyễn Văn Cừ',
        addressLine2: '',
        city: 'Pleiku',
        province: 'Gia Lai',
        postalCode: '600000',
      },
      {
        addressLine1: '333 Hai Bà Trưng',
        addressLine2: 'Chung cư Sunview',
        city: 'Thủ Đức',
        province: 'Hồ Chí Minh',
        postalCode: '700000',
      },
    ];

    const names = [
      'Nguyễn Văn An',
      'Trần Thị Bình',
      'Lê Văn Cường',
      'Phạm Thị Dung',
      'Hoàng Văn Em',
    ];

    const phones = ['0987654321', '0912345678', '0901234567', '0909876543', '0898765432'];

    const addressTypes = ['shipping', 'billing', 'both'];

    const addresses = [];

    // Create 2-3 addresses for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const numAddresses = Math.floor(Math.random() * 2) + 2; // 2-3 addresses per user

      for (let j = 0; j < numAddresses; j++) {
        const templateIndex = (i * numAddresses + j) % addressTemplates.length;
        const template = addressTemplates[templateIndex];

        addresses.push({
          user: user._id,
          fullName: names[i % names.length],
          phone: phones[(i + j) % phones.length],
          addressLine1: template.addressLine1,
          addressLine2: template.addressLine2,
          city: template.city,
          province: template.province,
          postalCode: template.postalCode,
          country: 'Vietnam',
          addressType: addressTypes[j % addressTypes.length],
          isDefault: j === 0, // First address is default
          deleted: false,
        });
      }
    }

    // Insert addresses
    await Address.insertMany(addresses);

    console.log(`✅ Đã tạo ${addresses.length} địa chỉ mẫu cho ${users.length} users`);
  } catch (error) {
    console.error('❌ Lỗi khi seed địa chỉ:', error);
  }
};

// Seed coupons function
const seedCoupons = async () => {
  try {
    const User = mongoose.model('User');

    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('⚠️  No admin user found. Skipping coupon seeding.');
      return;
    }

    // Clear existing coupons
    await Coupon.deleteMany({});

    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount - 10% off for new customers',
        discount_type: 'percentage',
        discount_value: 10,
        max_discount_amount: 50000,
        min_order_value: 0,
        usage_limit: null,
        usage_limit_per_user: 1,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date('2025-12-31'),
        created_by: adminUser._id,
      },
      {
        code: 'SUMMER2024',
        description: 'Summer sale - 20% off on all items',
        discount_type: 'percentage',
        discount_value: 20,
        max_discount_amount: 100000,
        min_order_value: 500000,
        usage_limit: 1000,
        usage_limit_per_user: 2,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date('2025-08-31'),
        created_by: adminUser._id,
      },
      {
        code: 'SAVE50K',
        description: 'Fixed discount - Save 50,000 VND',
        discount_type: 'fixed_amount',
        discount_value: 50000,
        min_order_value: 300000,
        usage_limit: 500,
        usage_limit_per_user: 1,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date('2025-12-31'),
        created_by: adminUser._id,
      },
      {
        code: 'FREESHIP',
        description: 'Free shipping on all orders',
        discount_type: 'free_shipping',
        discount_value: 0,
        min_order_value: 200000,
        usage_limit: null,
        usage_limit_per_user: 5,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date('2025-12-31'),
        created_by: adminUser._id,
      },
      {
        code: 'MEGA50',
        description: 'Mega sale - 50% off (max 200k)',
        discount_type: 'percentage',
        discount_value: 50,
        max_discount_amount: 200000,
        min_order_value: 1000000,
        usage_limit: 100,
        usage_limit_per_user: 1,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date('2025-06-30'),
        created_by: adminUser._id,
      },
      {
        code: 'VIP100K',
        description: 'VIP discount - 100,000 VND off',
        discount_type: 'fixed_amount',
        discount_value: 100000,
        min_order_value: 1500000,
        usage_limit: 50,
        usage_limit_per_user: 1,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date('2025-12-31'),
        created_by: adminUser._id,
      },
    ];

    await Coupon.insertMany(coupons);

    console.log(`✅ Đã tạo ${coupons.length} mã giảm giá`);
  } catch (error) {
    console.error('❌ Lỗi khi seed coupons:', error);
  }
};

seedAll();
