import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from '../configs/database.js';
import Brand from '../models/brand.js';

dotenv.config();

const seedBrands = async () => {
  try {
    await connectDB();

    // Clear existing brands
    await Brand.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu brands cũ');

    // Create realistic brand names for tech/e-commerce
    const brandNames = [
      'Apple',
      'Samsung',
      'Dell',
      'HP',
      'Lenovo',
      'Asus',
      'Acer',
      'Microsoft',
      'Sony',
      'LG',
      'Xiaomi',
      'Huawei',
      'OnePlus',
      'Google',
      'Razer',
    ];

    const brands = brandNames.map((name) => ({
      name: name,
      logo_url: faker.image.urlLoremFlickr({ category: 'logo', width: 200, height: 200 }),
    }));

    const createdBrands = await Brand.insertMany(brands);
    console.log(`✅ Đã seed ${createdBrands.length} brands thành công!`);

    return createdBrands;
  } catch (error) {
    console.error('❌ Lỗi seed brands:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedBrands()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedBrands;
