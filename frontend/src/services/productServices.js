import apiFetch from '../libs/apiFetch';

export const getProducts = async (queryObject) => {
  const param = new URLSearchParams(queryObject).toString();
  return await apiFetch(`/products?${param}`, { method: 'GET' });
};

export const getProductBySlug = async (slug) => {
  if (!slug) throw new Error('All feild are required!');

  return await apiFetch(`/products/${slug}`, { method: 'GET' });
};
