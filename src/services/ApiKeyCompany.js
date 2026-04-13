const BASE_URL = 'https://visitorku.io/api-stg-su';

export const ApiCompanyKey = {
  
  async getCompanies() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/company`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengambil data perusahaan');
    return result;
  },

  async getCounters(companyId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/company/counter-data/${companyId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  async getMonthlyData(companyId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/company/monthly-data/${companyId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  async getLatestVisitors(companyId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/company/latest-visitor/${companyId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
};