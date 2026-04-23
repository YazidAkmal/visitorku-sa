<script setup>
import { ref, computed, onMounted } from 'vue'
import { SwalHelper } from '@/components/utils/SweetAlertHelper.js';

// Import Components Utama
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue' 
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue'; 
import PaketLayananForm from '@/components/common/PaketLayananForm.vue';
import ButtonTambah from '@/components/common/ButtonTambah.vue';

// Import API
import { ApiPrice } from '@/services/ApiPrice';

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const listPaketLengkap = ref([]);
const isLoadingData = ref(false);

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

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

onMounted(() => fetchPrices());

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

const tableColumns = [
  { key: 'info', label: 'Informasi Paket', width: 'w-[45%]' },
  { key: 'bulanan', label: 'Bulanan' },
  { key: 'tahunan', label: 'Tahunan' },
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

// State Create n Edit
const isDetailOpen = ref(false);
const selectedDetail = ref(null);
const panelMode = ref('create'); 
const isSaving = ref(false);

const formData = ref({
  namaPaket: '', deskripsi: '', jenisHarga: 'bulanan', harga: '', hargaTahunan: '', durasi: '1 Bulan',
  aktifkanTahunan: false, kuotaVisit: '', jumlahCabang: '', jumlahAkun: '', storageLimit: ''
});

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
  formData.value = {
    namaPaket: raw.name, deskripsi: raw.description,
    jenisHarga: (raw.monthly_price == 0 && raw.yearly_price == 0 && raw.name.toLowerCase() === 'free') ? 'free' : 'bulanan',
    harga: raw.monthly_price || '', hargaTahunan: raw.yearly_price || '', aktifkanTahunan: raw.yearly_price > 0,
    durasi: '1 Bulan', kuotaVisit: raw.monthly_quota || '', jumlahCabang: raw.branch_limit || '',
    jumlahAkun: raw.account_limit || '', storageLimit: raw.storage_limit || ''
  };
  isDetailOpen.value = true;
  closeDropdown();
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    let mPrice = 0, yPrice = 0;
    let mQuota = parseInt(formData.value.kuotaVisit) || 0;
    let yQuota = mQuota * 12;

    if (formData.value.jenisHarga === 'bulanan') {
      mPrice = parseInt(formData.value.harga) || 0;
      if (formData.value.aktifkanTahunan) { yPrice = parseInt(formData.value.hargaTahunan) || 0; }
    }

    const payload = {
      level: "1", name: formData.value.namaPaket, description: formData.value.deskripsi,
      monthly_price: mPrice.toString(), yearly_price: yPrice.toString(), monthly_quota: mQuota.toString(),
      yearly_quota: yQuota.toString(), branch_limit: formData.value.jumlahCabang.toString(),
      account_limit: formData.value.jumlahAkun.toString(), storage_limit: formData.value.storageLimit.toString(),
      retention: "3", open_api: false, signage_limit: "1", event_visitor_limit: "1000"
    };

    if (panelMode.value === 'create') await ApiPrice.createPrice(payload);
    else await ApiPrice.updatePrice(selectedDetail.value.id, payload);

    isDetailOpen.value = false;
    await fetchPrices(); 
    SwalHelper.success('Berhasil!', `Paket berhasil di${panelMode.value === 'create' ? 'simpan' : 'perbarui'}.`);
  } catch (error) {
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
  <div class="bg-white rounded-2xl p-6 min-h-full flex flex-col relative shadow-sm">
    
    <PageHeader title="Paket & Layanan" subtitle="Manajemen harga dan spesifikasi paket Visitorku." />
    <hr class="border-gray-100 mt-1 mb-4" />

    <SearchFilterBar v-model="searchQuery" placeholderText="Cari berdasarkan nama paket">
      <template #action>
        <ButtonTambah @click="openCreatePanel">
          + Buat Paket Baru
        </ButtonTambah>
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
        <template #bulanan="{ item }"><div class="text-[13px] text-gray-700">{{ item.bulanan }}</div></template>
        <template #tahunan="{ item }"><div class="text-[13px] text-gray-700">{{ item.tahunan }}</div></template>

        <template #aksi="{ item }">
          <div>
            <button @click="toggleDropdown(item.id, $event)" class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#E8F8F3] transition-colors focus:outline-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            <Teleport to="body">
              <div v-if="activeDropdown === item.id" @click="closeDropdown" class="fixed inset-0 z-998"></div>
              <div v-if="activeDropdown === item.id" class="fixed w-36 bg-white border border-gray-100 rounded-lg shadow-xl z-999 py-1.5 font-['Poppins']" :style="{ top: dropdownPos.top, right: dropdownPos.right }">
                <button @click="openEditPanel(item)" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#E8F8F3] hover:text-[#2BB5F4] transition-colors">Edit Paket</button>
                <button @click="handleDelete(item.id)" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">Hapus Paket</button>
              </div>
            </Teleport>
          </div>
        </template>
      </TableSuperAdmin>

      <PaginationSuperAdmin v-model:current-page="currentPage" :total-data="listPaketFiltered.length" :per-page="itemsPerPage" />
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
        <PaketLayananForm 
          :formData="formData" 
          :panelMode="panelMode" 
          :isSaving="isSaving"
          @close="isDetailOpen = false"
          @save="handleSave"
        />
      </template>
    </DetailPanel>

  </div>
</template>