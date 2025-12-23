import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../configs/database.js';
import Brand from '../models/brand.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveScrapeDataRoot() {
  const candidates = [
    // Original location used by the scraper
    path.resolve(__dirname, '../scrape/data'),
    // New location if you changed scraper to write to /data
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

function loadScrapedBrands(scrapeRoot) {
  const brandMap = new Map(); // key: name (lowercase), value: { name, logo_url }

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name === 'brands.json') {
        const raw = fs.readFileSync(fullPath, 'utf8');
        let data;
        try {
          data = JSON.parse(raw);
        } catch (e) {
          console.warn(`⚠️  Không parse được ${fullPath}:`, e.message);
          continue;
        }

        if (!Array.isArray(data)) continue;

        for (const b of data) {
          if (!b || !b.name) continue;
          const key = b.name.trim().toLowerCase();
          if (!key) continue;

          if (!brandMap.has(key)) {
            brandMap.set(key, {
              name: b.name.trim(),
              logo_url: b.image || null,
            });
          } else {
            // Nếu chưa có logo_url và brand mới có thì cập nhật
            const existing = brandMap.get(key);
            if (!existing.logo_url && b.image) {
              existing.logo_url = b.image;
            }
          }
        }
      }
    }
  };

  walk(scrapeRoot);

  return Array.from(brandMap.values());
}

const seedBrands = async () => {
  try {
    await connectDB();

    // Xác định thư mục chứa dữ liệu scraper
    const scrapeRoot = resolveScrapeDataRoot();

    // Clear existing brands
    await Brand.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu brands cũ');

    const scrapedBrands = loadScrapedBrands(scrapeRoot);

    if (scrapedBrands.length === 0) {
      console.warn('⚠️  Không tìm thấy brand nào trong scraped data, không seed brands.');
      return [];
    }

    const createdBrands = await Brand.insertMany(scrapedBrands);
    console.log(`✅ Đã seed ${createdBrands.length} brands từ scraped data thành công!`);

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
