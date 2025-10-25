import authService from '../services/auth.service.js';

// POST /api/auth/register - Đăng ký
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Validate đầu vào
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc!'
      });
    }

    // Gọi service đăng ký
    const result = await authService.register({
      fullName,
      email,
      password,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: result
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// POST /api/auth/login - Đăng nhập
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate đầu vào
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu!'
      });
    }

    // Gọi service đăng nhập
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: result
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/auth/profile - Lấy thông tin user hiện tại
// export const getProfile = async (req, res, next) => {
//   try {
//     // req.user đã được set từ auth middleware
//     res.status(200).json({
//       success: true,
//       data: {
//         user: req.user
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// POST /api/auth/logout - Đăng xuất
export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công!'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  register,
  login,
  // getProfile,
  logout
};