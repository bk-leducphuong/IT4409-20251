import apiFetch from '../libs/apiFetch';

export const getCart = async () => {
  return await apiFetch('/cart', { method: 'GET' });
};

export const addItem = async (itemId, quantity) => {
  if (!itemId) throw new Error('All feilds are required');

  return await apiFetch('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ product_variant_id: itemId, quantity }),
  });
};

export const updateQuantity = async (itemId, quantity) => {
  if (!itemId || !quantity) throw new Error('All feilds are required');

  return await apiFetch(`/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
};

export const deleteItem = async (itemId) => {
  return await apiFetch(`/cart/items/${itemId}`, { method: 'DELETE' });
};
