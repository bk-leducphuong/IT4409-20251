import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { UPLOAD_DIRS } from '../configs/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Image processing utility class
 */
class ImageProcessor {
  /**
   * Optimize and resize image
   * @param {string} inputPath - Path to input image
   * @param {string} outputPath - Path to save optimized image
   * @param {object} options - Processing options
   */
  static async optimizeImage(inputPath, outputPath, options = {}) {
    const { width = null, height = null, quality = 80, format = 'jpeg' } = options;

    try {
      let sharpInstance = sharp(inputPath);

      // Resize if dimensions provided
      if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Apply format-specific optimization
      switch (format) {
        case 'jpeg':
        case 'jpg':
          sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality });
          break;
        default:
          sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
      }

      await sharpInstance.toFile(outputPath);
      return outputPath;
    } catch (error) {
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  }

  /**
   * Generate thumbnail
   * @param {string} inputPath - Path to input image
   * @param {string} outputPath - Path to save thumbnail
   * @param {number} size - Thumbnail size (width/height)
   */
  static async generateThumbnail(inputPath, outputPath, size = 150) {
    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      return outputPath;
    } catch (error) {
      throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
  }

  /**
   * Process product images - create optimized version and thumbnail
   * @param {string} tempPath - Path to temporary uploaded file
   * @param {string} filename - Desired filename
   */
  static async processProductImage(tempPath, filename) {
    const baseDir = path.join(__dirname, '..');
    const productDir = path.join(baseDir, UPLOAD_DIRS.PRODUCTS);
    const thumbnailDir = path.join(productDir, 'thumbnails');

    // Ensure thumbnail directory exists
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);

    // Generate unique filename if needed
    const optimizedFilename = `${nameWithoutExt}${ext}`;
    const thumbnailFilename = `${nameWithoutExt}_thumb${ext}`;

    const optimizedPath = path.join(productDir, optimizedFilename);
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

    // Optimize main image (max 1200px width)
    await this.optimizeImage(tempPath, optimizedPath, {
      width: 1200,
      quality: 85,
    });

    // Generate thumbnail (150x150)
    await this.generateThumbnail(tempPath, thumbnailPath, 150);

    // Delete temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    return {
      url: `/uploads/products/${optimizedFilename}`,
      thumbnailUrl: `/uploads/products/thumbnails/${thumbnailFilename}`,
      filename: optimizedFilename,
    };
  }

  /**
   * Process avatar image
   * @param {string} tempPath - Path to temporary uploaded file
   * @param {string} filename - Desired filename
   */
  static async processAvatarImage(tempPath, filename) {
    const baseDir = path.join(__dirname, '..');
    const avatarDir = path.join(baseDir, UPLOAD_DIRS.AVATARS);

    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const optimizedFilename = `${nameWithoutExt}${ext}`;
    const optimizedPath = path.join(avatarDir, optimizedFilename);

    // Optimize avatar (300x300, square)
    await sharp(tempPath)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);

    // Delete temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    return {
      url: `/uploads/avatars/${optimizedFilename}`,
      filename: optimizedFilename,
    };
  }

  /**
   * Delete image file
   * @param {string} imageUrl - Image URL or path
   */
  static deleteImage(imageUrl) {
    try {
      const baseDir = path.join(__dirname, '..');
      // Remove leading slash if present
      const relativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
      const fullPath = path.join(baseDir, relativePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);

        // If it's a product image, also delete thumbnail
        if (imageUrl.includes('/uploads/products/') && !imageUrl.includes('/thumbnails/')) {
          const filename = path.basename(fullPath);
          const ext = path.extname(filename);
          const nameWithoutExt = path.basename(filename, ext);
          const thumbnailPath = path.join(
            baseDir,
            UPLOAD_DIRS.PRODUCTS,
            'thumbnails',
            `${nameWithoutExt}_thumb${ext}`,
          );

          if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Delete multiple images
   * @param {Array<string>} imageUrls - Array of image URLs
   */
  static deleteImages(imageUrls) {
    imageUrls.forEach((url) => this.deleteImage(url));
  }
}

export default ImageProcessor;
