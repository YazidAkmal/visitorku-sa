<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalData: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.totalData / props.perPage) || 1)

const visiblePages = computed(() => {
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1

  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxVisible + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const showingCount = computed(() => {
  if (props.totalData === 0) return 0
  const end = Math.min(props.currentPage * props.perPage, props.totalData)
  const start = ((props.currentPage - 1) * props.perPage) + 1
  return end - start + 1
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100">
    
    <div class="text-[13px] text-gray-500 font-medium text-center md:text-left">
      Menampilkan {{ showingCount }} dari {{ totalData }} data
    </div>

    <div v-if="totalPages > 1" class="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
      
      <button 
        @click="changePage(1)"
        :disabled="currentPage === 1"
        class="px-3 md:px-4 py-2 border border-gray-200 rounded-lg text-[12px] md:text-[13px] font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Pertama
      </button>

      <button 
        v-for="page in visiblePages" 
        :key="page"
        @click="changePage(page)"
        class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-[12px] md:text-[13px] font-medium transition-colors"
        :class="currentPage === page 
          ? 'bg-[#2BB5F4] text-white border border-[#2BB5F4]' 
          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
      >
        {{ page }}
      </button>

      <button 
        @click="changePage(totalPages)"
        :disabled="currentPage === totalPages"
        class="px-3 md:px-4 py-2 border border-gray-200 rounded-lg text-[12px] md:text-[13px] font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Terakhir
      </button>

    </div>
  </div>
</template>