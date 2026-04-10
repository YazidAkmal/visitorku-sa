<script setup>
import { ref } from 'vue';

import bgPattern from '@/assets/images/long-pattern.svg';
import logoVisitorku from '@/assets/images/visitorku-logo.svg';
import globeIcon from '@/assets/images/icon/globe-vector.svg';

const isDropdownOpen = ref(false);
</script>

<template>
  <header class="w-full h-20 bg-primary-blue flex items-center justify-between px-6 relative z-20 shadow-md">
    
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
        
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

    </div>
  </header>
</template>

<style scoped>
</style>