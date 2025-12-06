import UploadService from '../services/upload.service.js';

/**
 * Upload Controller
 */
class UploadController {
  /**
   * Upload multiple product images
   * @route POST /api/upload/products/:variantId
   */
  static async uploadProductImages(req, res) {
    try {
      const { variantId } = req.params;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
      }

      const images = await UploadService.uploadProductImages(files, variantId);

      res.status(201).json({
        success: true,
        message: 'Images uploaded successfully',
        data: images,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload images',
      });
    }
  }

  /**
   * Upload single product image
   * @route POST /api/upload/product/:variantId
   */
  static async uploadSingleProductImage(req, res) {
    try {
      const { variantId } = req.params;
      const { sortOrder } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const image = await UploadService.uploadSingleProductImage(
        file,
        variantId,
        sortOrder ? parseInt(sortOrder) : 0,
      );

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: image,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload image',
      });
    }
  }

  /**
   * Upload avatar
   * @route POST /api/upload/avatar
   */
  static async uploadAvatar(req, res) {
    try {
      const userId = req.user.id; // Assuming user ID is set by auth middleware
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const result = await UploadService.uploadAvatar(file, userId);

      res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload avatar',
      });
    }
  }

  /**
   * Delete product image
   * @route DELETE /api/upload/product-image/:imageId
   */
  static async deleteProductImage(req, res) {
    try {
      const { imageId } = req.params;

      const result = await UploadService.deleteProductImage(imageId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete image',
      });
    }
  }

  /**
   * Delete multiple product images
   * @route DELETE /api/upload/product-images
   */
  static async deleteProductImages(req, res) {
    try {
      const { imageIds } = req.body;

      if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Image IDs array is required',
        });
      }

      const result = await UploadService.deleteProductImages(imageIds);

      res.status(200).json({
        success: true,
        message: result.message,
        data: { deletedCount: result.deletedCount },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete images',
      });
    }
  }

  /**
   * Get product images by variant
   * @route GET /api/upload/products/:variantId/images
   */
  static async getProductImagesByVariant(req, res) {
    try {
      const { variantId } = req.params;

      const images = await UploadService.getProductImagesByVariant(variantId);

      res.status(200).json({
        success: true,
        data: images,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get images',
      });
    }
  }

  /**
   * Update image sort order
   * @route PATCH /api/upload/product-image/:imageId/sort-order
   */
  static async updateImageSortOrder(req, res) {
    try {
      const { imageId } = req.params;
      const { sortOrder } = req.body;

      if (sortOrder === undefined || sortOrder === null) {
        return res.status(400).json({
          success: false,
          message: 'Sort order is required',
        });
      }

      const result = await UploadService.updateImageSortOrder(imageId, parseInt(sortOrder));

      res.status(200).json({
        success: true,
        message: 'Sort order updated successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update sort order',
      });
    }
  }

  /**
   * Update image alt text
   * @route PATCH /api/upload/product-image/:imageId/alt-text
   */
  static async updateImageAltText(req, res) {
    try {
      const { imageId } = req.params;
      const { altText } = req.body;

      if (!altText) {
        return res.status(400).json({
          success: false,
          message: 'Alt text is required',
        });
      }

      const result = await UploadService.updateImageAltText(imageId, altText);

      res.status(200).json({
        success: true,
        message: 'Alt text updated successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update alt text',
      });
    }
  }

  /**
   * Reorder images
   * @route PUT /api/upload/products/:variantId/reorder
   */
  static async reorderImages(req, res) {
    try {
      const { variantId } = req.params;
      const { imageOrders } = req.body;

      if (!imageOrders || !Array.isArray(imageOrders) || imageOrders.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Image orders array is required',
        });
      }

      const images = await UploadService.reorderImages(variantId, imageOrders);

      res.status(200).json({
        success: true,
        message: 'Images reordered successfully',
        data: images,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to reorder images',
      });
    }
  }
}

export default UploadController;
