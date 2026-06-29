import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from '@/components/utils/ToastState.js'

export function useAutoLogout(timeoutMinutes = 15) {
  const router = useRouter()
  let timeoutId = null

  const timeoutMs = timeoutMinutes * 60 * 1000

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    Toast.warning('Sesi Anda telah berakhir karena tidak ada aktivitas.')

    window.location.href = '/login'
  }

  const resetTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(handleLogout, timeoutMs)
  }

  const activeEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart']

  onMounted(() => {
    resetTimer()

    activeEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true })
    })
  })

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)

    activeEvents.forEach((event) => {
      window.removeEventListener(event, resetTimer)
    })
  })
}
