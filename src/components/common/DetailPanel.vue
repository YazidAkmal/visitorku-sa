<script setup>
import HeaderPattern from '@/assets/images/short-pattern.svg';

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});
defineEmits(['close']);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity ease-linear duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/40 z-9990 backdrop-blur-sm"></div>
    </Transition>

    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="translate-x-[120%]"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-[120%]"
    >
      <div 
        v-if="isOpen"
        class="fixed top-1 bottom-1 right-1 md:top-2.5 md:bottom-2.5 md:right-2.5 z-9999 w-[calc(100%-2rem)] sm:w-[90vw] md:w-[80vw] lg:max-w-212.5 bg-[#F5FCFE] shadow-2xl flex flex-col font-['Poppins'] overflow-hidden rounded-xl"
      >
        
        <div class="relative shrink-0 bg-[#2BB5F4]">
          <div 
            class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-90" 
            :style="{ backgroundImage: `url(${HeaderPattern})` }"
          ></div>
          
          <button @click="$emit('close')" class="absolute top-6 right-6 text-white/90 hover:text-white transition-colors focus:outline-none z-30">
            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div class="relative z-20 pt-8">
            <slot name="header"></slot>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto hide-scrollbar pb-8 relative z-10">
          <slot name="body"></slot>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { width: 6px; }
.hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
.hide-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>