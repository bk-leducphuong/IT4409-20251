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

// PATCH /api/user/profile - Cập nhật thông tin profile người dùng
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

// PATCH /api/user/profile/change-password - Đổi mật khẩu người dùng
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

// GET /api/user - Lấy tất cả users 
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách users thành công!',
      data: result
    });

  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/user/admin - Lấy tất cả admins
export const getAdmins = async (req, res, next) => {
  try {
    const admins = await userService.getAdmins();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách admin thành công!',
      data: { admins }
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// POST /api/users/ - Tạo user mới
export const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role} = req.body;

    const user = await userService.createUser({
      fullName,
      email,
      password,
      phone,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công!',
      data: { user }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/users/:id - Lấy user theo ID 
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin user thành công!',
      data: { user }
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/users/:id - Cập nhật user theo ID 
export const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { fullName, phone, avatar, status, role, address} = req.body;

    const user = await userService.updateUserById(userId, {
      fullName,
      phone,
      avatar,
      status,
      role,
      address
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công!',
      data: { user }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /api/users/:id - Xóa user theo ID (Admin)
export const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Không cho phép admin xóa chính mình
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể xóa chính mình!'
      });
    }

    await userService.deleteUserById(userId);

    res.status(200).json({
      success: true,
      message: 'Xóa user thành công!'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
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
