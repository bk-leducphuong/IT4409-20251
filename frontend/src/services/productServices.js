import apiFetch from '../libs/apiFetch';

export const getProducts = async (queryObject) => {
  const param = new URLSearchParams(queryObject).toString();
  return await apiFetch(`/products?${param}`, { method: 'GET' });
};

export const getTrendingProducts = async (number = 20) => {
  return await apiFetch(`/products/trending?limit=${number}`, { method: 'GET' });
};

export const getProductBySlug = async (slug) => {
  if (!slug) throw new Error('All feilds are required!');

  return await apiFetch(`/products/${slug}`, { method: 'GET' });
};

export const getReviews = async (slug, queryObject) => {
  if (!slug) throw new Error('All feilds are required!');
  const param = new URLSearchParams(queryObject).toString();

  return await apiFetch(`/products/${slug}/reviews?${param}`, { method: 'GET' });
};

export const createReview = async (slug, rating, title, comment, images = []) => {
  if (!slug) throw new Error('All feilds are required!');

  return await apiFetch(`/products/${slug}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, title, comment, images }),
  });
};

export const updateReview = async (id, rating, title, comment, images = []) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ rating, title, comment, images }),
  });
};

export const deleteReview = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/reviews/${id}`, { method: 'DELETE' });
};

export const toggleHeplful = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/reviews/${id}/helpful`, { method: 'POST' });
};
