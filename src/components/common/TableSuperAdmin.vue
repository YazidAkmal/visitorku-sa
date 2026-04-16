<script setup>
import SortLogo from '@/assets/images/icon/sort-vector.svg'

defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  }
})

defineEmits(['sort'])
</script>

<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-[#DDF4FF]">
          <th 
            v-for="(col, index) in columns" 
            :key="col.key"
            class="py-3 px-4 text-[13px] font-medium text-gray-700 border-r-4 border-white last:border-r-0"
            :class="[
              index === 0 ? 'rounded-l-lg' : '', 
              index === columns.length - 1 ? 'rounded-r-lg' : '',
              col.width ? col.width : ''
            ]"
          >
            <div class="flex items-center justify-between">
              {{ col.label }}
              <img 
                v-if="col.sortable !== false"
                :src="SortLogo" 
                alt="Sort" 
                class="w-3.5 h-3.5 opacity-40 cursor-pointer hover:opacity-100 transition-opacity"
                @click="$emit('sort', col.key)"
              />
            </div>
          </th>
        </tr>
      </thead>
      
      <tbody>
        <tr 
          v-for="(row, rowIndex) in data" 
          :key="row.id || rowIndex" 
          class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
        >
          <td 
            v-for="col in columns" 
            :key="col.key"
            class="py-4 px-4 text-[13px]"
          >
            <slot :name="col.key" :item="row">
              <span class="text-gray-800 font-medium">{{ row[col.key] }}</span>
            </slot>
          </td>
        </tr>

        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="py-8 text-center text-gray-400 text-sm">
            Tidak ada data untuk ditampilkan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>