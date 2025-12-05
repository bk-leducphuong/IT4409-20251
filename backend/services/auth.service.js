import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import crypto from 'crypto';
import emailService from '../libs/email.js';

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

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email, deleted: false });
  if (!user) {
    throw new Error('Email không tồn tại trong hệ thống');
  }

  // Tạo OTP 6 chữ số
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

  // Lưu OTP hash vào database (hết hạn trong 5 phút)
  user.resetPasswordToken = otpHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 5 * 1000)
  await user.save();

  // Gửi email chứa OTP (plain + html)
  await emailService.sendResetPasswordEmail(user.email, user.fullName, otp);

  return { message: 'OTP đã được gửi vào email. Vui lòng kiểm tra và nhập OTP.' };
};

// Verify OTP (returns a short-lived reset session token)
export const verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email, deleted: false });
  if (!user) {
    throw new Error('Email không tồn tại');
  }
  if (!user.resetPasswordToken || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new Error('OTP đã hết hạn hoặc không tồn tại. Vui lòng gửi lại yêu cầu.');
  }

  const otpHash = crypto.createHash('sha256').update(String(otp)).digest('hex');
  if (otpHash !== user.resetPasswordToken) {
    throw new Error('OTP không hợp lệ');
  }

  // Tạo reset session token (dùng để xác thực việc đổi mật khẩu) - ngắn hạn
  const resetSessionToken = jwt.sign({ id: user._id, purpose: 'password-reset' }, process.env.JWT_SECRET, {
    expiresIn: process.env.RESET_SESSION_EXPIRE || '15m',
  });

  // Optionally clear resetPasswordToken to prevent reuse (or keep until reset)
  // user.resetPasswordToken = null;
  // user.resetPasswordExpires = null;
  // await user.save();

  return { resetSessionToken };
};

export const resetPassword = async (token, newPassword) => {
  // token here is the resetSessionToken (JWT)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Token reset không hợp lệ hoặc đã hết hạn');
  }
  if (!decoded || decoded.purpose !== 'password-reset' || !decoded.id) {
    throw new Error('Token reset không hợp lệ');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new Error('Người dùng không tồn tại');

  // Validate mật khẩu mới
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  // Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu và xoá token OTP
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return { message: 'Mật khẩu đã được thay đổi thành công' };
};

export default {
  register,
  login,
  getUserByToken,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
