<script setup>
import { ref, computed, onMounted } from 'vue';

// IMPORT ASSET
import FreePlanVector from '@/assets/images/icon/free-plan-vector.svg'; 

// IMPORT COMPONENTS
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue' 
import PageHeader from '@/components/common/PageHeader.vue';
import SearchFilterBar from '@/components/common/SearchFilterBar.vue';
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue';
import DetailPanel from '@/components/common/DetailPanel.vue';

// IMPORT API SERVICE
import { ApiCompanyKey } from '@/services/ApiKeyCompany';

const searchQuery = ref(''); 
const currentPage = ref(1);
const itemsPerPage = ref(5); 

// State Tabel Utama
const listPerusahaan = ref([]);
const isLoadingData = ref(false);

// Panel State
const isDetailOpen = ref(false);
const selectedDetail = ref(null);
const isLoadingDetail = ref(false);

const showChart = ref(false); 

const activeTab = ref('Jumlah Visitor'); 

// State Data Detail
const detailCounters = ref({ visitor: 0, visit: 0, user: 0, percentage: 0, quota: 0 });
const detailLatestVisitors = ref([]);

// Apex Charts
const monthlyChartSeries = ref([ { name: 'Visitor', data: [] }, { name: 'Visit', data: [] } ]);

const monthlyChartOptions = ref({
  chart: { type: 'line', toolbar: { show: false }, fontFamily: 'Poppins, sans-serif', selection: { enabled: false }, zoom: { enabled: false }, dropShadow: { enabled: true, top: 5, left: 0, blur: 5, opacity: 0.2 } },
  colors: ['#2D51FD', '#ED9D0F'], 
  stroke: { curve: 'smooth', width: 3 },
  dataLabels: { enabled: true, background: { enabled: true, foreColor: '#fff', padding: 4, borderRadius: 2, borderWidth: 0 }, offsetY: -2 },
  markers: { size: 0, hover: { sizeOffset: 4 } },
  xaxis: { categories: [], title: { text: 'Month', offsetY: 5, style: { color: '#111827', fontSize: '12px', fontWeight: 'bold' } }, labels: { style: { colors: '#64748B', fontSize: '11px' } }, axisBorder: { show: true, color: '#E2E8F0' }, axisTicks: { show: true, color: '#E2E8F0' }, tooltip: { enabled: true }, crosshairs: { show: true, stroke: { color: '#b6b6b6', width: 1, dashArray: 3 } } },
  yaxis: { min: 0, tickAmount: 4, labels: { formatter: (value) => Math.round(value), style: { colors: '#64748B', fontSize: '12px' } } },
  grid: { show: true, borderColor: '#E2E8F0', xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
  tooltip: { enabled: true, shared: true, intersect: false }, 
  states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
  legend: { show: false }, 
});

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
};

const fetchCompanyData = async () => {
  isLoadingData.value = true;
  try {
    const response = await ApiCompanyKey.getCompanies();
    if (response.message === "Success" && response.data) {
      listPerusahaan.value = response.data.map(item => ({
        id: item.id,
        nama: item.name || '-',
        alamat: item.address || '-',
        pic_nama: item.owner || '-',
        pic_telp: item.phone_number || '-', 
        email: item.owner_email || '-',
        created_at: item.created_at,
        quota: item.quota,
        logo: item.logo
      }));
    }
  } catch (error) {
    console.error("Gagal mengambil data Company:", error);
  } finally {
    isLoadingData.value = false;
  }
};

onMounted(() => {
  fetchCompanyData();
});

