import apiFetch from '../libs/apiFetch';
import { setToken, getToken, resetToken } from '../libs/storage';

export const signUp = async (fullName, email, password, phone) => {
  if (!phone || !email || !password) throw new Error('All feilds are required!');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter valid email!');

  if (!/^[0-9]{10,}$/.test(phone))
    throw new Error('Please enter valid phone number! Containing 10 digits!');

  if (!/^[a-zA-Z0-9]{8,}$/.test(password))
    throw new Error('Password must contain at least 8 characters including letters and numbers!');

  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName,
      email,
      password,
      phone,
    }),
  });

  setToken(res.data.token);
  return res;
};

export const login = async (email, password) => {
  if (!email || !password) throw new Error('All feilds are required!');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter valid email!');

  if (!/^[a-zA-Z0-9]{8,}$/.test(password))
    throw new Error('Password must contain at least 8 characters including letters and numbers!');

  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(res.data.token);
  return res;
};

export const logout = async () => {
  if (!getToken()) throw new Error("You haven' login yet!");

  const res = await apiFetch('/auth/logout', { method: 'POST' });

  resetToken();

  return res;
};

export const forgotPassword = async (email) => {
  if (!email) throw new Error('All feilds are required!');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter valid email!');

  return await apiFetch(
    '/auth/forgot-password',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
    3,
    10000,
  ); // expectionally 10s timeout
};

export const verifyOtp = async (email, otp) => {
  if (!email || !otp) throw new Error('All feilds are required!');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter valid email!');
  if (!/^[0-9]{6}$/.test(otp)) throw new Error('Please enter valid otp!');

  return await apiFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  if (!token || !newPassword || !confirmPassword) throw new Error('All feilds are required!');
  if (!/^[a-zA-Z0-9]{8,}$/.test(newPassword))
    throw new Error('Password must contain at least 8 characters including letters and numbers!');
  if (newPassword !== confirmPassword) throw new Error('Password does not match!');

  return await apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });
};

export { resetToken, getToken } from '../libs/storage';
