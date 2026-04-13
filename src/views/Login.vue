<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/AuthService.js'; 

const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  console.log(); 
  
  errorMessage.value = '';
  isLoading.value = true;

  try {
    console.log();
    
    const result = await AuthService.login(email.value, password.value);
    console.log(result);

    if (result.data && result.data.token) {
      localStorage.setItem('token', result.data.token);
      
      localStorage.setItem('user', JSON.stringify({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email
      }));

      console.log();
      router.push({ name: 'Dashboard' }); 
    } else {
      console.log();
      errorMessage.value = 'Format respons dari server tidak sesuai.';
    }
  } catch (error) {
    console.error(rror);
    errorMessage.value = error.message || 'Terjadi kesalahan jaringan atau sistem.';
  } finally {
    isLoading.value = false;
    console.log();
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 font-['Poppins'] relative overflow-hidden">
    
    <div class="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#2BB5F4] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#38CA99] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

    <div class="w-full max-w-112.5 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 relative z-10 border border-gray-100">
      
      <div class="text-center mb-8">
        <h1 class="text-[28px] font-bold text-[#2BB5F4] tracking-tight mb-2">Visitorku</h1>
        <p class="text-[14px] text-gray-500">Masuk sebagai Super Admin</p>
      </div>

      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
        <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="text-[13px] text-red-600 font-medium">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-[13px] font-semibold text-gray-800 mb-2">Email Address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="su@visitorku.id" 
              class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#2BB5F4] focus:ring-1 focus:ring-[#2BB5F4] transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-[13px] font-semibold text-gray-800 mb-2">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              required
              placeholder="Masukkan password" 
              class="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#2BB5F4] focus:ring-1 focus:ring-[#2BB5F4] transition-all"
            />
            
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#2BB5F4] focus:outline-none transition-colors"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3.5 bg-[#2BB5F4] hover:bg-[#14A5E6] text-white font-bold rounded-xl text-[14px] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Memproses...' : 'Masuk Dashboard' }}
        </button>
      </form>
    </div>
  </div>
</template>