import authService from '../services/auth.service.js';
import emailService from '../libs/email.js';

// POST /api/auth/register - Đăng ký
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Validate đầu vào
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc!',
      });
    }

    // Gọi service đăng ký
    const result = await authService.register({
      fullName,
      email,
      password,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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
        message: 'Vui lòng nhập email và mật khẩu!',
      });
    }

    // Gọi service đăng nhập
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
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
      message: 'Đăng xuất thành công!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ...existing code...
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
    }

    const result = await authService.forgotPassword(email);
    res.json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// New: verify OTP -> returns resetSessionToken
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email và OTP là bắt buộc' });

    const result = await authService.verifyOtp(email, otp);
    res.json({ success: true, message: 'OTP hợp lệ', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp' });
    }

    const result = await authService.resetPassword(token, newPassword);
    res.json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export default {
  register,
  login,
  // getProfile,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
