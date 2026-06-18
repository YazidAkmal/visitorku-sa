<script setup>
import SortLogo from '@/assets/images/icon/sort-vector.svg'

defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  sortKey: { type: String, default: '' },
  sortOrder: { type: String, default: 'asc' },
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
              index === columns.length - 1 ? 'rounded-r-sm' : '',
              col.width ? col.width : '',
            ]"
          >
            <div class="flex items-center justify-between gap-2">
              {{ col.label }}

              <img
                v-if="col.sortable !== false"
                :src="SortLogo"
                alt="Sort"
                loading="lazy"
                class="w-3.5 h-3.5 cursor-pointer transition-all duration-300"
                :class="[
                  sortKey === col.key ? 'opacity-100' : 'opacity-40 hover:opacity-100',
                  sortKey === col.key && sortOrder === 'desc' ? 'rotate-180' : '',
                ]"
                @click="$emit('sort', col.key)"
              />
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="`${row.id || 'row'}-${rowIndex}`"
          class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
        >
          <td v-for="col in columns" :key="col.key" class="py-4 px-4 text-[13px]">
            <slot :name="col.key" :item="row">
              <span class="text-gray-800 font-medium">{{ row[col.key] }}</span>
            </slot>
          </td>
        </tr>

        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="py-8 text-center text-gray-400 text-sm">
            <slot name="empty"> Tidak ada data untuk ditampilkan. </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
