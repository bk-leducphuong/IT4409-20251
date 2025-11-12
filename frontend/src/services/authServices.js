const TOKEN_NAME = 'token';
const setToken = (token) => localStorage.setItem(TOKEN_NAME, token);
export const getToken = () => localStorage.getItem(TOKEN_NAME);
export const resetToken = () => localStorage.getItem(TOKEN_NAME, '');

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

  const res = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName,
      email,
      password,
      phone,
    }),
  }).then((res) => res.json());

  if (res.success) {
    setToken(res.data.token);
  } else {
    throw new Error(res.message);
  }
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

  const res = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());

  if (res.success) {
    setToken(res.data.token);
  } else {
    throw new Error(res.message);
  }
};

export const validateToken = async () => {
  const token = getToken();

  if (!token) throw new Error('Vui lòng đăng nhập để tiếp tục!');

  const res = await fetch('http://localhost:5001/api/user/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  if (!res.success) {
    throw new Error(res.message);
  }
};
