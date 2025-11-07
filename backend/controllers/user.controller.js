import userService from '../services/user.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// GET /api/user/profile - Lấy thông tin profile người dùng
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // lấy ID từ token
    const user = await userService.getProfile(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  getProfile,
};
