import { useAuthStore } from '../stores/authStore';
import apiFetch from '../libs/apiFetch';

export const getProfile = async () => {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('Vui lòng đăng nhập để tiếp tục!');

  const res = await apiFetch('/user/profile', {
    method: 'GET',
  });

  return res;
};
