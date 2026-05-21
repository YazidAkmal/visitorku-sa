<script setup>
const props = defineProps({
  counters: {
    type: Object,
    required: true,
    default: () => ({ visitor: 0, visit: 0, company: 0 })
  }
});
</script>

<template>
  <div class="mb-6 flex flex-col lg:flex-row items-center gap-3 bg-[#F9FBFE] p-4 rounded-xl">
    
    <div class="flex-1 w-full bg-white p-5 rounded-xl flex flex-col justify-center border border-gray-100/50 shadow-sm">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[13px] font-medium text-gray-800">{{ $t('dashboard.d_TotVisitor') }}</span>
      </div>
      <div class="text-2xl font-semibold text-gray-900">{{ counters.visitor }}</div>
    </div>

    <div class="flex-1 w-full bg-white p-5 rounded-xl flex flex-col justify-center border border-gray-100/50 shadow-sm">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[13px] font-medium text-gray-800">{{ $t('dashboard.d_TotVisit') }}</span>
      </div>
      <div class="text-2xl font-semibold text-gray-900">{{ counters.visit }}</div>
    </div>

    <div class="flex-1 w-full bg-white p-5 rounded-xl flex flex-col justify-center border border-gray-100/50 shadow-sm">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[13px] font-medium text-gray-800">{{ $t('dashboard.d_TotCompany') }}</span>
      </div>
      <div class="text-2xl font-semibold text-gray-900">{{ counters.company }}</div>
    </div>

  </div>
</template>