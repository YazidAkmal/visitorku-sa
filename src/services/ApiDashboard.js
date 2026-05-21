import { BASE_URL } from './api'

export const ApiDashboard = {
  async getCounters() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/dashboard/counter`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return await response.json()
  },

  async getMonthlyData() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/dashboard/monthly-data`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return await response.json()
  },

  async getLatestCompany() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/dashboard/latest-company`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return await response.json()
  },
}
