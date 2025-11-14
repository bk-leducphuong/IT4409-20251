import { useAuthStore } from '../stores/authStore';

export const getProfile = async () => {
  const token = useAuthStore.getState().token;

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

  return res.data;
};
