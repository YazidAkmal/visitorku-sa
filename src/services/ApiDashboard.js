const BASE_URL = 'https://visitorku.io/api-stg-su';

export const ApiDashboard = {
  async getCounters() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/dashboard/counter`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  async getMonthlyData() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/dashboard/monthly-data`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  async getLatestCompany() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/dashboard/latest-company`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
};