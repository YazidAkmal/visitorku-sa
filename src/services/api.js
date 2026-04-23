export const BASE_URL = 'https://visitorku.io/api-stg-su';

export const apiClient = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}/admin`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Token expired atau tidak valid. Silakan login ulang.");
      sessionStorage.removeItem('token');
    }
    throw new Error(result.message || 'Terjadi kesalahan pada server');
  }

  return result;
};