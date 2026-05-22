import { BASE_URL } from './api'

export const ApiDashboard = {
  // Get Counters (dashboard)
  async getCounters() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/dashboard/counter`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return await response.json()
  },

  // Get Monthly Data (dashboard)
  async getMonthlyData() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/dashboard/monthly-data`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return await response.json()
  },

  // Get Latest Company (dashboard)
  async getLatestCompany() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/dashboard/latest-company`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return await response.json()
  },
}
