import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const pageNames = [
  'mobile',
  'laptop',
  'may-tinh-de-ban',
  'man-hinh',
  'tablet',
  'thiet-bi-am-thanh',
  'do-choi-cong-nghe',
  'tivi',
  'phu-kien/camera',
  'phu-kien/sac-dien-thoai',
  'phu-kien/pin-du-phong',
  'phu-kien/chuot-ban-phim-may-tinh',
  'phu-kien/the-nho-usb-otg',
];

const BASE_URL = 'https://cellphones.com.vn/';

const scrapePage = async (page) => {
  console.log(`[INFO] Starting to scrape page: ${page}`);
  const url = `${BASE_URL}${page}.html`;
  const config = {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'text/html',
      'Accept-Language': 'vi-VN,vi;q=0.9',
    },
  };

  try {
    const response = await axios.get(url, config);
    const html = response.data;
    const $ = cheerio.load(html);

    let brands = [];
    let results = [];

    // ---- Strategy 1: JSON-LD
    // console.log(`[INFO] Attempting to extract data using JSON-LD strategy for ${page}.`);
    // $('script[type="application/ld+json"]').each((_, el) => {
    //   try {
    //     const json = JSON.parse($(el).text());
    //
    //     // Skip BreadcrumbList and other non-product types
    //     if (json['@type'] === 'BreadcrumbList' || json['@type'] === 'FAQPage') {
    //       return;
    //     }
    //
    //     // Skip AggregateOffer (category-level, not individual products)
    //     if (json['@type'] === 'Product' && json.offers?.['@type'] === 'AggregateOffer') {
    //       return;
    //     }
    //
    //     if (json['@type'] === 'Product' && json.offers?.price) {
    //       // Only include if it has a specific price (not aggregate)
    //       // Handle image - can be string or array
    //       let image = null;
    //       if (json.image) {
    //         if (typeof json.image === 'string') {
    //           image = json.image;
    //         } else if (Array.isArray(json.image) && json.image.length > 0) {
    //           image = json.image[0];
    //         } else if (json.image.url) {
    //           image = json.image.url;
    //         }
    //       }
    //
    //       results.push({
    //         name: json.name,
    //         price: json.offers.price,
    //         currency: json.offers.priceCurrency,
    //         url: json.url || json.offers.url,
    //         image: image,
    //       });
    //     } else if (json.itemListElement && json['@type'] !== 'BreadcrumbList') {
    //       // Handle ItemList (but not BreadcrumbList)
    //       json.itemListElement.forEach((item) => {
    //         if (item.item && item.item.offers?.price) {
    //           // Handle image - can be string or array
    //           let image = null;
    //           if (item.item.image) {
    //             if (typeof item.item.image === 'string') {
    //               image = item.item.image;
    //             } else if (Array.isArray(item.item.image) && item.item.image.length > 0) {
    //               image = item.item.image[0];
    //             } else if (item.item.image.url) {
    //               image = item.item.image.url;
    //             }
    //           }
    //
    //           results.push({
    //             name: item.item.name,
    //             price: item.item.offers.price,
    //             currency: item.item.offers.priceCurrency,
    //             url: item.item.url || item.item.offers.url,
    //             image: image,
    //           });
    //         }
    //       });
    //     }
    //   } catch (e) {
    //     // Ignore parsing errors
    //   }
    // });
    // console.log(`[INFO] Found ${results.length} items using JSON-LD strategy for ${page}.`);

    // ---- Strategy 2: DOM Fallback
    $('.product-info-container').each((_, el) => {
      // Try multiple selectors for name
      const name = $(el)
        .find('.product__name h3, .product__name, [class*="product__name"]')
        .first()
        .text()
        .trim();

      // Get price from the correct selector
      const priceText = $(el).find('.product__price--show').first().text().trim();

      // Get URL from product link
      const productUrl = $(el).find('a[href*=".html"], .product__link').first().attr('href');

      // Get image - try src first, then data-src (for lazy loading)
      const img = $(el).find('.product__img, img').first();
      const imageUrl = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src');

      if (name && priceText && productUrl) {
        results.push({ name, price: priceText, url: productUrl, image: imageUrl || null });
      }
    });
    console.log(`[INFO] Found ${results.length} items using DOM extraction for ${page}.`);

    brands = extractBrandsFromDOM($);
    console.log(`[INFO] Found ${brands.length} brands for ${page}.`);

    // --- Normalizer & Validator
    console.log(`[INFO] Normalizing and validating ${results.length} items for ${page}.`);
    const normalizedResults = results
      .map((item) => {
        // Normalize Price
        let price = null;
        if (item.price) {
          // Handle different price formats: number, string with dots, string with "đ"
          // Remove all non-digit characters except minus sign
          const priceStr = String(item.price)
            .replace(/[^\d-]/g, '')
            .trim();
          price = parseInt(priceStr);
          if (isNaN(price) || price <= 0) {
            price = null;
          }
        }

        // Normalize URL - check multiple possible locations
        let normalizedUrl = item.url || item.offers?.url || item.item?.url;
        if (normalizedUrl && !normalizedUrl.startsWith('http')) {
          try {
            normalizedUrl = new URL(normalizedUrl, BASE_URL).href;
          } catch (e) {
            normalizedUrl = null;
          }
        }

        // Normalize Image URL
        let normalizedImage = item.image || null;
        if (normalizedImage && !normalizedImage.startsWith('http')) {
          try {
            normalizedImage = new URL(normalizedImage, BASE_URL).href;
          } catch (e) {
            normalizedImage = null;
          }
        }

        // Extract brand from name
        // Clean product name - remove common prefixes
        let productNameClean = item.name ? item.name.trim() : '';
        productNameClean = productNameClean
          .replace(/^Điện thoại\s+/i, '')
          .replace(/^Laptop\s+/i, '')
          .replace(/^Máy tính\s+/i, '')
          .trim();

        const productNameLower = productNameClean.toLowerCase();

        // Special mappings for common brand variations
        const brandMappings = {
          iphone: 'Apple',
          ipad: 'Apple',
          macbook: 'Apple',
          imac: 'Apple',
          galaxy: 'Samsung',
          poco: 'Xiaomi',
          redmi: 'Xiaomi',
          'mi ': 'Xiaomi',
        };

        // Check special mappings first
        for (const [keyword, mappedBrand] of Object.entries(brandMappings)) {
          if (
            productNameLower.includes(keyword) &&
            brands.map((b) => b.name).includes(mappedBrand)
          ) {
            item.brand = mappedBrand;
            break;
          }
        }

        // If no special mapping found, try direct brand matching
        if (!item.brand) {
          for (const brand of brands) {
            const brandLower = brand.name.toLowerCase();
            // Check if brand appears at the start of product name (most common case)
            if (
              productNameLower.startsWith(brandLower) ||
              productNameLower.includes(` ${brandLower} `) ||
              productNameLower.includes(` ${brandLower}`)
            ) {
              item.brand = brand.name;
              break;
            }
          }
        }

        return {
          name: item.name ? item.name.trim() : null,
          brand: item.brand ? item.brand.trim() : null,
          price: price,
          currency: item.currency || item.offers?.priceCurrency || 'VND',
          url: normalizedUrl,
          image: normalizedImage,
        };
      })
      .filter((item) => item.name && item.price && item.url); // Validator (image is optional)
    console.log(
      `[INFO] ${normalizedResults.length} items remaining after normalization and validation for ${page}.`,
    );

    // --- Store to JSON
    if (normalizedResults.length > 0) {
      const dirPath = `data/${page}`;
      fs.mkdirSync(dirPath, { recursive: true });

      // Store brands separately
      const brandsFilePath = `${dirPath}/brands.json`;
      fs.writeFileSync(brandsFilePath, JSON.stringify(brands, null, 2));
      console.log(`[SUCCESS] Stored brands to ${brandsFilePath}`);

      // Store products
      const filePath = `${dirPath}/products.json`;
      fs.writeFileSync(filePath, JSON.stringify(normalizedResults, null, 2));
      console.log(
        `[SUCCESS] Scraped and saved ${normalizedResults.length} items from ${page} to ${filePath}`,
      );
    } else {
      console.log(`[WARN] No items to save for ${page}.`);
    }
  } catch (error) {
    console.error(`[ERROR] Error scraping ${page}:`, error.message);
  }
};

function extractBrandsFromDOM($) {
  const brands = [];

  // Extract brands from brand filter list
  $('.list-brand__item').each((_, el) => {
    // Get brand name from img alt attribute or text content
    const img = $(el).find('img');
    const alt = img.attr('alt') || '';
    const src = img.attr('src') || '';
    const text = $(el).text().trim();

    // Extract brand name - remove "Điện thoại " prefix if present
    let brandName = alt || text;
    if (brandName) {
      // Remove common prefixes
      brandName = brandName
        .replace(/^Điện thoại\s+/i, '')
        .replace(/^Laptop\s+/i, '')
        .replace(/^Máy tính\s+/i, '')
        .trim();

      if (brandName) {
        brands.push({
          name: brandName,
          image: src,
        });
      }
    }
  });

  return brands;
}

const run = async () => {
  console.log('[INFO] Starting scraper...');
  fs.mkdirSync('data', { recursive: true });
  for (const page of pageNames) {
    await scrapePage(page);
  }
  console.log('[INFO] Scraper finished.');
};

run();
