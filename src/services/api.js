// src/services/api.js

export const BASE_URL = 'https://visitorku.io/api-stg-su';

/**
 * Fungsi pembantu (wrapper) untuk melakukan HTTP Request.
 * Ini otomatis menyisipkan Token JWT jika user sudah login.
 */
export const apiClient = async (endpoint, options = {}) => {
  // 1. Ambil token dari brankas lokal
  const token = localStorage.getItem('token');

  // 2. Siapkan header default
  const headers = {
    'Content-Type': 'application/json',
    // Kalau token ada, otomatis tempelkan di header
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // 3. Eksekusi fetch ke server
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  // 4. Tangani jika ada error dari backend
  if (!response.ok) {
    // Bisa tambahkan logika logout otomatis jika token expired (status 401)
    if (response.status === 401) {
      console.warn("Token expired atau tidak valid. Silakan login ulang.");
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Opsional: paksa pindah ke halaman login
    }
    throw new Error(result.message || 'Terjadi kesalahan pada server');
  }

  return result;
};