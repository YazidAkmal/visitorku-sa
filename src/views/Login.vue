<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/AuthService.js'

// 🌟 Import Toast Helper Global kita
import { Toast } from '@/components/utils/ToastState.js'

import logoVisitorku from '@/assets/images/visitorku-logo.svg'
import patternBg from '@/assets/images/Background.svg'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true

  // 🌟 Validasi Email (Gunakan Toast Warning)
  if (!email.value.includes('@')) {
    Toast.warning('Invalid Email value!')
    isLoading.value = false
    return
  }

  try {
    const result = await AuthService.login(email.value, password.value)

    if (result.data && result.data.token) {
      localStorage.setItem('token', result.data.token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
        }),
      )

      // 🌟 Jika sukses, pindah halaman dan munculkan Toast Hijau
      Toast.success('Login berhasil! Selamat datang.')
      router.push({ name: 'Dashboard' })
    } else {
      // 🌟 Jika format aneh, munculkan Toast Error
      Toast.error('Format respons dari server tidak sesuai.')
    }
  } catch (error) {
    console.error('Login Gagal:', error)

    // 🌟 Tangkap pesan error dari API (seperti 'Account not found!')
    const errMsg =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan pada server. Silakan coba lagi.'

    // 🌟 Panggil Toast Error (Otomatis warna merah & ikon silang)
    Toast.error(errMsg)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex font-['Poppins']">
    <div class="hidden lg:flex w-3/4 relative bg-primary-blue overflow-hidden">
      <img
        :src="patternBg"
        class="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="Pattern Background"
      />
      <div class="absolute top-8 left-8 z-10">
        <img :src="logoVisitorku" alt="Visitorku Logo" class="h-10 md:h-10" />
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex justify-center items-center bg-white p-8 md:p-12 relative">
      <div class="w-full max-w-100">
        <div class="mb-8">
          <h1 class="text-[28px] font-bold text-gray-900 mb-2">Login</h1>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-[13px] text-gray-800 mb-1.5"
              >Email <span class="text-red-500">*</span></label
            >
            <input
              v-model="email"
              type="email"
              required
              placeholder="Enter Email Here..."
              class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2BB5F4] focus:ring-1 focus:ring-[#2BB5F4] transition-all"
            />
          </div>

          <div>
            <label class="block text-[13px] text-gray-800 mb-1.5"
              >Password <span class="text-red-500">*</span></label
            >
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter Password Here..."
                class="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2BB5F4] focus:ring-1 focus:ring-[#2BB5F4] transition-all"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              >
                <svg
                  v-if="!showPassword"
                  class="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 bg-primary-blue hover:bg-[#2BB5F4] text-white font-medium rounded-lg text-[14px] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? 'Memproses...' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
