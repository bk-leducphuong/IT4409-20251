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

export { resetToken, getToken } from '../libs/storage';
