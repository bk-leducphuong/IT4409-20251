import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

// Tạo JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Đăng ký
export const register = async (userData) => {
  const { fullName, email, password, phone } = userData;

  // Validate email
  if (!validator.isEmail(email)) {
    throw new Error('Email không hợp lệ!');
  }

  // Validate password
  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
  }

  // Kiểm tra email đã tồn tại
  const existingUser = await User.findOne({ email, deleted: false });
  if (existingUser) {
    throw new Error('Email đã được sử dụng!');
  }
  // Kiểm tra số điện thoại có 10 chữ số
  if (!validator.isMobilePhone(phone, 'vi-VN')) {
    throw new Error('Số điện thoại không hợp lệ!');
  }
  // Hash mật khẩu **tại service**
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role: 'customer',
    status: 'active',
  });

  // Tạo token
  const token = generateToken(user._id);

  // Lưu token vào database
  user.token = token;
  await user.save();

  return {
    user: user.toJSON(),
    token,
  };
};

// Đăng nhập
export const login = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new Error('Vui lòng nhập email và mật khẩu!');
  }
  // Tìm user
  const user = await User.findOne({
    email,
    deleted: false,
    status: 'active',
  }).select('+password');
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng!');
  }

  // So sánh password **dùng bcrypt trực tiếp**
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Email hoặc mật khẩu không đúng!');
  }

  // Tạo token mới
  const token = generateToken(user._id);

  // Cập nhật token
  user.token = token;
  await user.save();

  return {
    user: user.toJSON(),
    token,
  };
};

// Lấy thông tin user từ token
export const getUserByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      token,
      deleted: false,
      status: 'active',
    });

    if (!user) {
      throw new Error('User không tồn tại!');
    }

    return user;
  } catch (error) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn!');
  }
};

// Đăng xuất
export const logout = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User không tồn tại!');
  }

  user.token = null;
  await user.save();

  return true;
};

export default {
  register,
  login,
  getUserByToken,
  logout,
};
