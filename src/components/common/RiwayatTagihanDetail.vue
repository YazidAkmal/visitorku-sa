<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  selectedDetail: { type: Object, required: true }
});

const emit = defineEmits(['download', 'confirm']);

// Format Rupiah khusus untuk komponen ini
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
};
</script>

<template>
  <div class="px-6 md:px-8 py-6 flex flex-col gap-6 h-full min-h-[calc(100vh-200px)]">
    <div class="bg-white rounded-xl border border-gray-100 p-6 ">
      <div class="mb-6 border-b border-gray-100 pb-5">
        <div class="text-[13px] text-gray-400 font-medium mb-1">Nama Perusahaan</div>
        <div class="text-[15px] text-gray-800 font-semibold">{{ selectedDetail.perusahaan }}</div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
        <div>
          <div class="text-[13px] text-gray-400 font-medium mb-1">Nomor Tagihan</div>
          <div class="text-[15px] text-[#2BB5F4] font-semibold">{{ selectedDetail.noTagihan }}</div>
        </div>
        <div>
          <div class="text-[13px] text-gray-400 font-medium mb-1">Due Date</div>
          <div class="text-[15px] text-gray-800 font-semibold">{{ selectedDetail.dateRange.split(' • ')[1] }}</div>
        </div>
        <div>
          <div class="text-[13px] text-gray-400 font-medium mb-1">Status Tagihan</div>
          <div class="text-[15px] text-gray-800 font-semibold">{{ selectedDetail.status }}</div>
        </div>
        <div>
          <div class="text-[13px] text-gray-400 font-medium mb-1">Metode Pembayaran</div>
          <div class="text-[15px] text-gray-800 font-semibold">-</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6 ">
      <h3 class="text-[15px] font-bold text-gray-800 mb-1">Rincian Paket</h3>
      <p class="text-[13px] text-gray-400 mb-6">Paket dan layanan yang digunakan selama periode tagihan ini.</p>

      <div class="space-y-4">
        <div class="flex justify-between text-[15px]">
          <span class="text-gray-500">{{ selectedDetail.price_type }} Plan</span>
          <span class="text-gray-800 font-medium">{{ formatRupiah(selectedDetail.base_price) }}</span>
        </div>
        <div class="flex justify-between text-[15px]">
          <span class="text-gray-500">Diskon</span>
          <span class="text-gray-800 font-medium"> {{ formatRupiah(selectedDetail.disc) }}</span>
        </div>
        <div class="flex justify-between text-[15px] pt-4 border-t border-gray-100">
          <span class="text-gray-800 font-bold">Total Pembayaran</span>
          <span class="text-gray-800 font-bold">{{ formatRupiah(selectedDetail.payment_total) }}</span>
        </div>
      </div>
    </div>

    <div class="flex-1"></div>

    <div v-if="selectedDetail.statusCode === 'success'" class="mt-4">
      <button @click="emit('download', selectedDetail.invoice_url)" class="w-full py-3.5 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] flex items-center justify-center gap-2 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Invoice
      </button>
    </div>

    <div v-else-if="selectedDetail.statusCode === 'pending'" class="mt-4 flex flex-col gap-3">
      <p class="text-[11px] text-gray-400 text-right md:w-1/2 self-end">Pastikan pembayaran telah diterima sebelum melakukan konfirmasi.</p>
      <div class="flex flex-col md:flex-row gap-4">
        <button @click="emit('download', selectedDetail.invoice_url)" class="flex-1 py-3.5 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] flex items-center justify-center gap-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Invoice
        </button>
        <button @click="emit('confirm')" class="flex-1 py-3.5 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors">
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  </div>
</template>