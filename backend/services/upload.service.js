import ImageProcessor from '../utils/imageProcessor.js';
import ProductImage from '../models/productImage.js';
import User from '../models/user.js';
import path from 'path';

/**
 * Upload Service
 */
class UploadService {
  /**
   * Process and save product images
   * @param {Array} files - Array of uploaded files
   * @param {string} variantId - Product variant ID
   */
  static async uploadProductImages(files, variantId) {
    const processedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Process image (optimize and create thumbnail)
      const result = await ImageProcessor.processProductImage(file.path, file.filename);

      // Save to database
      const productImage = new ProductImage({
        variant_id: variantId,
        image_url: result.url,
        alt_text: file.originalname,
        sort_order: i,
      });

      await productImage.save();

      processedImages.push({
        id: productImage._id,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        altText: productImage.alt_text,
        sortOrder: productImage.sort_order,
      });
    }

    return processedImages;
  }

  /**
   * Upload single product image
   * @param {Object} file - Uploaded file
   * @param {string} variantId - Product variant ID
   * @param {number} sortOrder - Sort order for the image
   */
  static async uploadSingleProductImage(file, variantId, sortOrder = 0) {
    // Process image (optimize and create thumbnail)
    const result = await ImageProcessor.processProductImage(file.path, file.filename);

    // Save to database
    const productImage = new ProductImage({
      variant_id: variantId,
      image_url: result.url,
      alt_text: file.originalname,
      sort_order: sortOrder,
    });

    await productImage.save();

    return {
      id: productImage._id,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      altText: productImage.alt_text,
      sortOrder: productImage.sort_order,
    };
  }

  /**
   * Upload avatar image
   * @param {Object} file - Uploaded file
   * @param {string} userId - User ID
   */
  static async uploadAvatar(file, userId) {
    // Get user to check if they have an existing avatar
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Delete old avatar if exists
    if (user.avatar) {
      ImageProcessor.deleteImage(user.avatar);
    }

    // Process avatar image
    const result = await ImageProcessor.processAvatarImage(
      file.path,
      `avatar-${userId}-${Date.now()}${path.extname(file.originalname)}`,
    );

    // Update user avatar
    user.avatar = result.url;
    await user.save();

    return {
      url: result.url,
      userId: user._id,
    };
  }

  /**
   * Delete product image
   * @param {string} imageId - Product image ID
   */
  static async deleteProductImage(imageId) {
    const productImage = await ProductImage.findById(imageId);

    if (!productImage) {
      throw new Error('Image not found');
    }

    // Delete file from filesystem
    ImageProcessor.deleteImage(productImage.image_url);

    // Delete from database
    await ProductImage.findByIdAndDelete(imageId);

    return { message: 'Image deleted successfully' };
  }

  /**
   * Delete multiple product images
   * @param {Array<string>} imageIds - Array of product image IDs
   */
  static async deleteProductImages(imageIds) {
    const images = await ProductImage.find({ _id: { $in: imageIds } });

    if (images.length === 0) {
      throw new Error('No images found');
    }

    // Delete files from filesystem
    const imageUrls = images.map((img) => img.image_url);
    ImageProcessor.deleteImages(imageUrls);

    // Delete from database
    await ProductImage.deleteMany({ _id: { $in: imageIds } });

    return {
      message: `${images.length} image(s) deleted successfully`,
      deletedCount: images.length,
    };
  }

  /**
   * Get product images by variant ID
   * @param {string} variantId - Product variant ID
   */
  static async getProductImagesByVariant(variantId) {
    const images = await ProductImage.find({ variant_id: variantId }).sort({ sort_order: 1 });

    return images.map((img) => ({
      id: img._id,
      url: img.image_url,
      altText: img.alt_text,
      sortOrder: img.sort_order,
    }));
  }

  /**
   * Update product image sort order
   * @param {string} imageId - Product image ID
   * @param {number} newSortOrder - New sort order
   */
  static async updateImageSortOrder(imageId, newSortOrder) {
    const productImage = await ProductImage.findById(imageId);

    if (!productImage) {
      throw new Error('Image not found');
    }

    productImage.sort_order = newSortOrder;
    await productImage.save();

    return {
      id: productImage._id,
      sortOrder: productImage.sort_order,
    };
  }

  /**
   * Update product image alt text
   * @param {string} imageId - Product image ID
   * @param {string} altText - New alt text
   */
  static async updateImageAltText(imageId, altText) {
    const productImage = await ProductImage.findById(imageId);

    if (!productImage) {
      throw new Error('Image not found');
    }

    productImage.alt_text = altText;
    await productImage.save();

    return {
      id: productImage._id,
      altText: productImage.alt_text,
    };
  }

  /**
   * Reorder product images for a variant
   * @param {string} variantId - Product variant ID
   * @param {Array<{id: string, sortOrder: number}>} imageOrders - Array of image IDs with new sort orders
   */
  static async reorderImages(variantId, imageOrders) {
    const images = await ProductImage.find({ variant_id: variantId });

    if (images.length === 0) {
      throw new Error('No images found for this variant');
    }

    // Update sort orders
    const updatePromises = imageOrders.map((order) => {
      return ProductImage.findByIdAndUpdate(
        order.id,
        { sort_order: order.sortOrder },
        { new: true },
      );
    });

    await Promise.all(updatePromises);

    // Return updated images
    const updatedImages = await ProductImage.find({ variant_id: variantId }).sort({
      sort_order: 1,
    });

    return updatedImages.map((img) => ({
      id: img._id,
      url: img.image_url,
      altText: img.alt_text,
      sortOrder: img.sort_order,
    }));
  }
}

export default UploadService;
