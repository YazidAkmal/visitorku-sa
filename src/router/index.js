import { createRouter, createWebHistory } from 'vue-router'

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
    { path: '/', redirect: '/dashboard' }, 
    
    { path: '/dashboard', component: Dashboard },
    { path: '/daftar-perusahaan', component: DaftarPerusahaan },
    { path: '/riwayat-tagihan', component: RiwayatTagihan },
    { path: '/pengguna', component: Pengguna },
    { path: '/paket-layanan', component: PaketLayanan },
    { path: '/bahasa-waktu', component: BahasaWaktu },
    { path: '/pengaturan', component: Pengaturan },
  ]
})

export default router