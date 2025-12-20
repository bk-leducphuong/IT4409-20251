import { upload, MAX_IMAGES } from '../configs/upload.js';

/**
 * Middleware for handling single image upload
 * @param {string} fieldName - The name of the form field
 */
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 5MB.',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading file.',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded.',
        });
      }

      next();
    });
  };
};

/**
 * Middleware for handling multiple image uploads
 * @param {string} fieldName - The name of the form field
 * @param {number} maxCount - Maximum number of files allowed
 */
export const uploadMultiple = (fieldName, maxCount = MAX_IMAGES.PRODUCTS) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'One or more files exceed the size limit of 5MB.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `Too many files. Maximum allowed is ${maxCount}.`,
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading files.',
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded.',
        });
      }

      next();
    });
  };
};

/**
 * Middleware for handling optional single image upload
 * @param {string} fieldName - The name of the form field
 */
export const uploadSingleOptional = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 5MB.',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading file.',
        });
      }

      // Continue even if no file is uploaded
      next();
    });
  };
};

/**
 * Middleware for handling multiple image uploads with optional files
 * @param {string} fieldName - The name of the form field
 * @param {number} maxCount - Maximum number of files allowed
 */
export const uploadMultipleOptional = (fieldName, maxCount = MAX_IMAGES.PRODUCTS) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'One or more files exceed the size limit of 5MB.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `Too many files. Maximum allowed is ${maxCount}.`,
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading files.',
        });
      }

      // Continue even if no files are uploaded
      next();
    });
  };
};
