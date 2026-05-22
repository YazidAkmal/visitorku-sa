import { BASE_URL } from './api'

export const ApiAdmin = {
  // Get All Admins / Users
  async getAdmins() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/admin`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Gagal memuat data admin')
    return result
  },

  // Create Admin / User
  async createAdmin(data) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Gagal menambah admin')
    return result
  },

  // Update Admin / User
  async updateAdmin(id, data) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Gagal mengupdate admin')
    return result
  },

  // Delete Admin / User
  async deleteAdmin(id) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus admin')
    return result
  },
}
