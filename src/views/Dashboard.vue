<script setup>
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Import Components
import PageHeader from '@/components/common/PageHeader.vue'
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue'
import DashboardCounter from '@/components/dashboardComponent/DashboardCounter.vue'

// Import API
import { ApiDashboard } from '@/services/ApiDashboard'

const isLoading = ref(true)

const { t } = useI18n()

// Initial State
const counters = ref({
  visitor: 0,
  visit: 0,
  company: 0,
})

const latestCompanies = ref([])
const visitorsData = ref([])
const visitsData = ref([])

const chartSeries = computed(() => [
  { name: t('company_panel.cp_visitor'), data: visitorsData.value },
  { name: t('company_panel.cp_visit'), data: visitsData.value },
])

const chartOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'Poppins, sans-serif',
    selection: { enabled: false },
    zoom: { enabled: false },
    dropShadow: { enabled: true, top: 5, left: 0, blur: 5, opacity: 0.2 },
  },
  colors: ['#2D51FD', '#ED9D0F'],
  stroke: { curve: 'smooth', width: 3 },
  dataLabels: {
    enabled: true,
    background: { enabled: true, foreColor: '#fff', padding: 4, borderRadius: 2, borderWidth: 0 },
    offsetY: -2,
  },
  markers: { size: 0, hover: { sizeOffset: 4 } },
  xaxis: {
    categories: [],
    title: {
      text: 'Month',
      offsetY: 5,
      style: { color: '#111827', fontSize: '12px', fontWeight: 'bold' },
    },
    labels: { style: { colors: '#64748B', fontSize: '11px' } },
    axisBorder: { show: true, color: '#E2E8F0' },
    axisTicks: { show: true, color: '#E2E8F0' },
    tooltip: { enabled: true },
    crosshairs: { show: true, stroke: { color: '#b6b6b6', width: 1, dashArray: 3 } },
  },
  yaxis: {
    min: 0,
    tickAmount: 4,
    labels: {
      formatter: (value) => Math.round(value),
      style: { colors: '#64748B', fontSize: '12px' },
    },
  },
  grid: {
    show: true,
    borderColor: '#E2E8F0',
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: { enabled: true, shared: true, intersect: false },
  states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
  legend: { show: false },
})

// Inisialisasi Kolom Tabel Latest Company
const tableColumns = computed(() => [
  { key: 'company', label: t('dashboard.d_companyName'), width: 'w-[40%]' },
  { key: 'address', label: t('dashboard.d_Address'), width: 'w-[40%]' },
  { key: 'created', label: t('dashboard.d_Joindate'), width: 'w-[20%]' },
])

// Format Tanggal
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}

// Try Catch untuk fetch data Dashboard
const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    // Paralel manggil 3 API`
    const [resCounter, resMonthly, resLatest] = await Promise.all([
      ApiDashboard.getCounters(),
      ApiDashboard.getMonthlyData(),
      ApiDashboard.getLatestCompany(),
    ])

    if (resCounter.message === 'Success' && resCounter.data) {
      counters.value = {
        visitor: resCounter.data.visitor_total || 0,
        visit: resCounter.data.visit_total || 0,
        company: resCounter.data.company_total || 0,
      }
    }

    if (resMonthly.message === 'Success' && resMonthly.data) {
      const dataAPI = resMonthly.data
      chartOptions.value = {
        ...chartOptions.value,
        xaxis: { ...chartOptions.value.xaxis, categories: dataAPI.titles },
      }

      // Cukup masukkan datanya saja ke ref terpisah yang kita buat tadi
      // Namanya nanti otomatis diurus dan diterjemahkan oleh computed di atas
      visitorsData.value = dataAPI.visitors || []
      visitsData.value = dataAPI.visits || []
    }

    if (resLatest.message === 'Success' && resLatest.data) {
      latestCompanies.value = resLatest.data
    }
  } catch (error) {
    console.error('Gagal memuat data Dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 min-h-full flex flex-col relative">
    <PageHeader :title="$t('sidebar.dashboard')" :subtitle="$t('dashboard.d_SuperAdmindesc')" />
    <hr class="border-gray-100 mt-1 mb-4" />

    <DashboardCounter :counters="counters" />

    <div class="mb-6 border border-gray-100 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-[15px] font-bold text-gray-800">{{ $t('dashboard.d_Statistic') }}</h3>

        <div class="flex items-center gap-4 text-[12px] font-medium">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-[#2D51FD]"></div>
            <span class="text-gray-500">{{ $t('company_panel.cp_visitor') }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-[#ED9D0F]"></div>
            <span class="text-gray-500">{{ $t('company_panel.cp_visit') }}</span>
          </div>
        </div>
      </div>

      <div class="w-full h-80">
        <apexchart
          v-if="chartSeries[0].data.length > 0"
          class="w-full h-full"
          type="line"
          height="100%"
          width="100%"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
    </div>

    <div class="border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-[15px] font-bold text-gray-800">{{ $t('dashboard.d_NewestCompany') }}</h3>
      </div>

      <div class="border border-gray-100 rounded-lg overflow-hidden">
        <TableSuperAdmin :columns="tableColumns" :data="latestCompanies">
          <template #company="{ item }">
            <div class="flex items-center gap-3">
              <img
                v-if="item.logo"
                :src="item.logo"
                class="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0 bg-white"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full bg-[#EAF8FF] text-[#2BB5F4] flex items-center justify-center text-[12px] font-bold shrink-0"
              >
                {{ item.name.charAt(0).toUpperCase() }}
              </div>
              <span class="text-[13px] text-gray-800 font-medium whitespace-nowrap">{{
                item.name
              }}</span>
            </div>
          </template>

          <template #address="{ item }">
            <div
              class="text-gray-600 text-[13px] line-clamp-1 max-w-62.5 md:max-w-100"
              :title="item.address"
            >
              {{ item.address }}
            </div>
          </template>

          <template #created="{ item }">
            <span class="text-gray-600 text-[13px] whitespace-nowrap">{{
              formatDate(item.created_at)
            }}</span>
          </template>
        </TableSuperAdmin>
      </div>
    </div>
  </div>
</template>
