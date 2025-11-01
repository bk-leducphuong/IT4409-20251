import userService from '../services/user.service.js';
import {errorHandler} from '../middlewares/error.middleware.js';

// GET /api/user/profile - Lấy thông tin profile người dùng
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // lấy ID từ token
    const user = await userService.getProfile(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // lấy ID từ token
    const allowedFields = ['fullName', 'email', 'phone', 'address', 'avatar'];

    const bodyKeys = Object.keys(req.body);
    const invalidFields = bodyKeys.filter(key => !allowedFields.includes(key));

    // Nếu có trường không hợp lệ → báo lỗi
    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Các trường không được phép cập nhật: ${invalidFields.join(', ')}`
      });
    }

    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    const updatedUser = await userService.updateProfile(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: { user: updatedUser },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;
  try {
    await userService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
}

export default {
  getProfile,
  updateProfile,
  changePassword,
};
