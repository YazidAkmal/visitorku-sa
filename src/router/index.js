import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import DaftarPerusahaan from '../views/DaftarPerusahaan.vue'
import RiwayatTagihan from '../views/RiwayatTagihan.vue'
import Pengguna from '../views/Pengguna.vue'
import PaketLayanan from '../views/PaketLayanan.vue'
import BahasaWaktu from '../views/BahasaWaktu.vue'
import Pengaturan from '../views/Pengaturan.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'Login', component: Login },

    { path: '/', redirect: '/login' },

    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/daftar-perusahaan', component: DaftarPerusahaan, meta: { requiresAuth: true } },
    { path: '/riwayat-tagihan', component: RiwayatTagihan, meta: { requiresAuth: true } },
    { path: '/pengguna', component: Pengguna, meta: { requiresAuth: true } },
    { path: '/paket-layanan', component: PaketLayanan, meta: { requiresAuth: true } },
    { path: '/bahasa-waktu', component: BahasaWaktu, meta: { requiresAuth: true } },
    { path: '/pengaturan', component: Pengaturan, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' }
  } else if (to.name === 'Login' && token) {
    return { name: 'Dashboard' }
  }
  return true
})

export default router
