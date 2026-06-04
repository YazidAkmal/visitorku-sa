<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  summary: {
    type: Object,
    required: true,
    default: () => ({ total: 0, belumDibayar: 0, lunas: 0 }),
  },
})

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka || 0)
}
</script>

<template>
  <div class="mb-8 flex flex-col lg:flex-row items-center gap-3 bg-white-bg p-4 rounded-xl">
    <div class="flex-1 w-full p-5 rounded-xl flex flex-col justify-center">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[13px] font-medium text-gray-800">{{ $t('invoice.i_Total') }}</span>
      </div>
      <div class="text-2xl font-semibold text-gray-900">{{ formatRupiah(summary.total) }}</div>
    </div>

    <div
      class="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-gray-500 lg:transform-none transform rotate-90 lg:rotate-0"
    >
      =
    </div>

    <div class="flex-1 w-full bg-white p-5 rounded-xl flex flex-col justify-center">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[13px] font-medium text-gray-800">{{ $t('invoice.i_Nopaid') }}</span>
      </div>
      <div class="text-2xl font-semibold text-gray-900">
        {{ formatRupiah(summary.belumDibayar) }}
      </div>
    </div>

    <div
      class="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-gray-500 lg:transform-none transform rotate-90 lg:rotate-0"
    >
      +
    </div>

    <div class="flex-1 w-full bg-white p-5 rounded-xl flex flex-col justify-center">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[13px] font-medium text-gray-800">{{ $t('invoice.i_paid') }}</span>
      </div>
      <div class="text-2xl font-semibold text-gray-900">{{ formatRupiah(summary.lunas) }}</div>
    </div>
  </div>
</template>
