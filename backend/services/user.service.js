import User from '../models/user.js';

export const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    return user;
  } catch (error) {
    throw new Error('Không thể lấy thông tin người dùng');
  }
};

// const updateUserProfile = async (userId, updateData) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true }
//     ).select('-password');
//     return user;
//   } catch (error) {
//     throw new Error('Không thể cập nhật thông tin người dùng');
//   }
// };

export default {
  getProfile,
  //   updateUserProfile
};
