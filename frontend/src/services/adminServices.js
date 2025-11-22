import apiFetch from '../libs/apiFetch';

/* USER MANAGEMENT */

export const getUsers = async () => {
  return await apiFetch('/users.json', { method: 'GET' });
};

export const createUser = async (user) => {
  return await apiFetch('/users.json', { method: 'POST', body: JSON.stringify(user) });
};

export const getAdmins = async () => {
  return await apiFetch('/admins.json', { method: 'GET' });
};

export const getUserById = async (id) => {
  return await apiFetch(`/users/${id}.json`, { method: 'GET' });
};

export const updateUser = async (id, user) => {
  return await apiFetch(`/users/${id}.json`, { method: 'PATCH', body: JSON.stringify(user) });
};

export const deleteUser = async (id) => {
  return await apiFetch(`/users/${id}.json`, { method: 'DELETE' });
};

/* PRODUCT */
