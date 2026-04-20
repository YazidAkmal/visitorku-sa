const BASE_URL = 'https://visitorku.io/api-stg-su';

export const ApiInvoice = {
  
// Get All Invoice
  async getAllInvoices() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/invoice`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengambil data invoice');
    return result;
  },

// Put Approval Invoice
  async approveInvoice(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/invoice/approval/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: "paid" }) 
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menyetujui pembayaran');
    return result;
  },

// Update Invoice
  async updateInvoice(id, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/invoice/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengupdate tagihan');
    return result;
  }
};