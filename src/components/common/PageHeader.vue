<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="mb-4">
    <h1 class="text-2xl font-semibold text-gray-800 mb-1">{{ title }}</h1>
    <p class="text-sm text-gray-500">{{ subtitle }}</p>
  </div>
</template>