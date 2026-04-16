<script setup>
import { ref, computed, onMounted } from 'vue'
import { SwalHelper } from '@/components/utils/SweetAlertHelper.js';

// Import Components
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue' 
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue'; 

// Import API
import { ApiPrice } from '@/services/ApiPrice';

// State Search & Pagination
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// State Data API
const listPaketLengkap = ref([]);
const isLoadingData = ref(false);

// Helper Format Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID').format(angka || 0);
};

// Fetch Data
const fetchPrices = async () => {
  isLoadingData.value = true;
  try {
    const response = await ApiPrice.getAllPrices();
    if (response.message === "Success" && response.data) {
      listPaketLengkap.value = response.data.map(item => ({
        id: item.id,
        infoPaket: item.name,
        detail: item.description,
        bulanan: `Rp ${formatRupiah(item.monthly_price)} / ${item.monthly_quota}`,
        tahunan: `Rp ${formatRupiah(item.yearly_price)} / ${item.yearly_quota}`,
        raw: item 
      }));
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  } finally {
    isLoadingData.value = false;
  }
};

onMounted(() => {
  fetchPrices();
});

// Computed Data untuk Pagination & Search
const listPaketFiltered = computed(() => {
  if (!searchQuery.value) return listPaketLengkap.value;
  return listPaketLengkap.value.filter(item => 
    item.infoPaket.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const listPaketDitampilkan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return listPaketFiltered.value.slice(start, end);
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

// State Create n Edit
const isDetailOpen = ref(false);
const selectedDetail = ref(null);
const panelMode = ref('create'); 
const isSaving = ref(false);

// Form State
const formData = ref({
  namaPaket: '',
  deskripsi: '',
  jenisHarga: 'bulanan',
  harga: '',
  hargaTahunan: '',
  durasi: '1 Bulan',
  aktifkanTahunan: false,
  kuotaVisit: '',
  jumlahCabang: '',
  jumlahAkun: '',
  storageLimit: ''
});

// Fungsi Reset Form
const resetForm = () => {
  formData.value = {
    namaPaket: '', deskripsi: '', jenisHarga: 'bulanan', harga: '', hargaTahunan: '', durasi: '1 Bulan',
    aktifkanTahunan: false, kuotaVisit: '', jumlahCabang: '', jumlahAkun: '', storageLimit: ''
  };
};

const openCreatePanel = () => {
  panelMode.value = 'create';
  resetForm(); 
  isDetailOpen.value = true;
};

const openEditPanel = (item) => {
  panelMode.value = 'edit';
  selectedDetail.value = item;
  
  const raw = item.raw; 
  
  // Set data form sesuai data API
  formData.value = {
    namaPaket: raw.name,
    deskripsi: raw.description,
    jenisHarga: (raw.monthly_price == 0 && raw.yearly_price == 0 && raw.name.toLowerCase() === 'free') ? 'free' : 'bulanan',
    harga: raw.monthly_price || '',
    hargaTahunan: raw.yearly_price || '',
    aktifkanTahunan: raw.yearly_price > 0,
    durasi: '1 Bulan',
    kuotaVisit: raw.monthly_quota || '',
    jumlahCabang: raw.branch_limit || '',
    jumlahAkun: raw.account_limit || '',
    storageLimit: raw.storage_limit || ''
  };
  
  isDetailOpen.value = true;
  closeDropdown();
};

// Fungsi Simpan/Update w SweetAlert
const handleSave = async () => {
  isSaving.value = true;
  try {
    let mPrice = 0, yPrice = 0;
    let mQuota = parseInt(formData.value.kuotaVisit) || 0;
    let yQuota = mQuota * 12;

    if (formData.value.jenisHarga === 'bulanan') {
      mPrice = parseInt(formData.value.harga) || 0;
      if (formData.value.aktifkanTahunan) {
        yPrice = parseInt(formData.value.hargaTahunan) || 0;
      }
    }

    const payload = {
      level: "1",
      name: formData.value.namaPaket,
      description: formData.value.deskripsi,
      monthly_price: mPrice.toString(),
      yearly_price: yPrice.toString(),
      monthly_quota: mQuota.toString(),
      yearly_quota: yQuota.toString(),
      branch_limit: formData.value.jumlahCabang.toString(),
      account_limit: formData.value.jumlahAkun.toString(),
      storage_limit: formData.value.storageLimit.toString(),
      retention: "3",
      open_api: false,
      signage_limit: "1",
      event_visitor_limit: "1000"
    };

    if (panelMode.value === 'create') {
      await ApiPrice.createPrice(payload);
    } else {
      await ApiPrice.updatePrice(selectedDetail.value.id, payload);
    }

    isDetailOpen.value = false;
    await fetchPrices(); 
    
    // Notif
    SwalHelper.success('Berhasil!', `Paket berhasil di${panelMode.value === 'create' ? 'simpan' : 'perbarui'}.`);

  } catch (error) {
    console.error("Gagal menyimpan:", error);
    SwalHelper.error('Gagal Menyimpan', error.message);
  } finally {
    isSaving.value = false;
  }
};

const handleDelete = async (id) => {
  closeDropdown();

  const result = await SwalHelper.confirmDelete('Paket');

  if (result.isConfirmed) {
    try {
      SwalHelper.showLoading('Menghapus Paket...'); 

      await ApiPrice.deletePrice(id); 
      await fetchPrices(); 

      SwalHelper.success('Terhapus!', 'Paket berhasil dihapus.'); 

    } catch(error) {
      SwalHelper.error('Gagal Menghapus', error.message); 
    }
  }
};
</script>

<template>    
  <div class="bg-white rounded-2xl p-6 shadow-sm min-h-full flex flex-col relative">
    
    <PageHeader 
      title="Paket & Layanan" 
      subtitle="Manajemen harga dan spesifikasi paket Visitorku." 
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

    <div class="flex-1 flex flex-col justify-between relative min-h-75">
      
      <div v-if="isLoadingData" class="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
         <span class="text-[#2BB5F4] font-medium text-[13px] animate-pulse">Mengambil data...</span>
      </div>

      <TableSuperAdmin :columns="tableColumns" :data="listPaketDitampilkan">
        
        <template #info="{ item }">
          <div class="text-gray-700 font-medium">{{ item.infoPaket }}</div>
          <div class="text-gray-400 mt-0.5 text-[12px]">{{ item.detail }}</div>
        </template>

        <template #bulanan="{ item }">
          <div class="text-[13px] text-gray-700">{{ item.bulanan }}</div>
        </template>

        <template #tahunan="{ item }">
          <div class="text-[13px] text-gray-700">{{ item.tahunan }}</div>
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
                <button @click="handleDelete(item.id)" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                  Hapus Paket
                </button>
              </div>
            </Teleport>
          </div>
        </template>

      </TableSuperAdmin>

      <PaginationSuperAdmin 
        v-model:current-page="currentPage"
        :total-data="listPaketFiltered.length"
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
                    <div class="text-[14px] text-gray-800 font-medium">Harga Berbayar</div>
                    <div class="text-[12px] text-gray-400">Harga yang harus dibayar pelanggan</div>
                  </div>
                </label>
                
                <div v-if="formData.jenisHarga === 'bulanan'" class="mt-4 ml-7 flex flex-col gap-4">
                  <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                      <label class="block text-[12px] text-gray-800 font-medium mb-1.5">Harga Bulanan<span class="text-red-500">*</span></label>
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

                  <div class="flex items-center gap-3">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="formData.aktifkanTahunan" class="sr-only peer">
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2BB5F4]"></div>
                    </label>
                    <span class="text-[13px] text-gray-800">Aktifkan harga tahunan</span>
                  </div>

                  <div v-if="formData.aktifkanTahunan" class="flex flex-col md:flex-row gap-4 pt-1">
                    <div class="flex-1">
                      <label class="block text-[12px] text-gray-800 font-medium mb-1.5">Harga Tahunan<span class="text-red-500">*</span></label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[13px] font-bold text-gray-800">Rp</span>
                        <input v-model="formData.hargaTahunan" type="number" placeholder="Masukan Harga Tahunan" class="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
                      </div>
                    </div>
                    <div class="flex-1">
                      <label class="block text-[12px] text-gray-800 font-medium mb-1.5">Durasi <span class="text-red-500">*</span></label>
                      <div class="relative">
                        <select disabled class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-500 bg-gray-100 cursor-not-allowed appearance-none">
                          <option value="1 Tahun">1 Tahun</option>
                        </select>
                      </div>
                    </div>
                  </div>

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
                  <input v-model="formData.kuotaVisit" type="number" placeholder="Masukan jumlah kuota" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
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
                <label class="block text-[13px] text-gray-800 font-medium mb-1.5">Storage Limit (MB) <span class="text-red-500">*</span></label>
                <input v-model="formData.storageLimit" type="number" placeholder="Masukan maksimum storage" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]" />
              </div>
            </div>
          </div>
          
        </div>

        <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 md:px-8 py-4 flex gap-4 mt-auto z-30">
          <button @click="isDetailOpen = false" class="flex-1 py-3 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] transition-colors">
            Batal
          </button>
          <button 
            @click="handleSave" 
            :disabled="isSaving"
            class="flex-1 py-3 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </template>
    </DetailPanel>

  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield; 
  appearance: textfield;   
}
</style>
