<script setup>
import SearchLogo from '@/assets/images/icon/search-vector.svg'
import FilterLogo from '@/assets/images/icon/filter-vector.svg'
import { useSlots } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholderText: {
    type: String,
    default: 'Cari...'
  }
})

defineEmits(['update:modelValue', 'search', 'filter'])

const slots = useSlots()
</script>

<template>
  <div class="mb-6 flex flex-col md:flex-row md:items-center gap-4 w-full">
    
    <div class="flex items-center gap-3 w-full flex-1 min-w-0">
      
      <div class="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white w-full lg:max-w-85 focus-within:border-primary-blue focus-within:ring-1 focus-within:ring-primary-blue transition-all min-w-0">
        <img :src="SearchLogo" alt="Search" class="w-5 h-5 opacity-60 shrink-0" />
        <input 
          type="text" 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          :placeholder="placeholderText" 
          class="w-full min-w-0 text-[13px] text-gray-700 placeholder-gray-400 outline-none bg-transparent font-['Poppins'] truncate"
        />
      </div>
      
      <button 
        @click="$emit('filter')"
        class="shrink-0 flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl px-4 py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all text-[#64748B] hover:text-gray-800 focus:outline-none"
      >
        <img :src="FilterLogo" alt="Filter" class="w-5 h-5 opacity-70 shrink-0" />
        <span class="text-[13px] font-medium hidden sm:block">Filter lainnya</span>
        <span class="text-[13px] font-medium block sm:hidden">Filter</span>
      </button>
    </div>

    <div v-if="slots.action" class="shrink-0 w-full md:w-auto flex md:justify-end">
      <slot name="action"></slot>
    </div>

  </div>
</template>