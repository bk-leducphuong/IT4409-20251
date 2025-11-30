import apiFetch from '../libs/apiFetch';

export const getWishlist = async () => {
  return await apiFetch('/wishlist', { method: 'GET' });
};

export const addItemToWishlist = async (productId) => {
  if (!productId) throw new Error('All feilds are required!');

  return await apiFetch('/wishlist/items', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId }),
  });
};

export const deleteItemFromWishlist = async (productId) => {
  if (!productId) throw new Error('All feilds are required!');

  return await apiFetch(`/wishlist/items/${productId}`, { method: 'DELETE' });
};

export const itemInWishList = async (productId) => {
  if (!productId) throw new Error('All feilds are required!');

  return await apiFetch(`/wishlist/check/${productId}`, { method: 'GET' });
};
