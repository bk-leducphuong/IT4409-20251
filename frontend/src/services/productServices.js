import apiFetch from '../libs/apiFetch';

export const getProducts = async (
  category = null,
  brand = null,
  search = null,
  sort_by = 'newest',
  page = 1,
  limit = 20,
) => {
  return await apiFetch('/products', {
    method: 'GET',
    body: JSON.stringify({ category, brand, search, sort_by, page, limit }),
  });
};

export const getProductBySlug = async (slug) => {
  if (!slug) throw new Error('All feild are required!');

  return await apiFetch(`/products/${slug}`, { method: 'GET' });
};
