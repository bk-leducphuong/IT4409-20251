import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../configs/database.js';
import Category from '../models/category.js';

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

function humanizeCategoryName(slugPart) {
  const map = {
    mobile: 'Điện thoại',
    laptop: 'Laptop',
    'may-tinh-de-ban': 'Máy tính để bàn',
    'man-hinh': 'Màn hình',
    tablet: 'Tablet',
    'thiet-bi-am-thanh': 'Thiết bị âm thanh',
    'do-choi-cong-nghe': 'Đồ chơi công nghệ',
    tivi: 'Tivi',
    'phu-kien': 'Phụ kiện',
  };

  if (map[slugPart]) return map[slugPart];

  // Fallback: replace dashes with spaces and capitalize
  return slugPart
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

const seedCategories = async () => {
  try {
    await connectDB();

    const scrapeRoot = resolveScrapeDataRoot();

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu categories cũ');

    // Build categories from folder structure under scraped data
    const parentCategories = [];
    const childCategories = [];

    const entries = fs.readdirSync(scrapeRoot, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const name = entry.name; // e.g. "mobile", "laptop", "phu-kien"

      if (name === 'phu-kien') {
        // Parent "phu-kien" itself
        parentCategories.push({
          name: humanizeCategoryName(name),
          slug: name,
        });

        // Its children are subdirectories like "camera", "sac-dien-thoai", etc.
        const phuKienDir = path.join(scrapeRoot, name);
        const subEntries = fs.readdirSync(phuKienDir, { withFileTypes: true });

        for (const sub of subEntries) {
          if (!sub.isDirectory()) continue;
          const childSlug = `${name}-${sub.name}`; // e.g. "phu-kien-camera"
          childCategories.push({
            name: humanizeCategoryName(sub.name),
            slug: childSlug,
            parentSlug: name,
          });
        }
      } else {
        // Top-level category, no children
        parentCategories.push({
          name: humanizeCategoryName(name),
          slug: name,
        });
      }
    }

    const createdParents = await Category.insertMany(parentCategories);
    console.log(`✅ Đã tạo ${createdParents.length} parent categories từ scraped data`);

    const parentBySlug = new Map(createdParents.map((c) => [c.slug, c]));

    const subDocs = childCategories.map((c) => {
      const parent = parentBySlug.get(c.parentSlug);
      return {
        name: c.name,
        slug: c.slug,
        parent_category_id: parent ? parent._id : null,
      };
    });

    let createdChildren = [];
    if (subDocs.length > 0) {
      createdChildren = await Category.insertMany(subDocs);
      console.log(`✅ Đã tạo ${createdChildren.length} subcategories từ scraped data`);
    }

    const allCategories = [...createdParents, ...createdChildren];
    console.log(`✅ Đã seed ${allCategories.length} categories (từ scraped data) thành công!`);

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
