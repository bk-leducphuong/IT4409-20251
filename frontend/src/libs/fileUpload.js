import { getToken } from './storage';

const BASE_URL = import.meta.env.VITE_API_URL;

async function fileUpload(url, file, timeout = 5000) {
  /* SINGULAR FILE */
  const formData = new FormData();
  formData.append('image', file);

  const response = await Promise.race([
    fetch(BASE_URL + '/api' + url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout POST ${url}`)), timeout)),
  ]);

  let res;
  try {
    res = await response.json();
  } catch {
    return null;
  }

  return res;
}

export default fileUpload;
