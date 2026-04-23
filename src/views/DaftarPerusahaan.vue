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
import PerusahaanDetailPanel from '@/components/common/DaftarPerusahaanForm.vue';

// IMPORT API SERVICE
import { ApiCompanyKey } from '@/services/ApiKeyCompany';

// State Tabel Utama
const searchQuery = ref(''); 
const currentPage = ref(1);
const itemsPerPage = ref(5); 
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

// Apex Charts State
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
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

const fetchCompanyData = async () => {
  isLoadingData.value = true;
  try {
    const response = await ApiCompanyKey.getCompanies();
    if (response.message === "Success" && response.data) {
      listPerusahaan.value = response.data.map(item => ({
        id: item.id, nama: item.name || '-', alamat: item.address || '-',
        pic_nama: item.owner || '-', pic_telp: item.phone_number || '-', 
        email: item.owner_email || '-', created_at: item.created_at,
        quota: item.quota, logo: item.logo
      }));
    }
  } catch (error) { console.error("Gagal mengambil data Company:", error); } 
  finally { isLoadingData.value = false; }
};

onMounted(() => fetchCompanyData());

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
      detailCounters.value = { visitor: counterRes.data.visitor_total, visit: counterRes.data.visit_total, user: counterRes.data.user_total, percentage: counterRes.data.usage_percentage, quota: counterRes.data.quota };
    }
    if (monthlyRes.message === "Success" && monthlyRes.data) {
      monthlyChartOptions.value = { ...monthlyChartOptions.value, xaxis: { ...monthlyChartOptions.value.xaxis, categories: monthlyRes.data.titles } };
      monthlyChartSeries.value = [ { name: 'Visitor', data: monthlyRes.data.visitors }, { name: 'Visit', data: monthlyRes.data.visits } ];
    }
    if (visitorRes.message === "Success" && visitorRes.data) {
      detailLatestVisitors.value = visitorRes.data.map(v => ({
        id: v.id, nama: v.name || '-', email: v.email || '-', phone: v.phone_number || '-',
        check_in: formatDateTime(v.datetime), photo: v.picture_url
      }));
    }
  } catch (error) { console.error("Gagal memuat detail:", error); } 
  finally { isLoadingDetail.value = false; setTimeout(() => { showChart.value = true; }, 300); }
};

const listPerusahaanDitampilkan = computed(() => {
  let filtered = listPerusahaan.value;
  if (searchQuery.value) filtered = filtered.filter(item => item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()));
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
        <PerusahaanDetailPanel 
          :isLoadingDetail="isLoadingDetail"
          :selectedDetail="selectedDetail"
          :detailCounters="detailCounters"
          :activeTab="activeTab"
          :showChart="showChart"
          :monthlyChartOptions="monthlyChartOptions"
          :monthlyChartSeries="monthlyChartSeries"
          :detailLatestVisitors="detailLatestVisitors"
          :miniTableColumns="miniTableColumns"
          @update:activeTab="activeTab = $event"
        />
      </template>
      
    </DetailPanel>

  </div>
</template>