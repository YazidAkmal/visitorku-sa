<script setup>
import SearchLogo from '@/assets/images/icon/search-vector.svg'
import FilterLogo from '@/assets/images/icon/filter-vector.svg'
import { useSlots } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholderText: {
    type: String,
    default: 'Cari...',
  },
})

defineEmits(['update:modelValue', 'search', 'filter'])

const slots = useSlots()
</script>

<template>
  <div class="mb-6 flex flex-row items-center gap-2 md:gap-4 w-full">
    <div class="flex items-center gap-2 md:gap-3 w-full flex-1 min-w-0">
      <div
        class="flex items-center gap-2 md:gap-3 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5 bg-white w-full lg:max-w-85 focus-within:border-[#2BB5F4] focus-within:ring-1 focus-within:ring-[#2BB5F4] transition-all min-w-0"
      >
        <img
          :src="SearchLogo"
          alt=""
          aria-hidden="true"
          loading="lazy"
          class="w-4 h-4 md:w-5 md:h-5 opacity-60 shrink-0"
        />
        <input
          type="text"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          :placeholder="placeholderText"
          :aria-label="placeholderText"
          class="w-full min-w-0 text-[12px] md:text-[13px] text-gray-700 placeholder-gray-400 outline-none bg-transparent font-['Poppins'] truncate"
        />
      </div>

      <button
        @click="$emit('filter')"
        aria-label="Filter Pencarian"
        class="shrink-0 flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl p-2.5 md:px-4 md:py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all text-secondary-text hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB5F4]"
      >
        <img
          :src="FilterLogo"
          alt=""
          aria-hidden="true"
          loading="lazy"
          class="w-5 h-5 opacity-70 shrink-0"
        />
        <span class="text-[13px] font-medium hidden md:block" aria-hidden="true">Filter</span>
      </button>
    </div>

    <div v-if="slots.action" class="shrink-0 flex items-center">
      <slot name="action"></slot>
    </div>
  </div>
</template>
