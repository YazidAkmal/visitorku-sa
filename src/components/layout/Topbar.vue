<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 

import bgPattern from '@/assets/images/long-pattern.svg';
import logoVisitorku from '@/assets/images/visitorku-logo.svg';
import globeIcon from '@/assets/images/icon/globe-vector.svg';

const isDropdownOpen = ref(false);
const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  router.push({ name: 'Login' });
};
</script>

<template>
  <header class="w-full h-20 bg-primary-blue flex items-center justify-between px-6 relative z-30 shadow-md">
    
    <div 
      class="absolute inset-0 z-0 opacity-100 bg-cover bg-center" 
      :style="{ backgroundImage: `url(${bgPattern})` }">
    </div>

    <div class="relative z-10 flex items-center">
      <img :src="logoVisitorku" alt="Visitorku Logo" class="h-8 object-contain cursor-pointer" />
    </div>

    <div class="relative z-10 flex items-center gap-5">
      
      <button class="w-8.5 h-8.5 bg-light-blue rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm">
        <img :src="globeIcon" alt="Language" class="w-5 h-5" />
      </button>

      <div class="relative">
        
        <div 
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span class="text-white text-[14px] font-medium font-['Poppins']">SuperAdmin</span>
          
          <img 
            src="https://ui-avatars.com/api/?name=Super+Admin&background=1E293B&color=fff" 
            alt="Profile" 
            class="w-8 h-8 rounded-full border border-white/30 object-cover" 
          />
          
          <svg class="w-4 h-4 text-white transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-40"></div>

        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="isDropdownOpen" 
            class="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 font-['Poppins'] overflow-hidden"
          >
            <button 
              @click="handleLogout" 
              class="w-full text-left px-4 py-2.5 text-[13px] text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center gap-2.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Keluar
            </button>
          </div>
        </Transition>

      </div>
    </div>
  </header>
</template>

<style scoped>
</style>