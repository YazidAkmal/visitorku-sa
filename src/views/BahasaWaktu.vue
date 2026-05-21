<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm min-h-full flex flex-col">
    <PageHeader :title="$t('sidebar.language')" :subtitle="$t('language.l_languagedesc')" />
    <hr class="border-gray-100 my-5" />
  </div>
</template>
