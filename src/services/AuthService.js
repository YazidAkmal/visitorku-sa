const BASE_URL = 'https://visitorku.io/api-stg-su';

export const AuthService = {
  
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Email atau Password salah.');
    }

    return result;
  },

  async checkPassword(password) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/check-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Verifikasi password gagal.');
    }
    return result;
  }
};