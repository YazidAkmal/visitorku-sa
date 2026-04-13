<script setup>
import { ref, computed } from 'vue';

// 🌟 IMPORT ASSET BINTANG 🌟
import FreePlanVector from '@/assets/images/icon/free-plan-vector.svg'; 

import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue' 
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue';

const searchQuery = ref(''); 
const currentPage = ref(1);
const itemsPerPage = ref(5); 

const listPerusahaan = [
  { id: 1, nama: 'Diskominfo Pemalang', alamat: 'Jl. Suro Hadikusumo, Kebondalem, Kec. Pemalang, Kab. Pemalang, Jawa Tengah', pic_nama: 'Wildan', pic_telp: '08567684123' },
  { id: 2, nama: 'BP2JK WILAYAH YOGYAKARTA', alamat: 'Jl. Laksda Adisucipto No.165, Demangan Baru, Caturtunggal, Depok, Sleman', pic_nama: 'Budi', pic_telp: '08123456789' }
];

const listPerusahaanDitampilkan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return listPerusahaan.slice(start, start + itemsPerPage.value);
});

const tableColumns = [
  { key: 'nama', label: 'Nama Perusahaan' },
  { key: 'alamat', label: 'Alamat Perusahaan', width: 'w-[45%]' },
  { key: 'pic', label: 'PIC' },
  { key: 'aksi', label: 'Aksi', sortable: false }
];

const activeDropdown = ref(null);
const dropdownPos = ref({ top: '0px', right: '0px' }); 

const toggleDropdown = (id, event) => {
  if (activeDropdown.value === id) { activeDropdown.value = null; return; }
  activeDropdown.value = id;
  const rect = event.currentTarget.getBoundingClientRect();
  dropdownPos.value = { top: `${rect.bottom + 8}px`, right: `${window.innerWidth - rect.right}px` };
};
const closeDropdown = () => { activeDropdown.value = null; };

const isDetailOpen = ref(false);
const selectedDetail = ref(null);

const openDetail = (item) => {
  selectedDetail.value = item;
  isDetailOpen.value = true;
};

const activeTab = ref('Latest Visitor');
const miniTableColumns = [
  { key: 'nama', label: 'Nama' },
  { key: 'kontak', label: 'Kontak', width: 'w-[40%]' },
  { key: 'check_in', label: 'Check-in' }
];
const latestVisitors = [
  { id: 1, nama: 'Yohanes Wahyu', email: 'wahyuiswantoro@gmail.com', phone: '085729366870', check_in: '05-12-2025 09:09:19' }
];
</script>

