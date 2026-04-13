<script setup>
import { ref, computed } from 'vue';

// Import Components
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue'; 

// Import Icon
import MenungguPembayaran from '@/assets/images/icon/menunggu-pembayaran-state-vector.svg'
import Lunas from '@/assets/images/icon/lunas-state-vector.svg'
import KonfirmasiBayar from '@/assets/images/alert-konfirmasi-pembayaran.svg'
import Invoice from '@/assets/images/icon/monthly-invoice-vector.svg'

// State
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Dummy Data
const listTagihanLengkap = [
  { id: 1, noTagihan: 'V/01/2026/2', dateRange: '2026-01-02 • 2026-01-09', perusahaan: 'Diskominfo Pemalang', periode: 'Monthly', status: 'Lunas', statusDesc: 'Diverifikasi pada 2026-01-05', statusCode: 'success' },
  { id: 2, noTagihan: 'V/01/2026/2', dateRange: '2026-01-02 • 2026-01-09', perusahaan: 'Diskominfo Pemalang', periode: 'Monthly', status: 'Menunggu Pembayaran', statusDesc: 'Tagihan belum dibayar', statusCode: 'pending' },
  { id: 3, noTagihan: 'V/01/2026/2', dateRange: '2026-01-02 • 2026-01-09', perusahaan: 'Diskominfo Pemalang', periode: 'Monthly', status: 'Menunggu Pembayaran', statusDesc: 'Tagihan belum dibayar', statusCode: 'pending' },
  { id: 4, noTagihan: 'V/01/2026/3', dateRange: '2026-02-02 • 2026-02-09', perusahaan: 'PT Angkasa Pura', periode: 'Monthly', status: 'Lunas', statusDesc: 'Diverifikasi pada 2026-02-05', statusCode: 'success' },
  { id: 5, noTagihan: 'V/01/2026/3', dateRange: '2026-02-02 • 2026-02-09', perusahaan: 'PT Angkasa Pura', periode: 'Monthly', status: 'Menunggu Pembayaran', statusDesc: 'Tagihan belum dibayar', statusCode: 'pending' },
  { id: 6, noTagihan: 'V/01/2026/4', dateRange: '2026-03-02 • 2026-03-09', perusahaan: 'Telkom Indonesia', periode: 'Monthly', status: 'Lunas', statusDesc: 'Diverifikasi pada 2026-03-05', statusCode: 'success' },
  { id: 7, noTagihan: 'V/01/2026/5', dateRange: '2026-04-02 • 2026-04-09', perusahaan: 'Gmedia', periode: 'Monthly', status: 'Lunas', statusDesc: 'Diverifikasi pada 2026-04-05', statusCode: 'success' }
];

// Computed Pagination
const listTagihanDitampilkan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return listTagihanLengkap.slice(start, end);
});

// Definisi Kolom Tabel
const tableColumns = [
  { key: 'nomor', label: 'Nomor Tagihan', width: 'w-[25%]' },
  { key: 'perusahaan', label: 'Perusahaan' },
  { key: 'periode', label: 'Periode' },
  { key: 'status', label: 'Status' },
  { key: 'aksi', label: 'Aksi', sortable: false }
];

// State untuk Dropdown Aksi
const activeDropdown = ref(null);
const dropdownPos = ref({ top: '0px', right: '0px' }); 

