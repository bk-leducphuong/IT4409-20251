import apiFetch from '../libs/apiFetch';

/* USER MANAGEMENT */

export const getUsers = async (page = 1, limit = 20) => {
  return await apiFetch(`/user?page=${page}&limit=${limit}`, { method: 'GET' });
};

export const createUser = async (fullName, email, password, phone, address, status = 'active') => {
  console.log({ fullName, email, password, phone, address, status });
  if (!fullName || !email || !password || !phone || !address || !status)
    throw new Error('All feilds are required!');
  if (status !== 'active' && status !== 'inactive')
    throw new Error('Incorrect status feild! Please enter "active" or "inactive"');

  return await apiFetch('/user', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, phone, address, status }),
  });
};

export const getAdmins = async () => {
  return await apiFetch('/user/admin', { method: 'GET' });
};

export const getUserById = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/user/${id}`, { method: 'GET' });
};

export const updateUser = async (id, user) => {
  if (!id || !user.fullName || !user.email || !user.phone || !user.status)
    throw new Error('All feilds are required!');
  if (user.status !== 'active' && user.status !== 'inactive')
    throw new Error('Incorrect status feild! Please enter "active" or "inactive"');

  return await apiFetch(`/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/user/${id}`, { method: 'DELETE' });
};

/* PRODUCT */

export const createProduct = async (name, slug, description, category_id, brand_id) => {
  if (!name || !slug || !description || !category_id || !brand_id)
    throw new Error('All feild are required!');

  return await apiFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify({ name, slug, description, category_id, brand_id }),
  });
};

export const updateProduct = async (id, name, slug, description, category_id, brand_id) => {
  if (!id || !name || !slug || !description || !category_id || !brand_id)
    throw new Error('All feilds are required!');

  return await apiFetch(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, slug, description, category_id, brand_id }),
  });
};

export const deleteProduct = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
};

/* PRODUCT VARIANTS */

export const createProductVariant = async (productID, variantObject) => {
  if (!productID || !variantObject) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/products/${productID}/variants`, {
    method: 'POST',
    body: JSON.stringify(variantObject),
  });
};

export const updateVariant = async (variantID, variantObject) => {
  if (!variantID || !variantObject) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/variants/${variantID}`, {
    method: 'PUT',
    body: JSON.stringify(variantObject),
  });
};

export const deleteVariant = async (variantID) => {
  if (!variantID) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/variants/${variantID}`, { method: 'DELETE' });
};

/* BRAND */

export const createBrand = async (name, logo_url) => {
  if (!name) throw new Error('All feilds are required!');

  return await apiFetch('/admin/brands', {
    method: 'POST',
    body: JSON.stringify({ name, logo_url }),
  });
};

export const updateBrand = async (id, name, logo_url) => {
  if (!id || !name) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/brands/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, logo_url }),
  });
};

export const deleteBrand = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/brands/${id}`, { method: 'DELETE' });
};

/* CATEGORY */

export const createCategory = async (name, slug, parent_category_id = null) => {
  if (!name || !slug) throw new Error('All feilds are required!');

  return await apiFetch('/admin/categories', {
    method: 'POST',
    body: JSON.stringify({ name, slug, parent_category_id }),
  });
};

export const updateCategory = async (id, name, slug, parent_category_id = null) => {
  if (!id || !name || !slug) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, slug, parent_category_id }),
  });
};

export const deleteCategory = async (id) => {
  if (!id) throw new Error('All feilds are required!');

  return await apiFetch(`/admin/catogories/${id}`, { method: 'DELETE' });
};
