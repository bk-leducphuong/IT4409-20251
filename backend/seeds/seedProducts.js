import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from '../configs/database.js';
import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';
import ProductImage from '../models/productImage.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products, variants, and images
    await ProductImage.deleteMany({});
    await ProductVariant.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu products, variants, và images cũ');

    // Get all categories and brands
    const categories = await Category.find({ parent_category_id: { $ne: null } }); // Only subcategories
    const brands = await Brand.find({});

    if (categories.length === 0 || brands.length === 0) {
      console.error('❌ Cần seed categories và brands trước!');
      throw new Error('Categories hoặc Brands chưa được seed');
    }

    const products = [];
    const productVariants = [];
    const productImages = [];

    // Product name templates by category
    const productTemplates = {
      laptop: ['Pro', 'Air', 'Gaming', 'Business', 'Ultra', 'Creator', 'Studio'],
      phone: ['Pro', 'Max', 'Plus', 'Lite', 'Ultra', 'Edge', 'Note'],
      tablet: ['Pro', 'Air', 'Lite', 'Plus'],
      audio: ['Pro', 'Max', 'Lite', 'Studio', 'Elite'],
      accessory: ['Premium', 'Pro', 'Essential', 'Ultra'],
    };

    // Create 50 products
    for (let i = 0; i < 50; i++) {
      const category = faker.helpers.arrayElement(categories);
      const brand = faker.helpers.arrayElement(brands);

      // Generate product name based on category
      const template = faker.helpers.arrayElement(productTemplates.laptop);
      const productName = `${brand.name} ${template} ${faker.commerce.productAdjective()}`;
      const slug =
        productName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${faker.string.alphanumeric(6)}`;

      const product = {
        name: productName,
        slug: slug,
        description: faker.commerce.productDescription() + ' ' + faker.lorem.paragraph(),
        category_id: category._id,
        brand_id: brand._id,
      };

      products.push(product);
    }

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Đã tạo ${createdProducts.length} products`);

    // Create variants for each product (2-4 variants per product)
    for (const product of createdProducts) {
      const numVariants = faker.number.int({ min: 2, max: 4 });

      // Define possible attributes
      const colors = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green'];
      const rams = ['8GB', '16GB', '32GB', '64GB'];
      const storages = ['128GB', '256GB', '512GB', '1TB', '2TB'];

      for (let v = 0; v < numVariants; v++) {
        const color = faker.helpers.arrayElement(colors);
        const ram = faker.helpers.arrayElement(rams);
        const storage = faker.helpers.arrayElement(storages);

        const basePrice = faker.number.int({ min: 5000000, max: 50000000 });
        const hasDiscount = faker.datatype.boolean(0.3); // 30% chance of discount

        const variant = {
          product_id: product._id,
          sku: `SKU-${faker.string.alphanumeric(10).toUpperCase()}`,
          price: basePrice,
          original_price: hasDiscount
            ? basePrice * faker.number.float({ min: 1.1, max: 1.5 })
            : null,
          stock_quantity: faker.number.int({ min: 0, max: 100 }),
          main_image_url: faker.image.urlLoremFlickr({ category: 'tech', width: 800, height: 800 }),
          attributes: {
            Color: color,
            RAM: ram,
            Storage: storage,
          },
        };

        productVariants.push(variant);
      }
    }

    const createdVariants = await ProductVariant.insertMany(productVariants);
    console.log(`✅ Đã tạo ${createdVariants.length} product variants`);

    // Create images for each variant (2-5 images per variant)
    for (const variant of createdVariants) {
      const numImages = faker.number.int({ min: 2, max: 5 });

      for (let img = 0; img < numImages; img++) {
        const image = {
          variant_id: variant._id,
          image_url: faker.image.urlLoremFlickr({ category: 'tech', width: 800, height: 800 }),
          alt_text: faker.commerce.productDescription(),
          sort_order: img,
        };

        productImages.push(image);
      }
    }

    const createdImages = await ProductImage.insertMany(productImages);
    console.log(`✅ Đã tạo ${createdImages.length} product images`);

    console.log(`🎉 Đã seed products hoàn tất!`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Variants: ${createdVariants.length}`);
    console.log(`   - Images: ${createdImages.length}`);

    return {
      products: createdProducts,
      variants: createdVariants,
      images: createdImages,
    };
  } catch (error) {
    console.error('❌ Lỗi seed products:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedProducts;
