<script setup>
import { ref, computed } from 'vue';

// Import Components
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue'; // 👈 Tambahan Import

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

// 👈 Tambahan State untuk Panel Detail
const isDetailOpen = ref(false);
const selectedDetail = ref(null);

const openDetail = (item) => {
  selectedDetail.value = item;
  isDetailOpen.value = true;
};
</script>

<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 shadow-sm min-h-full flex flex-col min-w-0 w-full">
    
    <PageHeader 
      title="Riwayat Tagihan" 
      subtitle="Data Seluruh tagihan dan pembayaran." 
    />

    <div class="mb-8 flex flex-col lg:flex-row items-center gap-3 bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
      
      <div class="flex-1 w-full bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[13px] font-medium text-gray-800">Total Tagihan Bulan ini</span>
          <svg class="w-3.5 h-3.5 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="text-2xl font-semibold text-gray-900">Rp9.089.141</div>
      </div>

      <div class="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center font-bold text-gray-500 lg:transform-none transform rotate-90 lg:rotate-0">
        =
      </div>

      <div class="flex-1 w-full bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[13px] font-medium text-gray-800">Tagihan Belum Dibayar</span>
          <svg class="w-3.5 h-3.5 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="text-2xl font-semibold text-gray-900">Rp9.089.141</div>
      </div>

      <div class="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center font-bold text-gray-500 lg:transform-none transform rotate-90 lg:rotate-0">
        +
      </div>

      <div class="flex-1 w-full bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
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
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#2BB5F4] text-xl font-bold shadow-sm shrink-0">
            {{ selectedDetail.perusahaan.charAt(0) }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-white mb-1">{{ selectedDetail.noTagihan }}</h2>
            <div class="text-[12px] text-white/90">
              <span class="font-medium">{{ selectedDetail.perusahaan }}</span> • {{ selectedDetail.periode }}
            </div>
          </div>
        </div>
      </template>

      <template #body v-if="selectedDetail">
        <div class="mx-8 -mt-6 relative z-10 bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div class="font-semibold text-gray-800 text-[13px]">Status: <span class="text-[#38CA99]">{{ selectedDetail.status }}</span></div>
        </div>
        <div class="px-8">
           <h3 class="text-[15px] font-semibold text-[#2BB5F4] mb-2">Detail Tagihan</h3>
           <p class="text-sm text-gray-500">Informasi selengkapnya mengenai tagihan ini dapat Anda tampilkan di sini nantinya.</p>
        </div>
      </template>
    </DetailPanel>

  </div>
</template>