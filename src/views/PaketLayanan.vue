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
import DetailPanel from '@/components/common/DetailPanel.vue'; 

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

// 🌟 STATE UNTUK PANEL (CREATE & EDIT) 🌟
const isDetailOpen = ref(false);
const selectedDetail = ref(null);
const panelMode = ref('create'); // Menyimpan mode saat ini: 'create' atau 'edit'

// Form State
const formData = ref({
  namaPaket: '',
  deskripsi: '',
  jenisHarga: 'bulanan',
  harga: '',
  durasi: '1 Bulan',
  aktifkanTahunan: false,
  kuotaVisit: '',
  jumlahCabang: '',
  jumlahAkun: '',
  storageLimit: ''
});

// Fungsi Reset Form ke Kosong (Untuk Buat Paket)
const resetForm = () => {
  formData.value = {
    namaPaket: '', deskripsi: '', jenisHarga: 'bulanan', harga: '', durasi: '1 Bulan',
    aktifkanTahunan: false, kuotaVisit: '', jumlahCabang: '', jumlahAkun: '', storageLimit: ''
  };
};

// 🌟 FUNGSI: BUKA PANEL BUAT PAKET BARU 🌟
const openCreatePanel = () => {
  panelMode.value = 'create';
  resetForm(); // Pastikan form kosong
  isDetailOpen.value = true;
};

// 🌟 FUNGSI: BUKA PANEL EDIT PAKET 🌟
const openEditPanel = (item) => {
  panelMode.value = 'edit';
  selectedDetail.value = item;
  
  // Simulasi isi form dengan data yang mau diedit
  formData.value.namaPaket = item.infoPaket;
  formData.value.deskripsi = item.detail;
  
  isDetailOpen.value = true;
  closeDropdown();
};

const handleSave = () => {
  console.log(`Menyimpan data mode ${panelMode.value}:`, formData.value);
  isDetailOpen.value = false;
};
</script>

<template>    
  <div class="bg-white rounded-2xl p-6 shadow-sm min-h-full flex flex-col">
    
    <PageHeader 
      title="Paket & Layanan" 
      subtitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry." 
    />

    <hr class="border-gray-100 mt-1 mb-4" />

    <SearchFilterBar 
      v-model="searchQuery" 
      placeholderText="Cari berdasarkan nama paket"
    >
      <template #action>
        <button @click="openCreatePanel" class="px-5 py-2.5 border-2 border-[#2BB5F4] text-[#2BB5F4] rounded-lg font-medium text-[13px] md:text-sm hover:bg-[#2BB5F4] hover:text-white transition-all whitespace-nowrap">
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
                <button @click="openEditPanel(item)" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#E8F8F3] hover:text-[#2BB5F4] transition-colors">
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
      
      <template #header>
        <div class="px-6 md:px-8 pt-0 pb-0 relative z-20">
            <h2 class="text-lg mb-4 font-bold text-white tracking-wide">
              {{ panelMode === 'create' ? 'Buat Paket' : 'Edit Paket' }}
            </h2>
        </div>
      </template>

      <template #body>
        <div class="px-6 md:px-8 py-6 pb-10 space-y-6 bg-[#F8FAFC]">
          
          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-[15px] font-bold text-gray-800 mb-5 border-b border-gray-50 pb-3">Informasi Paket</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Nama Paket <span class="text-red-500">*</span></label>
                <input v-model="formData.namaPaket" type="text" placeholder="Contoh: Visitor free" class="w-full border border-[#2BB5F4] rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2BB5F4]" />
              </div>
              <div>
                <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Deskripsi <span class="text-red-500">*</span></label>
                <textarea v-model="formData.deskripsi" placeholder="Masukan Deskripsi paket disini..." rows="3" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4] resize-none"></textarea>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-[15px] font-bold text-gray-800 mb-1">Harga dan Durasi Paket</h3>
            <p class="text-[12px] text-gray-400 mb-5 border-b border-gray-50 pb-3">Harga berlaku untuk pelanggan baru setelah paket diaktifkan.</p>
            
            <div class="space-y-5">
              <div>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="radio" v-model="formData.jenisHarga" value="bulanan" class="mt-1 w-4 h-4 text-[#2BB5F4] focus:ring-[#2BB5F4]" />
                  <div>
                    <div class="text-[14px] text-gray-800 font-medium">Harga Bulanan</div>
                    <div class="text-[12px] text-gray-400">Harga yang harus dibayar pelanggan setiap bulan</div>
                  </div>
                </label>
                
                <div v-if="formData.jenisHarga === 'bulanan'" class="mt-4 ml-7 flex flex-col md:flex-row gap-4">
                  <div class="flex-1">
                    <label class="block text-[12px] text-gray-800 font-medium mb-1.5">Harga <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[13px] font-bold text-gray-800">Rp</span>
                      <input v-model="formData.harga" type="number" placeholder="Masukan Harga" class="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <label class="block text-[12px] text-gray-800 font-medium mb-1.5">Durasi <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <select v-model="formData.durasi" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4] bg-white">
                        <option value="1 Bulan">1 Bulan</option>
                        <option value="3 Bulan">3 Bulan</option>
                        <option value="6 Bulan">6 Bulan</option>
                        <option value="12 Bulan">12 Bulan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div v-if="formData.jenisHarga === 'bulanan'" class="mt-4 ml-7 flex items-center gap-3">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="formData.aktifkanTahunan" class="sr-only peer">
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2BB5F4]"></div>
                  </label>
                  <span class="text-[13px] text-gray-800">Aktifkan harga tahunan</span>
                </div>
              </div>

              <hr class="border-gray-50" />

              <div>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="radio" v-model="formData.jenisHarga" value="free" class="mt-1 w-4 h-4 text-[#2BB5F4] focus:ring-[#2BB5F4]" />
                  <div>
                    <div class="text-[14px] text-gray-800 font-medium">Free</div>
                    <div class="text-[12px] text-gray-400">Pelanggan tidak perlu membayar paket ini</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-[15px] font-bold text-gray-800 mb-1">Batas dan Fitur</h3>
            <p class="text-[12px] text-gray-400 mb-5 border-b border-gray-50 pb-3">Batas layanan menentukan kapasitas penggunaan.</p>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Kuota Visit <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input v-model="formData.kuotaVisit" placeholder="Masukan jumlah kuota" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
                  <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[13px] text-gray-500">/ Bulan</span>
                </div>
              </div>
              <div>
                <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Jumlah Cabang <span class="text-red-500">*</span></label>
                <input v-model="formData.jumlahCabang" type="number" placeholder="Masukan maksimum cabang" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
              </div>
              <div>
                <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Jumlah Akun <span class="text-red-500">*</span></label>
                <input v-model="formData.jumlahAkun" type="number" placeholder="Masukan maksimum akun" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
              </div>
              <div>
                <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Storage Limit <span class="text-red-500">*</span></label>
                <input v-model="formData.storageLimit" type="number" placeholder="Masukan maksimum storage" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
              </div>
            </div>
          </div>
          
        </div>

        <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 md:px-8 py-4 flex gap-4 mt-auto">
          <button @click="isDetailOpen = false" class="flex-1 py-3 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] transition-colors">
            Batal
          </button>
          <button @click="handleSave" class="flex-1 py-3 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors">
            Simpan
          </button>
        </div>
      </template>
    </DetailPanel>

  </div>
</template>