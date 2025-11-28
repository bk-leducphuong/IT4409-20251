import apiFetch from '../libs/apiFetch';

export const getCategories = async () => {
  return await apiFetch('/categories', { method: 'GET' });
};

export const getCategoryBySlug = async (slug) => {
  if (!slug) throw new Error('All feilds are required!');

  return await apiFetch(`/categories/${slug}`, { method: 'GET' });
};
