export const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

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
    ...(options.body ? { body: options.body } : {}),
  })

  const textResult = await response.text()
  let result
  try {
    result = textResult ? JSON.parse(textResult) : {}
  } catch (error) {
    result = { message: textResult || 'Terjadi kesalahan tidak terduga pada server.' }
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Token expired atau tidak valid. Silakan login ulang.')
      localStorage.removeItem('token')
    }
    throw new Error(result.message || result.error || 'Terjadi kesalahan pada server')
  }

  return result
}
