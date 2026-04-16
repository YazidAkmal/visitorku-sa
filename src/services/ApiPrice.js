const BASE_URL = 'https://visitorku.io/api-stg-su';

export const ApiPrice = {
  // Ambil Semua Paket
  async getAllPrices() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/price`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal memuat paket');
    return result;
  },

  // Buat Paket Baru
  async createPrice(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/price`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal membuat paket');
    return result;
  },

  // Update Paket
  async updatePrice(id, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/price/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengupdate paket');
    return result;
  },

  // Hapus Paket
  async deletePrice(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/price/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus paket');
    return result;
  }
};