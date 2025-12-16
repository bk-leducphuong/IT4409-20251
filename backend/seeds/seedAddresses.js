import mongoose from 'mongoose';
import Address from '../models/address.js';
import User from '../models/user.js';
import 'dotenv/config';

const seedAddresses = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Get some users from database
    const users = await User.find({ deleted: false, role: 'customer' }).limit(5);

    if (users.length === 0) {
      console.log('⚠️  Không tìm thấy user nào. Vui lòng chạy seedUsers trước.');
      process.exit(0);
    }

    // Clear existing addresses
    await Address.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu địa chỉ cũ');

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
    console.log('📊 Chi tiết:');

    for (const user of users) {
      const userAddresses = addresses.filter(
        (addr) => addr.user.toString() === user._id.toString(),
      );
      console.log(`   - ${user.fullName || user.email}: ${userAddresses.length} địa chỉ`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed địa chỉ:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAddresses();
