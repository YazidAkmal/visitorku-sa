<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Import icon
import dashboardIcon from '@/assets/images/icon/dashboard-vector.svg';
import daftarperusahaanIcon from '@/assets/images/icon/daftar-perusahaan-vector.svg';
import riwayattagihanIcon from '@/assets/images/icon/riwayat-tagihan-vector.svg';
import penggunaIcon from '@/assets/images/icon/pengguna-vector.svg';
import paketlayananIcon from '@/assets/images/icon/paket-dan-layanan-vector.svg';
import bahasawaktuIcon from '@/assets/images/icon/bahasa-dan-waktu-vector.svg';
import pengaturanIcon from '@/assets/images/icon/pengaturan-vector.svg';

import selectedDashboardIcon from '@/assets/images/icon/selected-dashboard-vector.svg';
import selectedDaftarPerusahaanIcon from '@/assets/images/icon/selected-daftar-perusahaan-vector.svg';
import selectedRiwayatTagihanIcon from '@/assets/images/icon/selected-riwayat-tagihan-vector.svg';

const mainMenuItems = ref([
  { name: 'Dashboard', path: '/dashboard', icon: dashboardIcon, iconSelected: selectedDashboardIcon },
  { name: 'Daftar Perusahaan', path: '/daftar-perusahaan', icon: daftarperusahaanIcon, iconSelected: selectedDaftarPerusahaanIcon },
  { name: 'Riwayat Tagihan', path: '/riwayat-tagihan', icon: riwayattagihanIcon, iconSelected: selectedRiwayatTagihanIcon },
  { name: 'Pengguna', path: '/pengguna', icon: penggunaIcon },
]);

const masterDataItems = ref([
  { name: 'Paket & Layanan', path: '/paket-layanan', icon: paketlayananIcon },
  { name: 'Bahasa & Waktu', path: '/bahasa-waktu', icon: bahasawaktuIcon },
  { name: 'Pengaturan', path: '/pengaturan', icon: pengaturanIcon },
]);

const isActive = (path) => {
  if (!route) return false;
  return route.path === path || route.path.startsWith(path + '/');
};

</script>

<template>
<aside class="w-65 bg-[#F9FBFE] flex flex-col p-4 gap-3 font-['Poppins'] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto hide-scrollbar">    
    <div class="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4">
      <h3 class="text-[16px] font-semibold text-[#1E293B] mt-5 mb-3 tracking-wide">Main Menu</h3>
      <div class="space-y-1">
        <router-link 
          v-for="item in mainMenuItems" 
          :key="item.name"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-[14px] no-underline',
            isActive(item.path) 
              ? 'bg-light-blue text-primary-blue font-medium'
              : 'text-[#64748B] hover:bg-gray-50 font-normal'
          ]"
        >
          <img 
            :src="isActive(item.path) && item.iconSelected ? item.iconSelected : item.icon" 
            alt="" 
            class="w-4.5 h-4.5 shrink-0"
            :class="{ 'filter-blue': isActive(item.path) && !item.iconSelected }" 
          />
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </div>
    
    <div class="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4">
      <h3 class="text-[16px] font-semibold text-[#1E293B] mt-5 mb-3 tracking-wide">Master Data</h3>
      <div class="space-y-1">
        <router-link 
          v-for="item in masterDataItems" 
          :key="item.name"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-[14px] no-underline',
            isActive(item.path) 
              ? 'bg-light-blue text-primary-blue font-medium' 
              : 'text-[#64748B] hover:bg-gray-50 font-normal'
          ]"
          >
            <img 
              :src="isActive(item.path) && item.iconSelected ? item.iconSelected : item.icon" 
              alt="" 
              class="w-4.5 h-4.5 shrink-0"
              :class="{ 'filter-blue': isActive(item.path) && !item.iconSelected }" 
            />
            <span>{{ item.name }}</span>
        </router-link>
      </div>
    </div>
  </aside>
</template>

<style scoped>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .filter-blue {
    filter: invert(56%) sepia(89%) saturate(1095%) hue-rotate(200deg) brightness(101%) contrast(96%);
  }
</style>