const openDetail = async (item) => {
  selectedDetail.value = item;
  isDetailOpen.value = true;
  isLoadingDetail.value = true;
  showChart.value = false; 
  
  detailCounters.value = { visitor: 0, visit: 0, user: 0, percentage: 0, quota: item.quota };
  monthlyChartSeries.value = [ { name: 'Visitor', data: [] }, { name: 'Visit', data: [] } ];
  detailLatestVisitors.value = [];

  try {
    const [counterRes, monthlyRes, visitorRes] = await Promise.all([
      ApiCompanyKey.getCounters(item.id),
      ApiCompanyKey.getMonthlyData(item.id),
      ApiCompanyKey.getLatestVisitors(item.id)
    ]);

    if (counterRes.message === "Success" && counterRes.data) {
      detailCounters.value = {
        visitor: counterRes.data.visitor_total,
        visit: counterRes.data.visit_total,
        user: counterRes.data.user_total,
        percentage: counterRes.data.usage_percentage,
        quota: counterRes.data.quota
      };
    }

    if (monthlyRes.message === "Success" && monthlyRes.data) {
      const dataAPI = monthlyRes.data;
      monthlyChartOptions.value = { ...monthlyChartOptions.value, xaxis: { ...monthlyChartOptions.value.xaxis, categories: dataAPI.titles } };
      monthlyChartSeries.value = [ { name: 'Visitor', data: dataAPI.visitors }, { name: 'Visit', data: dataAPI.visits } ];
    }

    if (visitorRes.message === "Success" && visitorRes.data) {
      detailLatestVisitors.value = visitorRes.data.map(v => ({
        id: v.id,
        nama: v.name || '-',
        email: v.email || '-',
        phone: v.phone_number || '-',
        check_in: formatDateTime(v.datetime),
        photo: v.picture_url
      }));
    }
  } catch (error) {
    console.error("Gagal memuat detail data:", error);
  } finally {
    isLoadingDetail.value = false;
    
    setTimeout(() => {
      showChart.value = true;
    }, 300);
  }
};

