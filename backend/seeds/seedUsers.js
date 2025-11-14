import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import connectDB from '../configs/database.js';
import User from '../models/user.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users except admin
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('🗑️  Đã xóa dữ liệu users cũ (giữ lại admin)');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create sample users
    const users = [];

    // Create 20 customer users
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      users.push({
        fullName: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        phone: faker.phone.number('0#########'),
        avatar: faker.image.avatar(),
        status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']), // 75% active
        role: 'customer',
        deleted: false,
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Đã seed ${createdUsers.length} users thành công!`);
    console.log('ℹ️  Mật khẩu mặc định: password123');

    return createdUsers;
  } catch (error) {
    console.error('❌ Lỗi seed users:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedUsers;
