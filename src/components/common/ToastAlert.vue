<script setup>
import { watch, onUnmounted, computed } from 'vue'

import iconSuccess from '@/assets/images/icon/toast-alert-success.svg'
import iconFailed from '@/assets/images/icon/toast-alert-failed.svg'
import iconWarning from '@/assets/images/icon/toast-alert.svg'

const props = defineProps({
  show: { type: Boolean, required: true },
  message: { type: String, default: 'Berhasil!' },
  type: { type: String, default: 'success' },
  duration: { type: Number, default: 3000 },
})

const emit = defineEmits(['update:show'])
let timeoutId = null

const closeToast = () => {
  emit('update:show', false)
  clearTimeout(timeoutId)
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        closeToast()
      }, props.duration)
    }
  },
)

onUnmounted(() => {
  clearTimeout(timeoutId)
})

const toastIcon = computed(() => {
  if (props.type === 'success') return iconSuccess
  if (props.type === 'error') return iconFailed
  if (props.type === 'warning') return iconWarning
  return iconFailed
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="show"
        class="fixed bottom-6 right-6 z-999999 bg-white rounded shadow-xl border border-gray-100 overflow-hidden min-w-75 max-w-sm font-['Poppins'] flex flex-col"
      >
        <div class="relative p-4 pr-10 flex items-center gap-3">
          <button
            @click="closeToast"
            class="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <img :src="toastIcon" alt="Alert Icon" class="w-6 h-6 shrink-0" />
          <p class="text-gray-600 text-[14px] font-medium leading-tight">{{ message }}</p>
        </div>

        <div class="h-1 bg-gray-100 w-full relative shrink-0">
          <div
            class="absolute top-0 left-0 h-full animate-shrink"
            :class="{
              'bg-[#2BB5F4]': type === 'success',
              'bg-[#EF4444]': type === 'error' || type === 'warning', // Error & Warning sama-sama warna Merah
            }"
            :style="{ animationDuration: duration + 'ms' }"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.animate-shrink {
  animation-name: shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
