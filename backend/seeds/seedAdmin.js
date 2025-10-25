import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../configs/database.js';
import User from '../models/user.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('✅ Admin đã tồn tại, không cần seed lại.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('1234567890', 10);

    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('🎉 Seed tài khoản admin thành công!');
    process.exit();

  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error);
    process.exit(1);
  }
};

seedAdmin();