const listPerusahaanDitampilkan = computed(() => {
  let filtered = listPerusahaan.value;
  if (searchQuery.value) {
    filtered = filtered.filter(item => item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filtered.slice(start, start + itemsPerPage.value);
});

const totalDataFiltered = computed(() => {
  if (!searchQuery.value) return listPerusahaan.value.length;
  return listPerusahaan.value.filter(item => item.nama.toLowerCase().includes(searchQuery.value.toLowerCase())).length;
});

const tableColumns = [
  { key: 'nama', label: 'Nama Perusahaan', width: 'w-[30%]' },
  { key: 'alamat', label: 'Alamat Perusahaan', width: 'w-[40%]' },
  { key: 'pic', label: 'PIC', width: 'w-[20%]' },
  { key: 'aksi', label: 'Aksi', width: 'w-[10%]', sortable: false }
];

const miniTableColumns = [
  { key: 'nama', label: 'Nama' },
  { key: 'kontak', label: 'Kontak', width: 'w-[40%]' },
  { key: 'check_in', label: 'Check-in' }
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
</script>

<template>    
  <div class="bg-white rounded-2xl p-4 md:p-6 min-h-full flex flex-col min-w-0 w-full relative">
    
    <PageHeader title="Daftar Perusahaan" subtitle="Daftar perusahaan pengguna Visitorku." />
    <hr class="border-gray-100 mt-1 mb-4" />
    
    <SearchFilterBar v-model="searchQuery" placeholderText="Cari berdasarkan nama perusahaan" />

    <div class="flex-1 flex flex-col justify-between min-w-0 relative">
      <div v-if="isLoadingData" class="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
         <span class="text-[#2BB5F4] font-medium text-[13px] animate-pulse">Mengambil data...</span>
      </div>

      <TableSuperAdmin :columns="tableColumns" :data="listPerusahaanDitampilkan">
        <template #nama="{ item }">
          <div class="flex items-center gap-3">
            <div v-if="!item.logo" class="w-8 h-8 rounded-full bg-[#EAF8FF] text-[#2BB5F4] flex items-center justify-center text-[12px] font-bold shrink-0">
               {{ item.nama.charAt(0).toUpperCase() }}
            </div>
            <img v-else :src="item.logo" class="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0" />
            <span class="text-gray-800 font-medium whitespace-nowrap">{{ item.nama }}</span>
          </div>
        </template>

        <template #alamat="{ item }">
          <div class="text-gray-800 text-[13px] line-clamp-2 leading-relaxed max-w-50 md:max-w-87.5 lg:max-w-100" :title="item.alamat">
            {{ item.alamat }}
          </div>
        </template>
        
        <template #pic="{ item }">
          <div class="text-gray-700 font-medium whitespace-nowrap">{{ item.pic_nama }}</div>
          <div class="text-gray-400 mt-0.5 whitespace-nowrap text-[12px]">{{ item.pic_telp }}</div>
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
                <div v-if="activeDropdown === item.id" class="fixed w-36 bg-white border border-gray-100 rounded-lg z-999 py-1.5 font-['Poppins']" :style="{ top: dropdownPos.top, right: dropdownPos.right }">
                  <button @click="closeDropdown" class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">Hapus Data</button>
                </div>
              </Teleport>
            </div>
          </div>
        </template>
      </TableSuperAdmin>
      
      <PaginationSuperAdmin v-model:current-page="currentPage" :total-data="totalDataFiltered" :per-page="itemsPerPage" />
    </div>

    <DetailPanel :is-open="isDetailOpen" @close="isDetailOpen = false">
      <template #header v-if="selectedDetail">
        <div class="px-6 md:px-8 pb-6 flex items-center gap-4">
          <img v-if="selectedDetail.logo" :src="selectedDetail.logo" class="w-13 h-13 rounded-full object-cover border-2 border-white/20 shrink-0 bg-white" />
          <div v-else class="w-13 h-13 bg-white rounded-full flex items-center justify-center text-[#2BB5F4] text-[18px] font-bold shadow-sm shrink-0">
            {{ selectedDetail.nama.charAt(0).toUpperCase() }}
          </div>
          
          <div class="flex-1 overflow-hidden">
            <h2 class="text-[20px] font-bold text-white mb-0.5 tracking-wide truncate">{{ selectedDetail.nama }}</h2>
            <div class="text-[12px] text-white/90">
              <span class="font-semibold text-white">Terdaftar Sejak:</span> {{ new Date(selectedDetail.created_at).toLocaleDateString('id-ID') }}
            </div>
          </div>
        </div>

        <div class="px-6 w-211 md:px-8">
          <div class="relative z-20 flex h-14 md:h-15 rounded-t-[14px] bg-[#DDF4FF] shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-[1.5px] border-white">
            <div class="bg-linear-to-r from-[#98E3FF] to-[#2BB5F4] px-5 flex items-center justify-center gap-2.5 shrink-0 rounded-tl-[14px] rounded-br-2xl">
              <img :src="FreePlanVector" alt="Free Plan Icon" class="w-5.5 h-5.5" />
              <span class="text-white font-medium text-[15px]">Free Plan</span>
            </div>
            
            <div class="flex-1 px-5 flex flex-col justify-center">
              <div class="text-[12px] text-gray-700 font-medium mb-1">Batas Kunjungan</div>
              <div class="w-full h-1 bg-[#BCE6FF] rounded-full overflow-hidden mb-1.5">
                <div class="h-full bg-[#2BB5F4] transition-all duration-1000" :style="{ width: `${detailCounters.percentage}%` }"></div>
              </div>
              <div class="flex justify-between text-[10.5px] text-gray-500 font-medium">
                <span>{{ detailCounters.percentage }}% used</span>
                <span>{{ detailCounters.quota }}/bulan</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #body v-if="selectedDetail">
        <div v-if="isLoadingDetail" class="flex flex-col items-center justify-center py-20">
          <svg class="animate-spin h-8 w-8 text-[#2BB5F4] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span class="text-sm text-gray-400">Menyinkronkan data...</span>
        </div>

        <div v-else>
          <div class="px-6 md:px-8 mb-8 mt-6">
            <h3 class="text-[15px] font-semibold text-[#2BB5F4] mb-1">Ringkasan Perusahaan</h3>
            <p class="text-[12px] text-gray-400 mb-4">Gambaran singkat kondisi dan aktivitas perusahaan saat ini.</p>
            
            <div class="grid grid-cols-3 gap-3 md:gap-4">
              <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div class="text-[12px] text-gray-500 font-medium mb-2.5">Total Visitor</div>
                <div class="text-2xl font-bold text-gray-900 leading-none">{{ detailCounters.visitor }}</div>
              </div>
              <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div class="text-[12px] text-gray-500 font-medium mb-2.5">Total Visit</div>
                <div class="text-2xl font-bold text-gray-900 leading-none">{{ detailCounters.visit }}</div>
              </div>
              <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div class="text-[12px] text-gray-500 font-medium mb-2.5">Total Pengguna</div>
                <div class="text-2xl font-bold text-gray-900 leading-none">{{ detailCounters.user }}</div>
              </div>
            </div>
          </div>

          <div class="px-6 md:px-8 mb-8 relative z-20">
            <div class="bg-white rounded-xl p-6 border border-gray-100">
              <h3 class="text-[14px] font-semibold text-gray-800 mb-5">Informasi Perusahaan</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
                <div class="col-span-1 md:col-span-3">
                  <div class="text-[11px] text-gray-400 font-medium mb-1">Nama Perusahaan</div>
                  <div class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ selectedDetail.nama }}</div>
                </div>
                <div class="col-span-1">
                  <div class="text-[11px] text-gray-400 font-medium mb-1">Alamat Email</div>
                  <div class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ selectedDetail.email }}</div>
                </div>
                <div class="col-span-1">
                  <div class="text-[11px] text-gray-400 font-medium mb-1">Nomor Telepon</div>
                  <div class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ selectedDetail.pic_telp }}</div>
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

          <div class="px-6 md:px-8 pb-10">
            <div v-if="activeTab === 'Jumlah Visitor'">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-[14px] text-gray-800 font-medium">Jumlah visitor 1 Tahun Terakhir</h3>
                <div class="flex items-center gap-4 text-[12px]">
                  <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-[#2D51FD]"></div><span class="text-gray-500">Visitor</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-[#ED9D0F]"></div><span class="text-gray-500">Visit</span></div>
                </div>
              </div>
              
              <div class="w-full h-80 border border-gray-100 rounded-xl bg-white flex flex-col p-4 relative">
                <apexchart 
                  v-if="showChart"
                  class="w-full h-full" 
                  type="line" 
                  height="280" 
                  width="100%" 
                  :options="monthlyChartOptions" 
                  :series="monthlyChartSeries" 
                />
                
                <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-[13px]">
                  <svg class="animate-spin h-6 w-6 text-[#2BB5F4] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Merender grafik...
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'Latest Visitor'">
              <div class="flex items-center justify-between mb-3.5">
                <h3 class="text-[14px] text-gray-800 font-medium">Visitor Terbaru 30 hari terakhir</h3>
              </div>
              
              <div v-if="detailLatestVisitors.length" class="border border-gray-100 rounded-lg overflow-hidden bg-white">
                <TableSuperAdmin :columns="miniTableColumns" :data="detailLatestVisitors">
                  <template #nama="{ item }">
                    <div class="flex items-center gap-3">
                      <img v-if="item.photo" :src="item.photo" class="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0 bg-white" />
                      <div v-else class="w-8 h-8 rounded-full bg-[#EAF8FF] text-[#2BB5F4] flex items-center justify-center text-[12px] font-bold shrink-0">
                        {{ item.nama.charAt(0).toUpperCase() }}
                      </div>
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
              <div v-else class="w-full py-10 flex flex-col items-center justify-center text-gray-400 bg-white border border-gray-100 rounded-lg shadow-sm">
                <svg class="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <span class="text-[13px]">Belum ada visitor bulan ini</span>
              </div>
            </div>
          </div>
        </div>

      </template>
    </DetailPanel>

  </div>
</template>

<style scoped>
.apexcharts-canvas:focus,
.apexcharts-canvas svg:focus,
.vue-apexcharts:focus,
.vue-apexcharts {
  outline: none !important;
  box-shadow: none !important;
}
</style>