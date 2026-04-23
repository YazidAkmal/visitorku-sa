<script setup>
import { ref, computed, onMounted } from 'vue';

// IMPORT COMPONENTS
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue' 
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue';
import AdminForm from '@/components/common/PenggunaForm.vue';

// IMPORT HELPER & API
import { SwalHelper } from '@/components/utils/SweetAlertHelper';
import { ApiAdmin } from '@/services/ApiAdmin';

const searchQuery = ref(''); 
const currentPage = ref(1);
const itemsPerPage = ref(5); 
const isLoadingData = ref(false);
const listAdminLengkap = ref([]);

const formatDateShort = (dateStr) => !dateStr ? '-' : dateStr.split('T')[0];

const fetchAdminData = async () => {
  isLoadingData.value = true;
  try {
    const response = await ApiAdmin.getAdmins();
    if (response.message === "Success" && response.data) {
      listAdminLengkap.value = response.data.map(item => ({
        id: item.id, nama: item.name || '-', email: item.email || '-',
        created_at: formatDateShort(item.created_at), updated_at: formatDateShort(item.updated_at),
      }));
    }
  } catch (error) { console.error("Gagal mengambil data Admin:", error); } finally { isLoadingData.value = false; }
};

onMounted(() => fetchAdminData());

const listAdminFiltered = computed(() => {
  if (!searchQuery.value) return listAdminLengkap.value;
  return listAdminLengkap.value.filter(item => item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const listAdminDitampilkan = computed(() => listAdminFiltered.value.slice((currentPage.value - 1) * itemsPerPage.value, (currentPage.value - 1) * itemsPerPage.value + itemsPerPage.value));

const tableColumns = [
  { key: 'nama', label: 'Nama', width: 'w-[30%]' }, { key: 'email', label: 'E-Mail', width: 'w-[30%]' },
  { key: 'detail_tanggal', label: 'Detail', width: 'w-[30%]' }, { key: 'aksi', label: 'Aksi', width: 'w-[10%]', sortable: false }
];

const activeDropdown = ref(null);
const dropdownPos = ref({ top: '0px', right: '0px' }); 
const toggleDropdown = (id, event) => {
  if (activeDropdown.value === id) { activeDropdown.value = null; return; }
  activeDropdown.value = id; dropdownPos.value = { top: `${event.currentTarget.getBoundingClientRect().bottom + 8}px`, right: `${window.innerWidth - event.currentTarget.getBoundingClientRect().right}px` };
};
const closeDropdown = () => { activeDropdown.value = null; };

const isDetailOpen = ref(false);
const panelMode = ref('create'); 
const isSaving = ref(false);

const formData = ref({ id: null, nama: '', email: '', password: '', confirmPassword: '' });
const resetForm = () => { formData.value = { id: null, nama: '', email: '', password: '', confirmPassword: '' }; };

const openCreatePanel = () => { panelMode.value = 'create'; resetForm(); isDetailOpen.value = true; };
const openEditPanel = (item) => {
  panelMode.value = 'edit';
  formData.value = { id: item.id, nama: item.nama, email: item.email, password: '', confirmPassword: '' };
  isDetailOpen.value = true; closeDropdown();
};

const handleSave = async () => {
  if (formData.value.password !== formData.value.confirmPassword) return SwalHelper.error('Validasi Gagal', 'Password dan Konfirmasi Password tidak cocok!');
  if (panelMode.value === 'create' && !formData.value.password) return SwalHelper.error('Validasi Gagal', 'Password wajib diisi untuk Admin baru!');

  isSaving.value = true;
  try {
    const payload = { name: formData.value.nama, email: formData.value.email };
    if (formData.value.password) { payload.password = formData.value.password; payload.c_password = formData.value.confirmPassword; }

    if (panelMode.value === 'create') await ApiAdmin.createAdmin(payload);
    else await ApiAdmin.updateAdmin(formData.value.id, payload);

    isDetailOpen.value = false; await fetchAdminData(); 
    SwalHelper.success('Berhasil!', `Data admin berhasil di${panelMode.value === 'create' ? 'simpan' : 'perbarui'}.`);
  } catch (error) { SwalHelper.error('Gagal Menyimpan', error.message); } finally { isSaving.value = false; }
};

const handleDelete = async (id) => {
  closeDropdown();
  const result = await SwalHelper.confirmDelete('Admin');
  if (result.isConfirmed) {
    try {
      SwalHelper.showLoading('Menghapus Admin...'); await ApiAdmin.deleteAdmin(id); await fetchAdminData(); 
      SwalHelper.success('Terhapus!', 'Admin berhasil dihapus.');
    } catch (error) { SwalHelper.error('Gagal Menghapus', error.message); }
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 min-h-full flex flex-col min-w-0 w-full relative">
    
    <PageHeader title="Daftar Pengguna" subtitle="Manajemen akun akses Super Admin Visitorku." />
    <hr class="border-gray-100 mt-1 mb-4" />

    <SearchFilterBar v-model="searchQuery" placeholderText="Cari berdasarkan nama atau email">
      <template #action>
        <button @click="openCreatePanel" class="px-5 py-2.5 border-2 border-[#2BB5F4] text-[#2BB5F4] rounded-lg font-medium text-[13px] md:text-sm hover:bg-[#2BB5F4] hover:text-white transition-all whitespace-nowrap">
          + Tambah Admin
        </button>
      </template>
    </SearchFilterBar>

    <div class="flex-1 flex flex-col justify-between min-w-0 relative min-h-75">
      <div v-if="isLoadingData" class="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
         <span class="text-[#2BB5F4] font-medium text-[13px] animate-pulse">Mengambil data...</span>
      </div>

      <TableSuperAdmin :columns="tableColumns" :data="listAdminDitampilkan">
        <template #nama="{ item }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#EAF8FF] text-[#2BB5F4] flex items-center justify-center text-[12px] font-bold shrink-0">
               {{ item.nama.charAt(0).toUpperCase() }}
            </div>
            <span class="text-gray-800 font-medium whitespace-nowrap">{{ item.nama }}</span>
          </div>
        </template>
        <template #email="{ item }"><span class="text-gray-600 text-[13px] whitespace-nowrap">{{ item.email }}</span></template>
        <template #detail_tanggal="{ item }">
          <div class="flex flex-col gap-0.5 text-[12.5px] whitespace-nowrap">
            <div class="text-gray-400"><span class="font-medium">Create:</span> {{ item.created_at }}</div>
            <div class="text-gray-400"><span class="font-medium">Update:</span> {{ item.updated_at }}</div>
          </div>
        </template>
        <template #aksi="{ item }">
          <div>
            <button @click="toggleDropdown(item.id, $event)" class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#E8F8F3] transition-colors focus:outline-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            <Teleport to="body">
              <div v-if="activeDropdown === item.id" @click="closeDropdown" class="fixed inset-0 z-998"></div>
              <div v-if="activeDropdown === item.id" class="fixed w-36 bg-white border border-gray-100 rounded-lg z-999 py-1.5 font-['Poppins']" :style="{ top: dropdownPos.top, right: dropdownPos.right }">
                <button @click="openEditPanel(item)" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#EAF8FF] hover:text-[#2BB5F4] transition-colors">Edit Admin</button>
                <button @click="handleDelete(item.id)" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">Hapus Admin</button>
              </div>
            </Teleport>
          </div>
        </template>
      </TableSuperAdmin>
      
      <PaginationSuperAdmin v-model:current-page="currentPage" :total-data="listAdminFiltered.length" :per-page="itemsPerPage" />
    </div>

    <DetailPanel :is-open="isDetailOpen" @close="isDetailOpen = false">
      <template #header>
        <div class="px-6 md:px-8 pt-0 pb-0 relative z-20">
            <h2 class="text-lg mb-4 font-bold text-white tracking-wide">
              {{ panelMode === 'create' ? 'Tambah Admin Baru' : 'Edit Data Admin' }}
            </h2>
        </div>
      </template>

      <template #body>
        <AdminForm 
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