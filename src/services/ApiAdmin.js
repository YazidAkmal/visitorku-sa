const BASE_URL = 'https://visitorku.io/api-stg-su';

export const ApiAdmin = {
  async getAdmins() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/admin`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal memuat data admin');
    return result;
  },

  async createAdmin(data) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menambah admin');
    return result;
  },

  async updateAdmin(id, data) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengupdate admin');
    return result;
  },

  async deleteAdmin(id) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus admin');
    return result;
  }
};