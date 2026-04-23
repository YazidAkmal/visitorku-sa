<script setup>
</script>

<template>
  <button class="flex items-center justify-center p-2.5 md:px-5 md:py-2.5 border-2 border-[#2BB5F4] text-[#2BB5F4] rounded-xl font-medium text-[13px] md:text-sm hover:bg-[#2BB5F4] hover:text-white transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#2BB5F4]/50">
    
    <svg class="w-4.5 h-4.5 block md:hidden shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
    </svg>

    <span class="hidden md:block">
      <slot></slot>
    </span>

  </button>
</template>