import { ref } from 'vue'

// Ini State Globalnya
export const globalToast = ref({
  show: false,
  message: '',
  type: 'error',
  duration: 3000,
})

// Ini Helper pemanggilnya
export const Toast = {
  success(message, duration = 3000) {
    globalToast.value = { show: true, message, type: 'success', duration }
  },
  error(message, duration = 3000) {
    globalToast.value = { show: true, message, type: 'error', duration }
  },
  warning(message, duration = 3000) {
    globalToast.value = { show: true, message, type: 'warning', duration }
  },
}
