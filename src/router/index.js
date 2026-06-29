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
    { path: '/login', name: 'Login', component: Login, meta: { title: 'Login' } },

    { path: '/', redirect: '/login' },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, title: 'Dashboard' },
    },
    {
      path: '/daftar-perusahaan',
      component: DaftarPerusahaan,
      meta: { requiresAuth: true, title: 'Company List' },
    },
    {
      path: '/riwayat-tagihan',
      component: RiwayatTagihan,
      meta: { requiresAuth: true, title: 'Invoice History' },
    },
    { path: '/pengguna', component: Pengguna, meta: { requiresAuth: true, title: 'Users' } },
    {
      path: '/paket-layanan',
      component: PaketLayanan,
      meta: { requiresAuth: true, title: 'Service Packages' },
    },
    {
      path: '/bahasa-waktu',
      component: BahasaWaktu,
      meta: { requiresAuth: true, title: 'Language & Time' },
    },
    { path: '/pengaturan', component: Pengaturan, meta: { requiresAuth: true, title: 'Settings' } },
  ],
})

router.beforeEach((to, from) => {
  const baseTitle = 'VisitorKu Super Admin'
  if (to.meta.title) {
    document.title = `${to.meta.title} • ${baseTitle}`
  } else {
    document.title = baseTitle
  }

  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' }
  } else if (to.name === 'Login' && token) {
    return { name: 'Dashboard' }
  }

  return true
})

export default router
