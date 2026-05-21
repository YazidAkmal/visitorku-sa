export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '' // Kasih fallback kosong jaga-jaga

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: headers,
    ...(options.body ? { body: options.body } : {}), // 🌟 Masukkan data body jika ada (Penting untuk Login/POST!)
  })

  // 3. Sistem Anti-Crash (Mencegah "Unexpected end of JSON input" kalau server mengembalikan halaman HTML 404)
  const textResult = await response.text()
  let result
  try {
    result = textResult ? JSON.parse(textResult) : {}
  } catch (error) {
    result = { message: textResult || 'Terjadi kesalahan tidak terduga pada server.' }
  }

  // 4. Handle Error Response
  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Token expired atau tidak valid. Silakan login ulang.')
      localStorage.removeItem('token')
      // Opsional: Bawa user kembali ke halaman login di sini jika perlu
    }
    throw new Error(result.message || result.error || 'Terjadi kesalahan pada server')
  }

  return result
}