const toggleDropdown = (id, event) => {
  if (activeDropdown.value === id) {
    activeDropdown.value = null;
    return;
  }
  activeDropdown.value = id;
  const rect = event.currentTarget.getBoundingClientRect();
  dropdownPos.value = {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`
  };
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

// State Detail Panel
const isDetailOpen = ref(false);
const selectedDetail = ref(null);

const openDetail = (item) => {
  selectedDetail.value = item;
  isDetailOpen.value = true;
};

const isAlertOpen = ref(false);

const openAlert = () => {
  isAlertOpen.value = true;
};

const closeAlert = () => {
  isAlertOpen.value = false;
};

const confirmPayment = () => {
  if (selectedDetail.value) {
    selectedDetail.value.statusCode = 'success';
    selectedDetail.value.status = 'Lunas';
    selectedDetail.value.statusDesc = 'Diverifikasi pada hari ini';
  }
  isAlertOpen.value = false;
};
</script>

<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 shadow-sm min-h-full flex flex-col min-w-0 w-full">
    
    <PageHeader 
      title="Riwayat Tagihan" 
      subtitle="Data Seluruh tagihan dan pembayaran." 
    />

    <hr class="border-gray-100 mt-1 mb-4" />

    <div class="mb-8 flex flex-col lg:flex-row items-center gap-3 bg-[#F9FBFE] p-4 rounded-xl">
      
      <div class="flex-1 w-full p-5 rounded-xl flex flex-col justify-center">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[13px] font-medium text-gray-800">Total Tagihan Bulan ini</span>
          <svg class="w-3.5 h-3.5 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="text-2xl font-semibold text-gray-900">Rp9.089.141</div>
      </div>

      <div class="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-gray-500 lg:transform-none transform rotate-90 lg:rotate-0">
        =
      </div>

      <div class="flex-1 w-full bg-white p-5 rounded-xl flex flex-col justify-center">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[13px] font-medium text-gray-800">Tagihan Belum Dibayar</span>
          <svg class="w-3.5 h-3.5 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="text-2xl font-semibold text-gray-900">Rp9.089.141</div>
      </div>

      <div class="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-gray-500 lg:transform-none transform rotate-90 lg:rotate-0">
        +
      </div>

      <div class="flex-1 w-full bg-white p-5 rounded-xl flex flex-col justify-center">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[13px] font-medium text-gray-800">Tagihan Lunas</span>
          <svg class="w-3.5 h-3.5 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="text-2xl font-semibold text-gray-900">Rp0</div>
      </div>
    </div>

    <SearchFilterBar 
      v-model="searchQuery" 
      placeholderText="Cari nama perusahaan/nomor tagihan"
    />

    <div class="flex-1 flex flex-col justify-between min-w-0">
      
      <TableSuperAdmin :columns="tableColumns" :data="listTagihanDitampilkan">
        
        <template #nomor="{ item }">
          <div class="text-[13px] font-semibold text-gray-800 mb-0.5 whitespace-nowrap">{{ item.noTagihan }}</div>
          <div class="text-[12px] text-gray-500 whitespace-nowrap">{{ item.dateRange }}</div>
        </template>

        <template #perusahaan="{ item }">
          <span class="text-[13px] text-gray-800 whitespace-nowrap">{{ item.perusahaan }}</span>
        </template>

        <template #periode="{ item }">
          <span class="text-[13px] text-gray-800 whitespace-nowrap">{{ item.periode }}</span>
        </template>

        <template #status="{ item }">
          <div class="flex flex-col items-start gap-1">
            <div v-if="item.statusCode === 'success'" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F8F3] text-[#38CA99] border border-[#38CA99]/20 text-[12px] font-medium whitespace-nowrap">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle></svg>
              {{ item.status }}
            </div>
            
            <div v-if="item.statusCode === 'pending'" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF4E3] text-[#F59E0B] border border-[#F59E0B]/20 text-[12px] font-medium whitespace-nowrap">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3"></path></svg>
              {{ item.status }}
            </div>

            <span class="text-[12px] text-gray-400 whitespace-nowrap">{{ item.statusDesc }}</span>
          </div>
        </template>

       <template #aksi="{ item }">
          <div class="flex items-center gap-2">
            <button 
              @click="openDetail(item)"
              class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#EAF8FF] transition-colors focus:outline-none"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>

            <div>
              <button 
                @click="toggleDropdown(item.id, $event)"
                class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#EAF8FF] transition-colors focus:outline-none"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
              </button>

              <Teleport to="body">
                <div v-if="activeDropdown === item.id" @click="closeDropdown" class="fixed inset-0 z-998"></div>
                <div 
                  v-if="activeDropdown === item.id" 
                  class="fixed w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-999 py-1.5 font-['Poppins']"
                  :style="{ top: dropdownPos.top, right: dropdownPos.right }"
                >
                  <button @click="closeDropdown" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#EAF8FF] hover:text-[#2BB5F4] transition-colors">
                    Edit
                  </button>
                </div>
              </Teleport>
            </div>
          </div>
        </template>

      </TableSuperAdmin>

      <PaginationSuperAdmin 
        v-model:current-page="currentPage"
        :total-data="listTagihanLengkap.length"
        :per-page="itemsPerPage"
      />
    </div>

    <DetailPanel :is-open="isDetailOpen" @close="isDetailOpen = false">
      
      <template #header v-if="selectedDetail">
        <div class="px-6 md:px-8 pb-4 flex items-center gap-4">
          
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <img :src="Invoice" alt="Invoice Icon" class="w-6 h-6" />
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-1.5">
              <h2 class="text-[20px] font-bold text-white tracking-wide">Monthly Invoice</h2>
              
              <div v-if="selectedDetail.statusCode === 'success'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CDF2E6] text-[#38CA99] text-[13px] shadow-sm">
                <img :src="Lunas" class="w-3.5 h-3.5" alt="Lunas" /> Lunas
              </div>
              <div v-else-if="selectedDetail.statusCode === 'pending'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5DA] text-[#F59E0B] text-[13px] shadow-sm">
                <img :src="MenungguPembayaran" class="w-3.5 h-3.5" alt="Menunggu" /> Menunggu Pembayaran
              </div>
            </div>
            <div class="text-[13px] text-white/90">
              Invoice Date : {{ selectedDetail.dateRange.split(' • ')[0] }}
            </div>
          </div>
        </div>
      </template>

      <template #body v-if="selectedDetail">
        <div class="px-6 md:px-8 py-6 flex flex-col gap-6 h-full min-h-[calc(100vh-200px)]">
          
          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
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

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-[15px] font-bold text-gray-800 mb-1">Rincian Paket</h3>
            <p class="text-[13px] text-gray-400 mb-6">Paket dan layanan yang digunakan selama periode tagihan ini.</p>

            <div class="space-y-4">
              <div class="flex justify-between text-[15px]">
                <span class="text-gray-500">Business Plan</span>
                <span class="text-gray-800 font-medium">Rp1.500.000</span>
              </div>
              <div class="flex justify-between text-[15px]">
                <span class="text-gray-500">Diskon</span>
                <span class="text-gray-800 font-medium">Rp0</span>
              </div>
              <div class="flex justify-between text-[15px] pt-4 mt-2 border-t border-gray-100">
                <span class="text-gray-800 font-bold">Total</span>
                <span class="text-gray-800 font-bold">Rp1.500.000</span>
              </div>
            </div>
          </div>

          <div class="flex-1"></div>

          <div v-if="selectedDetail.statusCode === 'success'" class="mt-4">
            <button class="w-full py-3.5 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] flex items-center justify-center gap-2 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Invoice
            </button>
          </div>

          <div v-else-if="selectedDetail.statusCode === 'pending'" class="mt-4 flex flex-col gap-3">
            <p class="text-[11px] text-gray-400 text-right md:w-1/2 self-end">Pastikan pembayaran telah diterima sebelum melakukan konfirmasi.</p>
            <div class="flex flex-col md:flex-row gap-4">
              <button class="flex-1 py-3.5 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] flex items-center justify-center gap-2 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Invoice
              </button>
              <button @click="openAlert" class="flex-1 py-3.5 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors">
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>

        </div>
      </template>
    </DetailPanel>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isAlertOpen" class="fixed inset-0 z-10000 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeAlert"></div>
          
          <div class="relative bg-white rounded-3xl w-full max-w-100 p-8 flex flex-col items-center text-center shadow-2xl z-10">
            
            <button @click="closeAlert" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <img :src="KonfirmasiBayar" alt="Ilustrasi Konfirmasi" class="w-32 h-32 mb-4" />

            <h3 class="text-[18px] font-bold text-gray-800 mb-3">Konfirmasi Pembayaran</h3>
            <p class="text-[14px] text-gray-500 mb-8 leading-relaxed">
              Tindakan ini menandai tagihan sebagai <span class="font-bold text-gray-700">Lunas</span> dan mengaktifkan layanan perusahaan.
            </p>

            <div class="flex w-full gap-4">
              <button @click="closeAlert" class="flex-1 py-2.5 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] transition-colors">
                Batal
              </button>
              <button @click="confirmPayment" class="flex-1 py-2.5 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors">
                Konfirmasi Pembayaran
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>