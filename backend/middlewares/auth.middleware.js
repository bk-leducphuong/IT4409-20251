import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Middleware yêu cầu đăng nhập
export const requireLogin = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục!',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user từ token
    const user = await User.findOne({
      _id: decoded.id,
      token,
      deleted: false,
      status: 'active',
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc user không tồn tại!',
      });
    }

    // Gắn user vào request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn!',
    });
  }
};

// Middleware yêu cầu quyền (role)
export const requireRole = (...roles) => {
  return (req, res, next) => {
    // Kiểm tra xem đã đăng nhập chưa (req.user phải tồn tại)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập trước!',
      });
    }

    // Kiểm tra role của user
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Chỉ ${roles.join(', ')} mới có quyền truy cập!`,
      });
    }

    next();
  };
};

// Alias for requireLogin (for consistency with other projects)
export const authenticateToken = requireLogin;
