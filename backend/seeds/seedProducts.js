import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../configs/database.js';
import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';
import ProductImage from '../models/productImage.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveScrapeDataRoot() {
  const candidates = [
    path.resolve(__dirname, '../scrape/data'),
    path.resolve(__dirname, '../data'),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  throw new Error(
    'Không tìm thấy thư mục scraped data. Hãy chạy scraper trước (hoặc kiểm tra đường dẫn /scrape/data hoặc /data).',
  );
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const seedProducts = async () => {
  try {
    await connectDB();

    const scrapeRoot = resolveScrapeDataRoot();

    // Clear existing products, variants, and images
    await ProductImage.deleteMany({});
    await ProductVariant.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu products, variants, và images cũ');

    // Get all categories and brands
    const categories = await Category.find({});
    const brands = await Brand.find({});

    if (categories.length === 0 || brands.length === 0) {
      console.error('❌ Cần seed categories và brands trước!');
      throw new Error('Categories hoặc Brands chưa được seed');
    }

    const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
    const brandByName = new Map(brands.map((b) => [b.name.toLowerCase(), b]));

    const products = [];
    const productVariants = [];
    const productImages = [];

    // Dùng để tránh trùng product (theo: category + brand + name)
    const seenProductKeys = new Set();
    // Dùng để đảm bảo slug là unique trong batch insert
    const slugCounts = new Map();

    // Walk through scraped data folders, load products.json and map to DB
    const walk = (dir, relative = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = relative ? path.join(relative, entry.name) : entry.name;

        if (entry.isDirectory()) {
          walk(fullPath, relPath);
        } else if (entry.isFile() && entry.name === 'products.json') {
          // relPath is like "mobile/products.json" or "phu-kien/camera/products.json"
          const pagePath = relPath.replace(/\\/g, '/').replace(/\/products\.json$/, '');
          // Map folder path -> category slug (match logic from seedCategories)
          let categorySlug;
          const parts = pagePath.split('/');
          if (parts.length === 1) {
            // e.g. "mobile"
            categorySlug = parts[0];
          } else if (parts.length === 2 && parts[0] === 'phu-kien') {
            // e.g. "phu-kien/camera" -> "phu-kien-camera"
            categorySlug = `${parts[0]}-${parts[1]}`;
          } else {
            // Fallback: join with dash
            categorySlug = parts.join('-');
          }

          const category = categoryBySlug.get(categorySlug);
          if (!category) {
            console.warn(
              `⚠️  Không tìm thấy category cho slug "${categorySlug}", bỏ qua file ${fullPath}`,
            );
            continue;
          }

          const raw = fs.readFileSync(fullPath, 'utf8');
          let data;
          try {
            data = JSON.parse(raw);
          } catch (e) {
            console.warn(`⚠️  Không parse được ${fullPath}:`, e.message);
            continue;
          }

          if (!Array.isArray(data)) continue;

          console.log(
            `ℹ️  Đang map ${data.length} products từ "${pagePath}" vào category "${category.slug}"`,
          );

          for (const p of data) {
            if (!p || !p.name || !p.price || !p.brand) continue;

            const brandNameLower = String(p.brand).toLowerCase();
            const brandDoc = brandByName.get(brandNameLower);
            if (!brandDoc) {
              console.warn(
                `⚠️  Không tìm thấy Brand "${p.brand}" cho product "${p.name}", bỏ qua.`,
              );
              continue;
            }

            const productName = p.name.trim();

            // Skip nếu đã có product giống hệt (name + brand + category)
            const productKey = `${category._id.toString()}|${brandDoc._id.toString()}|${productName.toLowerCase()}`;
            if (seenProductKeys.has(productKey)) {
              // Đã tồn tại product giống hệt, bỏ qua
              continue;
            }
            seenProductKeys.add(productKey);

            // Tạo slug base từ name + category + brand
            const baseSlug = `${productName} ${category.slug} ${brandDoc.name}`;
            let slug = slugify(baseSlug);

            // Đảm bảo slug unique trong batch insert
            if (slugCounts.has(slug)) {
              const count = slugCounts.get(slug) + 1;
              slugCounts.set(slug, count);
              slug = `${slug}-${count}`;
            } else {
              slugCounts.set(slug, 0);
            }

            const product = {
              name: p.name,
              slug,
              description: `${p.name} - dữ liệu import từ CellphoneS.\nNguồn: ${p.url || ''}`,
              category_id: category._id,
              brand_id: brandDoc._id,
            };

            products.push({
              scraped: p,
              doc: product,
            });
          }
        }
      }
    };

    walk(scrapeRoot);

    if (products.length === 0) {
      console.warn('⚠️  Không tìm thấy product nào trong scraped data, không seed products.');
      return { products: [], variants: [], images: [] };
    }

    // Insert products
    const createdProducts = await Product.insertMany(products.map((p) => p.doc));
    console.log(`✅ Đã tạo ${createdProducts.length} products từ scraped data`);

    // Map back to scraped objects to build variants/images
    for (let i = 0; i < createdProducts.length; i++) {
      const created = createdProducts[i];
      const src = products[i].scraped;

      const price = src.price;
      const imageUrl = src.image || 'https://via.placeholder.com/800x800?text=No+Image';

      const variant = {
        product_id: created._id,
        sku: `SKU-${created._id.toString().slice(-6)}-${i.toString().padStart(3, '0')}`,
        price,
        original_price: null,
        stock_quantity: 50,
        main_image_url: imageUrl,
        attributes: {},
      };

      productVariants.push(variant);
    }

    const createdVariants = await ProductVariant.insertMany(productVariants);
    console.log(`✅ Đã tạo ${createdVariants.length} product variants (1/ product)`);

    // Create one image per variant from scraped image
    for (let i = 0; i < createdVariants.length; i++) {
      const variant = createdVariants[i];
      const src = products[i].scraped;

      const image = {
        variant_id: variant._id,
        image_url: src.image || 'https://via.placeholder.com/800x800?text=No+Image',
        alt_text: src.name,
        sort_order: 0,
      };

      productImages.push(image);
    }

    const createdImages = await ProductImage.insertMany(productImages);
    console.log(`✅ Đã tạo ${createdImages.length} product images (1/ variant)`);

    console.log(`🎉 Đã seed products từ scraped data hoàn tất!`);
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
