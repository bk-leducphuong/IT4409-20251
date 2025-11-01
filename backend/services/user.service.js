import User from '../models/user.js';

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

export default {
  getProfile,
  updateProfile,
  changePassword,
};
