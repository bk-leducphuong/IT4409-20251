import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: { type: String, required: true, select: false },
  token: String,
  phone: String,
  address: String,
  avatar: String,
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
},
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema, 'users');

export default User;
