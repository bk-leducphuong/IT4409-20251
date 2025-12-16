import addressService from '../services/address.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// GET /api/user/addresses - Get all addresses for the current user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await addressService.getAddresses(userId);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách địa chỉ thành công',
      data: { addresses },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/user/addresses/:id - Get a single address by ID
export const getAddressById = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    const address = await addressService.getAddressById(userId, addressId);

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin địa chỉ thành công',
      data: { address },
    });
  } catch (error) {
    const statusCode = error.message === 'Địa chỉ không tồn tại!' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/user/addresses - Create a new address
export const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressData = req.body;

    const address = await addressService.createAddress(userId, addressData);

    res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: { address },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/user/addresses/:id - Update an address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;
    const updateData = req.body;

    const address = await addressService.updateAddress(userId, addressId, updateData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: { address },
    });
  } catch (error) {
    const statusCode = error.message === 'Địa chỉ không tồn tại!' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/user/addresses/:id - Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    await addressService.deleteAddress(userId, addressId);

    res.status(200).json({
      success: true,
      message: 'Xóa địa chỉ thành công',
    });
  } catch (error) {
    const statusCode = error.message === 'Địa chỉ không tồn tại!' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/user/addresses/:id/default - Set an address as default
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    const address = await addressService.setDefaultAddress(userId, addressId);

    res.status(200).json({
      success: true,
      message: 'Đặt địa chỉ mặc định thành công',
      data: { address },
    });
  } catch (error) {
    const statusCode = error.message === 'Địa chỉ không tồn tại!' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/user/addresses/default - Get default address
export const getDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await addressService.getDefaultAddress(userId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ mặc định',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy địa chỉ mặc định thành công',
      data: { address },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
};
