const TOKEN_NAME = 'token';
export const setToken = (token) => localStorage.setItem(TOKEN_NAME, token);
export const getToken = () => localStorage.getItem(TOKEN_NAME);
export const resetToken = () => localStorage.removeItem(TOKEN_NAME);

const PREVIOUS_SITE = 'previous_site';
export const setPreviousSite = (site) => sessionStorage.setItem(PREVIOUS_SITE, site);
export const getPreviousSite = () => sessionStorage.getItem(PREVIOUS_SITE);
export const clearPreviousSite = () => sessionStorage.removeItem(PREVIOUS_SITE);

const LOGIN_ATTEMPTS = 'login_attempts';

export const getLoginAttempts = () => Number(localStorage.getItem(LOGIN_ATTEMPTS) || 0);
export const setLoginAttempts = (attempts) =>
  localStorage.setItem(LOGIN_ATTEMPTS, String(attempts));
export const clearLoginAttempts = () => localStorage.removeItem(LOGIN_ATTEMPTS);
