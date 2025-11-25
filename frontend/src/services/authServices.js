import apiFetch from '../libs/apiFetch';

const TOKEN_NAME = 'token';
const setToken = (token) => localStorage.setItem(TOKEN_NAME, token);
export const getToken = () => localStorage.getItem(TOKEN_NAME);
export const resetToken = () => localStorage.setItem(TOKEN_NAME, '');

export const signUp = async (fullName, email, password, phone) => {
  if (!phone || !email || !password) {
    throw new Error('Hãy nhập các mục yêu cầu!');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Hãy nhập Email hợp lệ!');
  }

  if (!/^[0-9]{10,}$/.test(phone)) {
    throw new Error('Hãy nhập số điện thoại hợp lệ! Gồm 10 chữ số!');
  }

  if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
    throw new Error('Mật khẩu cần có ít nhất 8 kí tự bao gồm cả chữ cái và chữ số!');
  }

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
  if (!email || !password) {
    throw new Error('Hãy nhập các mục yêu cầu!');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Hãy nhập Email hợp lệ!');
  }

  if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
    throw new Error('Mật khẩu cần có ít nhất 8 kí tự bao gồm cả chữ cái và chữ số!');
  }

  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(res.data.token);
  return res;
};

export const logout = async () => {
  if (!getToken()) throw new Error('Bạn chưa đăng nhập!');

  const res = await apiFetch('/auth/logout', { method: 'POST' });

  return res;
};
