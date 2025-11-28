import { getToken } from './authServices';
import apiFetch from '../libs/apiFetch';

export const getProfile = async () => {
  const token = getToken();
  if (!token) throw new Error('Vui lòng đăng nhập để tiếp tục!');

  const res = await apiFetch('/user/profile', {
    method: 'GET',
  });

  return res;
};

export const updateUser = async (user) => {
  return await apiFetch('/user/profile', {
    method: 'PATCH',
    body: JSON.stringify(user),
  });
};

export const changePassword = async (currentPassword, newPassword) => {
  if (!currentPassword) throw new Error('Password must not be empty!');
  if (!newPassword) throw new Error('New password must not be empty!');

  return await apiFetch('/user/profile/change-pssword', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};
