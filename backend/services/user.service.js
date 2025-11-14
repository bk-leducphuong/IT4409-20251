import User from '../models/user.js';
import validator from 'validator';

export const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    return user;
  } catch (error) {
    throw new Error('Không thể lấy thông tin người dùng');
  }
};

export const updateProfile = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate
      (userId, updateData, { new: true }).select('-password');
    return updatedUser;
  } catch (error) {
    throw new Error('Không thể cập nhật thông tin người dùng');
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    if (!currentPassword || !newPassword) {
      throw new Error('Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới');
    }
    if(!newPassword || newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự'); 
    }
    const user = await User.findById(userId);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không đúng');
    }
    user.password = newPassword;
    await user.save();

  } catch (error) {
    throw new Error('Không thể đổi mật khẩu');
  }
};

// Lấy tất cả users 
export const getAllUsers = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    role = '',
    status = ''
  } = query;

  // Build filter
  const filter = { deleted: false, role: 'customer' };

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (status) {
    filter.status = status;
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Query
  const users = await User.find(filter)
    .select('-password -token')
    .limit(Number(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: Number(limit)
    }
  };
};

export const getAdmins = async () => {
  const admins = await User.find({ role: 'admin', deleted: false })
    .select('-password -token');
  return admins;
};

// Tạo user mới 
export const createUser = async (userData) => {
  const { fullName, email, password, phone, role } = userData;

  // Validate
  if (!fullName || !email || !password) {
    throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc!');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Email không hợp lệ!');
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
  }

  // Kiểm tra email đã tồn tại
  const existingUser = await User.findOne({ email, deleted: false });
  if (existingUser) {
    throw new Error('Email đã được sử dụng!');
  }

  // Tạo user
  const user = await User.create({
    fullName,
    email,
    password,
    phone,
    role: role || 'customer',
  });

  return user;
};

// Lấy user theo ID 
export const getUserById = async (userId) => {
  const user = await User.findOne({ 
    _id: userId, 
    deleted: false 
  }).select('-password -token');

  if (!user) {
    throw new Error('User không tồn tại!');
  }

  return user;
};

// Cập nhật user theo ID
export const updateUserById = async (userId, updateData) => {
  const { fullName, phone, avatar, status, role } = updateData;

  // Tìm user
  const user = await User.findOne({ _id: userId, deleted: false });
  if (!user) {
    throw new Error('User không tồn tại!');
  }

  // Cập nhật các field được phép
  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;
  if (status) user.status = status;
  if (role) user.role = role;

  await user.save();

  return user;
};

// Xóa user theo ID - Soft delete 
export const deleteUserById = async (userId) => {
  const user = await User.findOne({ _id: userId, deleted: false });
  if (!user) {
    throw new Error('User không tồn tại!');
  }

  // Soft delete
  user.deleted = true;
  user.deletedAt = new Date();
  user.token = null; // Clear token
  await user.save();

  return true;
};

export default {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getAdmins
};
