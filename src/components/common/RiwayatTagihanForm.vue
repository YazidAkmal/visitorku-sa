<script setup>
const props = defineProps({
  editFormData: { type: Object, required: true },
  isSavingEdit: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'save']);
</script>

<template>
  <div class="px-6 md:px-8 py-6 pb-10 bg-[#F8FAFC] h-full min-h-[calc(100vh-150px)] flex flex-col">
    
    <div class="bg-white rounded-xl p-6 ">
      <h3 class="text-[15px] font-bold text-gray-800 mb-5 border-b border-gray-50 pb-3">Informasi Status & Periode</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Status Tagihan <span class="text-red-500">*</span></label>
          <select v-model="editFormData.status" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4] bg-white">
            <option value="paid">Lunas</option>
            <option value="unpaid">Menunggu Pembayaran</option>
          </select>
        </div>
        
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Periode Pembayaran <span class="text-red-500">*</span></label>
          <select v-model="editFormData.payment_type" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4] bg-white">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div class="flex flex-col md:flex-row gap-4 pt-2">
          <div class="flex-1">
            <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Tanggal Mulai Aktif</label>
            <input v-model="editFormData.active_from_date" type="date" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
          </div>
          <div class="flex-1">
            <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Tanggal Berakhir</label>
            <input v-model="editFormData.active_to_date" type="date" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1"></div>

    <div class="flex gap-4 mt-8">
      <button @click="emit('close')" class="flex-1 py-3 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] transition-colors">
        Batal
      </button>
      <button 
        @click="emit('save')" 
        :disabled="isSavingEdit"
        class="flex-1 py-3 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        <svg v-if="isSavingEdit" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </div>

  </div>
</template>