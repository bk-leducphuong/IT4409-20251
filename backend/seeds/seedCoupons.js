import 'dotenv/config';
import connectDB from '../configs/database.js';
import Coupon from '../models/coupon.js';
import User from '../models/user.js';

const seedCoupons = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing coupons...');
    await Coupon.deleteMany({});

    // Get admin user for created_by field
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.log('⚠️  No admin user found. Please run seedAdmin.js first.');
      process.exit(1);
    }

    console.log('🎟️  Creating coupons...');

    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount - 10% off for new customers',
        discount_type: 'percentage',
        discount_value: 10,
        max_discount_amount: 50000,
        min_order_value: 0,
        usage_limit: null, // Unlimited
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
        usage_limit: null, // Unlimited
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
      {
        code: 'EXPIRED',
        description: 'Expired coupon for testing',
        discount_type: 'percentage',
        discount_value: 15,
        min_order_value: 0,
        usage_limit: 100,
        usage_limit_per_user: 1,
        is_active: true,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-31'), // Already expired
        created_by: adminUser._id,
      },
      {
        code: 'INACTIVE',
        description: 'Inactive coupon for testing',
        discount_type: 'percentage',
        discount_value: 25,
        min_order_value: 0,
        usage_limit: 100,
        usage_limit_per_user: 1,
        is_active: false, // Not active
        valid_from: new Date(),
        valid_until: new Date('2025-12-31'),
        created_by: adminUser._id,
      },
    ];

    await Coupon.insertMany(coupons);

    console.log(`✅ Successfully created ${coupons.length} coupons!`);
    console.log('\n📋 Available Coupons:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    coupons.forEach((coupon) => {
      const status = !coupon.is_active
        ? '❌ INACTIVE'
        : new Date(coupon.valid_until) < new Date()
          ? '⏰ EXPIRED'
          : '✅ ACTIVE';
      const type =
        coupon.discount_type === 'percentage'
          ? `${coupon.discount_value}%`
          : coupon.discount_type === 'fixed_amount'
            ? `${coupon.discount_value.toLocaleString()} VND`
            : 'Free Shipping';

      console.log(
        `${status} ${coupon.code.padEnd(15)} - ${type.padEnd(15)} - ${coupon.description}`,
      );
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
    process.exit(1);
  }
};

seedCoupons();
