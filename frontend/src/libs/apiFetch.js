import { getToken } from './storage';

const BASE_URL = import.meta.env.VITE_API_URL;

async function apiFetch(url, options = {}, retries = 3, timeout = 3000) {
  /* REQUEST INTERCEPTOR */
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  /* REQUEST AND RETRY WITH TIMEOUT */
  async function trueFetch(tried) {
    try {
      const response = await Promise.race([
        fetch(BASE_URL + '/api' + url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ${options.method} ${url}`)), timeout),
        ),
      ]);

      /* RESPONSE INTERCEPTOR */
      let res;
      try {
        res = await response.json();
      } catch {
        return null;
      }

      if (!res.success) {
        throw new Error(res.message || 'Lỗi không xác định!');
      }

      return res;
    } catch (err) {
      if (tried < retries) {
        return trueFetch(tried + 1);
      }
      console.error(err);
      throw err;
    }
  }

  return await trueFetch(0);
}

export default apiFetch;
