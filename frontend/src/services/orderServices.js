import apiFetch from '../libs/apiFetch';

export const createOrder = async (
  full_name,
  phone,
  address_line,
  city,
  postal_code,
  country,
  payment_method,
  customer_note = '',
) => {
  return await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({
      shipping_address: {
        full_name,
        phone,
        address_line,
        city,
        province: city,
        postal_code,
        country,
      },
      payment_method,
      customer_note,
    }),
  });
};

export const getOrder = async (status = '', page = 1, limit = 10) => {
  const params = new URLSearchParams({ page, limit, status }).toString();
  return await apiFetch(`/orders?${params}`, { method: 'GET' });
};

export const getOrderById = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/orders/${id}`, { method: 'GET' });
};

export const cancelOrder = async (id, reason) => {
  if (!id || !reason) throw new Error('All feilds are required!');

  return await apiFetch(`/orders/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
};