<template>    
  <div class="bg-white rounded-2xl p-4 md:p-6 shadow-sm min-h-full flex flex-col min-w-0 w-full">
    
    <PageHeader title="Daftar Perusahaan" subtitle="Daftar perusahaan pengguna Visitorku." />
    <hr class="border-gray-100 mt-1 mb-4" />
    <SearchFilterBar v-model="searchQuery" placeholderText="Cari berdasarkan nama perusahaan" />

    <div class="flex-1 flex flex-col justify-between min-w-0">
      <TableSuperAdmin :columns="tableColumns" :data="listPerusahaanDitampilkan">
        <template #alamat="{ item }">
          <span class="text-gray-800 whitespace-nowrap">{{ item.alamat }}</span>
        </template>
        <template #pic="{ item }">
          <div class="text-gray-700 font-medium whitespace-nowrap">{{ item.pic_nama }}</div>
          <div class="text-gray-400 mt-0.5 whitespace-nowrap">{{ item.pic_telp }}</div>
        </template>
        <template #aksi="{ item }">
          <div class="flex items-center gap-2">
            <button @click="openDetail(item)" class="w-8 h-8 flex items-center justify-center border border-[#38CA99] rounded-lg text-[#38CA99] hover:bg-[#E8F8F3] transition-colors focus:outline-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>
            <div>
              <button @click="toggleDropdown(item.id, $event)" class="w-8 h-8 flex items-center justify-center border border-[#38CA99] rounded-lg text-[#38CA99] hover:bg-[#E8F8F3] transition-colors focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
              </button>
              <Teleport to="body">
                <div v-if="activeDropdown === item.id" @click="closeDropdown" class="fixed inset-0 z-998"></div>
                <div v-if="activeDropdown === item.id" class="fixed w-36 bg-white border border-gray-100 rounded-lg shadow-xl z-999 py-1.5 font-['Poppins']" :style="{ top: dropdownPos.top, right: dropdownPos.right }">
                  <button @click="closeDropdown" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">Hapus Data</button>
                </div>
              </Teleport>
            </div>
          </div>
        </template>
      </TableSuperAdmin>
      <PaginationSuperAdmin v-model:current-page="currentPage" :total-data="listPerusahaan.length" :per-page="itemsPerPage" />
    </div>

    <DetailPanel :is-open="isDetailOpen" @close="isDetailOpen = false">
      
      <template #header v-if="selectedDetail">
        <div class="px-6 md:px-8 pb-6 flex items-center gap-4">
          <div class="w-13 h-13 bg-white rounded-full flex items-center justify-center text-[#2BB5F4] text-[18px] font-bold shadow-sm shrink-0">
            DP
          </div>
          <div>
            <h2 class="text-[20px] font-bold text-white mb-0.5 tracking-wide">{{ selectedDetail.nama }}</h2>
            <div class="text-[12px] text-white/90">
              <span class="font-semibold text-white">Terdaftar Sejak:</span> 12 Juni 2024 &nbsp;|&nbsp; 
              <span class="font-semibold text-white">Aktivitas Terakhir:</span> 2 jam lalu
            </div>
          </div>
        </div>

        <div class="px-6 md:px-8">
          
          <div class="relative z-20 flex h-14 md:h-15 rounded-t-[14px] bg-[#DDF4FF] shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-[1.5px] border-white">
            
            <div class="bg-linear-to-r from-[#98E3FF] to-[#2BB5F4] px-5 flex items-center justify-center gap-2.5 shrink-0 rounded-tl-[14px] rounded-br-2xl">
              <img :src="FreePlanVector" alt="Free Plan Icon" class="w-5.5 h-5.5" />
              <span class="text-white font-medium text-[15px]">Free Plan</span>
            </div>
            
            <div class="flex-1 px-5 flex flex-col justify-center">
              <div class="text-[12px] text-gray-700 font-medium mb-1">Batas Kunjungan</div>
              <div class="w-full h-1 bg-[#BCE6FF] rounded-full overflow-hidden mb-1.5">
                <div class="h-full bg-[#2BB5F4] w-[0%]"></div>
              </div>
              <div class="flex justify-between text-[10.5px] text-gray-500 font-medium">
                <span>0% used</span>
                <span>250/bulan</span>
              </div>
            </div>

          </div>
        </div>
      </template>

      <template #body v-if="selectedDetail">
        
        <div class="px-6 md:px-8 mb-8 mt-6">
          <h3 class="text-[15px] font-semibold text-[#2BB5F4] mb-1">Ringkasan Perusahaan</h3>
          <p class="text-[12px] text-gray-400 mb-4">Gambaran singkat kondisi dan aktivitas perusahaan saat ini.</p>
          
          <div class="grid grid-cols-3 gap-3 md:gap-4">
            <div class="bg-white rounded-xl p-4 text-center">
              <div class="text-[12px] text-gray-500 font-medium mb-2.5">Total Visitor</div>
              <div class="text-2xl font-bold text-gray-900 leading-none">141</div>
            </div>
            <div class="bg-white rounded-xl p-4 text-center">
              <div class="text-[12px] text-gray-500 font-medium mb-2.5">Total Visit</div>
              <div class="text-2xl font-bold text-gray-900 leading-none">187</div>
            </div>
            <div class="bg-white rounded-xl p-4 text-center">
              <div class="text-[12px] text-gray-500 font-medium mb-2.5">Total Pengguna</div>
              <div class="text-2xl font-bold text-gray-900 leading-none">1</div>
            </div>
          </div>
        </div>

        <div class="px-6 md:px-8 mb-8 relative z-20">
          <div class="bg-white rounded-xl p-6">
            <h3 class="text-[14px] font-semibold text-gray-800 mb-5">Informasi Perusahaan</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
              <div class="col-span-1 md:col-span-3">
                <div class="text-[11px] text-gray-400 font-medium mb-1">Nama Perusahaan</div>
                <div class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ selectedDetail.nama }}</div>
              </div>
              <div class="col-span-1">
                <div class="text-[11px] text-gray-400 font-medium mb-1">Alamat Email</div>
                <div class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">wildan@bp2jk.go.id</div>
              </div>
              <div class="col-span-1">
                <div class="text-[11px] text-gray-400 font-medium mb-1">Nomor Telepon</div>
                <div class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">250112040</div>
              </div>
              <div class="col-span-1">
                <div class="text-[11px] text-gray-400 font-medium mb-1">PIC</div>
                <div class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ selectedDetail.pic_nama }}</div>
              </div>
              <div class="col-span-1 md:col-span-3">
                <div class="text-[11px] text-gray-400 font-medium mb-1">Alamat</div>
                <div class="text-[13px] text-gray-800 leading-relaxed">{{ selectedDetail.alamat }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 md:px-8 mb-4 flex gap-4 items-center">
          <span class="text-[13px] text-gray-500 font-medium mr-1.5">Filter</span>
          <button @click="activeTab = 'Jumlah Visitor'" class="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-colors focus:outline-none" :class="activeTab === 'Jumlah Visitor' ? 'border-[#2BB5F4] text-[#2BB5F4] bg-[#2BB5F4]/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'">Jumlah Visitor</button>
          <button @click="activeTab = 'Latest Visitor'" class="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-colors focus:outline-none" :class="activeTab === 'Latest Visitor' ? 'border-[#2BB5F4] text-[#2BB5F4] bg-[#2BB5F4]/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'">Latest Visitor</button>
        </div>

        <div class="px-6 md:px-8">
          <div v-if="activeTab === 'Jumlah Visitor'">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-[14px] text-gray-800 font-medium">Jumlah visitor 30 hari terakhir</h3>
              <div class="flex items-center gap-4 text-[12px]">
                <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-[#2BB5F4]"></div><span class="text-gray-500">Visitor</span></div>
                <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-[#F59E0B]"></div><span class="text-gray-500">Visit</span></div>
              </div>
            </div>
            <div class="w-full h-62.5 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center text-gray-400 border-dashed">
              <span class="text-[13px] font-medium">Area Integrasi Grafik</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'Latest Visitor'">
            <div class="flex items-center justify-between mb-3.5">
              <h3 class="text-[14px] text-gray-800 font-medium ml-8">Visitor Terbaru 30 hari terakhir</h3>
            </div>
            <div class="border border-gray-100 rounded-lg ml-8 mr-4 overflow-hidden">
              <TableSuperAdmin :columns="miniTableColumns" :data="latestVisitors">
                <template #nama="{ item }">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full bg-[#EAF8FF] text-[#2BB5F4] flex items-center justify-center text-[11px] font-bold shrink-0">DP</div>
                    <span class="text-[12px] text-gray-800 font-medium whitespace-nowrap">{{ item.nama }}</span>
                  </div>
                </template>
                <template #kontak="{ item }">
                  <div class="text-[12px] text-gray-600 whitespace-nowrap">{{ item.email }}</div>
                  <div class="text-[11px] text-gray-400 mt-0.5 whitespace-nowrap">{{ item.phone }}</div>
                </template>
                <template #check_in="{ item }">
                  <span class="text-[12px] text-gray-600 whitespace-nowrap">{{ item.check_in }}</span>
                </template>
              </TableSuperAdmin>
            </div>
          </div>

      </template>
    </DetailPanel>

  </div>
</template>