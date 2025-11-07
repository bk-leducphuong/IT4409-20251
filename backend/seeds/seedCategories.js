import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from '../configs/database.js';
import Category from '../models/category.js';

dotenv.config();

const seedCategories = async () => {
  try {
    await connectDB();

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu categories cũ');

    // Create parent categories
    const parentCategories = [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Tablets', slug: 'tablets' },
      { name: 'Accessories', slug: 'accessories' },
      { name: 'Audio', slug: 'audio' },
    ];

    const createdParents = await Category.insertMany(parentCategories);
    console.log(`✅ Đã tạo ${createdParents.length} parent categories`);

    // Create subcategories
    const subcategories = [
      // Laptop subcategories
      { name: 'Gaming Laptops', slug: 'gaming-laptops', parent_category_id: createdParents[0]._id },
      {
        name: 'Business Laptops',
        slug: 'business-laptops',
        parent_category_id: createdParents[0]._id,
      },
      { name: 'Ultrabooks', slug: 'ultrabooks', parent_category_id: createdParents[0]._id },

      // Smartphone subcategories
      { name: 'Android Phones', slug: 'android-phones', parent_category_id: createdParents[1]._id },
      { name: 'iPhones', slug: 'iphones', parent_category_id: createdParents[1]._id },
      { name: 'Budget Phones', slug: 'budget-phones', parent_category_id: createdParents[1]._id },

      // Tablet subcategories
      { name: 'iPads', slug: 'ipads', parent_category_id: createdParents[2]._id },
      {
        name: 'Android Tablets',
        slug: 'android-tablets',
        parent_category_id: createdParents[2]._id,
      },

      // Accessories subcategories
      { name: 'Phone Cases', slug: 'phone-cases', parent_category_id: createdParents[3]._id },
      { name: 'Chargers', slug: 'chargers', parent_category_id: createdParents[3]._id },
      {
        name: 'Screen Protectors',
        slug: 'screen-protectors',
        parent_category_id: createdParents[3]._id,
      },

      // Audio subcategories
      { name: 'Headphones', slug: 'headphones', parent_category_id: createdParents[4]._id },
      { name: 'Earbuds', slug: 'earbuds', parent_category_id: createdParents[4]._id },
      { name: 'Speakers', slug: 'speakers', parent_category_id: createdParents[4]._id },
    ];

    const createdSubcategories = await Category.insertMany(subcategories);
    console.log(`✅ Đã tạo ${createdSubcategories.length} subcategories`);

    const allCategories = [...createdParents, ...createdSubcategories];
    console.log(`✅ Đã seed ${allCategories.length} categories thành công!`);

    return allCategories;
  } catch (error) {
    console.error('❌ Lỗi seed categories:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedCategories;
