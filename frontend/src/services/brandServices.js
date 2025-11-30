import apiFetch from '../libs/apiFetch';

export const getBrands = async () => {
  return await apiFetch('/brands', { method: 'GET' });
};

export const getBrandByID = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/brands/${id}`, { method: 'GET' });
};
