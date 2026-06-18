<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="mb-4">
    <h1 class="text-[20px] font-medium text-gray-800 mb-1">{{ title }}</h1>
    <p class="text-[14px] text-gray-500">{{ subtitle }}</p>
  </div>
</template>
