import Address from '../models/address.js';
import logger from '../logger.js';

// Get all addresses for a user
export const getAddresses = async (userId) => {
  try {
    const addresses = await Address.find({
      user: userId,
      deleted: false,
    }).sort({ isDefault: -1, createdAt: -1 });

    return addresses;
  } catch (error) {
    logger.error(error);
    throw new Error('Không thể lấy danh sách địa chỉ');
  }
};

// Get a single address by ID
export const getAddressById = async (userId, addressId) => {
  try {
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
      deleted: false,
    });

    if (!address) {
      throw new Error('Địa chỉ không tồn tại!');
    }

    return address;
  } catch (error) {
    logger.error(error);
    throw new Error('Không thể lấy địa chỉ');
  }
};

// Validate phone number (Vietnamese format)
const validatePhone = (phone) => {
  // Remove all spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // Vietnamese phone format: 10 digits starting with 0, or 11 digits starting with 84
  const phoneRegex = /^(0[3|5|7|8|9][0-9]{8}|84[3|5|7|8|9][0-9]{8})$/;

  return phoneRegex.test(cleanPhone);
};

// Create a new address
export const createAddress = async (userId, addressData) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      country,
      addressType,
      isDefault,
    } = addressData;

    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !city || !province) {
      throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }

    // Validate phone number
    if (!validatePhone(phone)) {
      throw new Error('Số điện thoại không hợp lệ!');
    }

    // Validate full name length
    if (fullName.length < 2 || fullName.length > 100) {
      throw new Error('Họ tên phải từ 2 đến 100 ký tự!');
    }

    // Validate address type
    if (addressType && !['shipping', 'billing', 'both'].includes(addressType)) {
      throw new Error('Loại địa chỉ không hợp lệ!');
    }

    // Check if this is the first address - make it default
    const existingAddressCount = await Address.countDocuments({
      user: userId,
      deleted: false,
    });

    const shouldBeDefault = existingAddressCount === 0 || isDefault === true;

    // Create address
    const address = await Address.create({
      user: userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      country: country || 'Vietnam',
      addressType: addressType || 'both',
      isDefault: shouldBeDefault,
    });

    return address;
  } catch (error) {
    logger.error(error);
    throw new Error('Không thể tạo địa chỉ');
  }
};

// Update an address
export const updateAddress = async (userId, addressId, updateData) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      country,
      addressType,
      isDefault,
    } = updateData;

    // Find the address
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
      deleted: false,
    });

    if (!address) {
      throw new Error('Địa chỉ không tồn tại!');
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      throw new Error('Số điện thoại không hợp lệ!');
    }

    // Validate full name length if provided
    if (fullName && (fullName.length < 2 || fullName.length > 100)) {
      throw new Error('Họ tên phải từ 2 đến 100 ký tự!');
    }

    // Validate address type if provided
    if (addressType && !['shipping', 'billing', 'both'].includes(addressType)) {
      throw new Error('Loại địa chỉ không hợp lệ!');
    }

    // Update fields
    if (fullName !== undefined) address.fullName = fullName;
    if (phone !== undefined) address.phone = phone;
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city !== undefined) address.city = city;
    if (province !== undefined) address.province = province;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (addressType !== undefined) address.addressType = addressType;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    return address;
  } catch (error) {
    logger.error(error);
    throw new Error('Không thể cập nhật địa chỉ');
  }
};

// Delete an address (soft delete)
export const deleteAddress = async (userId, addressId) => {
  try {
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
      deleted: false,
    });

    if (!address) {
      throw new Error('Địa chỉ không tồn tại!');
    }

    // Soft delete
    address.deleted = true;
    address.deletedAt = new Date();

    // If this was the default address, make another address default
    if (address.isDefault) {
      address.isDefault = false;
      await address.save();

      // Find another address to make default
      const newDefaultAddress = await Address.findOne({
        user: userId,
        deleted: false,
        _id: { $ne: addressId },
      }).sort({ createdAt: -1 });

      if (newDefaultAddress) {
        newDefaultAddress.isDefault = true;
        await newDefaultAddress.save();
      }
    } else {
      await address.save();
    }

    return true;
  } catch (error) {
    logger.error(error);
    throw new Error('Không thể xóa địa chỉ');
  }
};

// Set an address as default
export const setDefaultAddress = async (userId, addressId) => {
  try {
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
      deleted: false,
    });

    if (!address) {
      throw new Error('Địa chỉ không tồn tại!');
    }

    // The pre-save middleware will handle removing default from other addresses
    address.isDefault = true;
    await address.save();

    return address;
  } catch (error) {
    logger.error(error);
    throw new Error('Không thể đặt địa chỉ mặc định');
  }
};

// Get default address
export const getDefaultAddress = async (userId) => {
  try {
    const address = await Address.findOne({
      user: userId,
      deleted: false,
      isDefault: true,
    });

    return address;
  } catch (error) {
    logger.error(error);
    throw new Error('Không thể lấy địa chỉ mặc định');
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
