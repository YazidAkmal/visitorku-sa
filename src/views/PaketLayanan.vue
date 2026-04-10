<script setup>
import { ref, computed } from 'vue'

// Import Icon
import SearchLogo from '@/assets/images/icon/search-vector.svg'
import FilterLogo from '@/assets/images/icon/filter-vector.svg'

// Import Components
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue' 
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue'; // 👈 Tambahan Import (siap pakai)

// State Search & Pagination
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(4);

// Dummy Data
const listPaketLengkap = [
  { id: 1, infoPaket: 'Visitorku Free', detail: 'Paket awal untuk mu yang ingin mulai mendata pengunjung', bulanan: 'Rp 0/250', tahunan: 'Rp 0/3000' },
  { id: 2, infoPaket: 'Visitorku 500', detail: 'Paket Menengah yang terjangkau', bulanan: 'Rp 375000/500', tahunan: 'Rp 4250000/6000' },
  { id: 3, infoPaket: 'Visitorku 1000', detail: 'Paket besar untuk mu yang memiliki tamu banyak', bulanan: 'Rp 650000/1000', tahunan: 'Rp 7526000/12000' },
  { id: 4, infoPaket: 'Custom', detail: 'Custom by Sales', bulanan: 'Rp 0/0', tahunan: 'Rp 0/0' },
  { id: 5, infoPaket: 'Visitorku Enterprise', detail: 'Fitur tanpa batas', bulanan: 'Rp 2.000.000', tahunan: 'Rp 20.000.000' },
  { id: 6, infoPaket: 'Visitorku Basic', detail: 'Paket untuk UMKM', bulanan: 'Rp 150.000', tahunan: 'Rp 1.500.000' }
];

// Computed Data untuk Pagination 
const listPaketDitampilkan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return listPaketLengkap.slice(start, end);
});

// Pendefinisian Header
const tableColumns = [
  { key: 'info', label: 'Informasi Paket', width: 'w-[45%]' },
  { key: 'bulanan', label: 'Bulanan' },
  { key: 'tahunan', label: 'Tahunan' },
  { key: 'aksi', label: 'Aksi', sortable: false }
];

// State untuk Dropdown Aksi
const activeDropdown = ref(null);
const dropdownPos = ref({ top: '0px', right: '0px' }); 

const toggleDropdown = (id, event) => {
  if (activeDropdown.value === id) {
    activeDropdown.value = null; return;
  }
  activeDropdown.value = id;
  const rect = event.currentTarget.getBoundingClientRect();
  dropdownPos.value = {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`
  };
};

const closeDropdown = () => { activeDropdown.value = null; };

// 👈 Tambahan State untuk Panel Detail (Tidak ada tombol mata, tapi state ini sedia payung sebelum hujan)
const isDetailOpen = ref(false);
const selectedDetail = ref(null);
</script>

<template>    
  <div class="bg-white rounded-2xl p-6 shadow-sm min-h-full flex flex-col">
    
    <PageHeader 
      title="Paket & Layanan" 
      subtitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry." 
    />

    <SearchFilterBar 
      v-model="searchQuery" 
      placeholderText="Cari berdasarkan nama paket"
    >
      <template #action>
        <button class="px-5 py-2.5 border-2 border-[#2BB5F4] text-[#2BB5F4] rounded-lg font-medium text-sm hover:bg-[#2BB5F4] hover:text-white transition-all whitespace-nowrap">
          + Buat Paket Baru
        </button>
      </template>
    </SearchFilterBar>

    <div class="flex-1 flex flex-col justify-between">
      <TableSuperAdmin :columns="tableColumns" :data="listPaketDitampilkan">
        
        <template #info="{ item }">
          <div class="text-gray-700 font-medium">{{ item.infoPaket }}</div>
          <div class="text-gray-400 mt-0.5">{{ item.detail }}</div>
        </template>

        <template #aksi="{ item }">
          <div>
            <button 
              @click="toggleDropdown(item.id, $event)"
              class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#E8F8F3] transition-colors focus:outline-none"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>

            <Teleport to="body">
              <div v-if="activeDropdown === item.id" @click="closeDropdown" class="fixed inset-0 z-998"></div>
              
              <div 
                v-if="activeDropdown === item.id" 
                class="fixed w-36 bg-white border border-gray-100 rounded-lg shadow-xl z-999 py-1.5 font-['Poppins']"
                :style="{ top: dropdownPos.top, right: dropdownPos.right }"
              >
                <button @click="closeDropdown" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#E8F8F3] hover:text-[#2BB5F4] transition-colors">
                  Edit Paket
                </button>
                <button @click="closeDropdown" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                  Hapus Paket
                </button>
              </div>
            </Teleport>
          </div>
        </template>

      </TableSuperAdmin>

      <PaginationSuperAdmin 
        v-model:current-page="currentPage"
        :total-data="listPaketLengkap.length"
        :per-page="itemsPerPage"
      />
      
    </div>

    <DetailPanel :is-open="isDetailOpen" @close="isDetailOpen = false">
       </DetailPanel>

  </div>
</template>