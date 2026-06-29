<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// IMPORT ASSET
import FreePlanVector from '@/assets/images/icon/free-plan-vector.svg'

// IMPORT COMPONENTS
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue'

const DetailPanel = defineAsyncComponent(() => import('@/components/common/DetailPanel.vue'))
const PerusahaanDetailPanel = defineAsyncComponent(
  () => import('@/components/companyComponent/DaftarPerusahaanForm.vue'),
)

// IMPORT API SERVICE & HELPER
import { ApiCompanyKey } from '@/services/ApiCompany'
import { SwalHelper } from '@/components/utils/SweetAlertHelper'
import { Toast } from '@/components/utils/ToastState'

const { t } = useI18n()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const listPerusahaan = ref([])
const isLoadingData = ref(false)

const sortKey = ref('nama')
const sortOrder = ref('asc')

const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
}

const isDetailOpen = ref(false)
const selectedDetail = ref(null)
const isLoadingDetail = ref(false)
const showChart = ref(false)
const activeTab = ref('Jumlah Visitor')

const detailCounters = ref({ visitor: 0, visit: 0, user: 0, percentage: 0, quota: 0 })
const detailLatestVisitors = ref([])

const monthlyChartSeries = ref([
  { name: 'Visitor', data: [] },
  { name: 'Visit', data: [] },
])

const monthlyChartOptions = computed(() => ({
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
      text: t('company_panel.cp_month'),
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
}))

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

const fetchCompanyData = async () => {
  isLoadingData.value = true
  try {
    const response = await ApiCompanyKey.getCompanies()
    if (response.message === 'Success' && response.data) {
      listPerusahaan.value = response.data.map((item) => ({
        id: item.id,
        nama: item.name || '-',
        alamat: item.address || '-',
        pic_nama: item.owner || '-',
        pic_telp: item.phone_number || '-',
        email: item.owner_email || '-',
        logo: null,
      }))

      fetchLogosInBackground(listPerusahaan.value)
    }
  } catch (error) {
    Toast.error(t('common_layout.take_data') + ' Error: ' + error.message)
  } finally {
    isLoadingData.value = false
  }
}

const fetchLogosInBackground = async (companies) => {
  await Promise.allSettled(
    companies.map(async (company) => {
      try {
        const detailRes = await ApiCompanyKey.getDetailCompany(company.id)
        if (detailRes && detailRes.data && detailRes.data.logo) {
          const targetCompany = listPerusahaan.value.find((c) => c.id === company.id)
          if (targetCompany) {
            targetCompany.logo = detailRes.data.logo
          }
        }
      } catch {}
    }),
  )
}

onMounted(() => fetchCompanyData())

const openDetail = async (item) => {
  selectedDetail.value = { ...item, logo: null, created_at: null }
  isDetailOpen.value = true
  isLoadingDetail.value = true
  showChart.value = false

  detailCounters.value = { visitor: 0, visit: 0, user: 0, percentage: 0, quota: 0 }
  detailLatestVisitors.value = []

  try {
    const [counterRes, monthlyRes, visitorRes, detailRes] = await Promise.all([
      ApiCompanyKey.getCounters(item.id).catch(() => ({})),
      ApiCompanyKey.getMonthlyData(item.id).catch(() => ({})),
      ApiCompanyKey.getLatestVisitors(item.id).catch(() => ({})),
      ApiCompanyKey.getDetailCompany(item.id).catch(() => ({})),
    ])

    if (detailRes && detailRes.data) {
      selectedDetail.value.logo = detailRes.data.logo
      selectedDetail.value.created_at = detailRes.data.created_at

      if (detailCounters.value.quota === 0) {
        detailCounters.value.quota = detailRes.data.quota || 0
      }
    }

    if (counterRes && counterRes.data) {
      detailCounters.value = {
        visitor: counterRes.data.visitor_total || 0,
        visit: counterRes.data.visit_total || 0,
        user: counterRes.data.user_total || 0,
        percentage: counterRes.data.usage_percentage || 0,
        quota: counterRes.data.quota || 0,
      }
    }

    if (monthlyRes && monthlyRes.data) {
      monthlyChartSeries.value = [
        { name: t('company_panel.cp_visitor') || 'Visitor', data: monthlyRes.data.visitors || [] },
        { name: t('company_panel.cp_visit') || 'Visit', data: monthlyRes.data.visit_data || [] },
      ]
      monthlyChartOptions.value.xaxis.categories = monthlyRes.data.titles || []
    }

    if (visitorRes && visitorRes.data) {
      detailLatestVisitors.value = visitorRes.data.map((v) => ({
        id: v.id,
        nama: v.name || '-',
        email: v.email || '-',
        phone: v.phone_number || '-',
        check_in: formatDateTime(v.datetime),
        photo: v.picture_url,
      }))
    }
  } catch (error) {
    Toast.error('Gagal memuat detail: ' + error.message)
  } finally {
    isLoadingDetail.value = false
    setTimeout(() => {
      showChart.value = true
    }, 300)
  }
}

const handleDelete = async (id) => {
  closeDropdown()
  const result = await SwalHelper.confirmDelete('Perusahaan')
  if (result.isConfirmed) {
    try {
      SwalHelper.showLoading('Menghapus Perusahaan...')
      await ApiCompanyKey.deleteCompany(id)
      await fetchCompanyData()
      SwalHelper.close()
      Toast.success('Data perusahaan berhasil dihapus.')
    } catch (error) {
      SwalHelper.close()
      Toast.error(error.message || 'Gagal menghapus perusahaan.')
    }
  }
}

const listPerusahaanDitampilkan = computed(() => {
  let filtered = [...listPerusahaan.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter((item) => item.nama.toLowerCase().includes(q))
  }

  if (sortKey.value) {
    filtered.sort((a, b) => {
      let valA = sortKey.value === 'pic' ? a.pic_nama : a[sortKey.value]
      let valB = sortKey.value === 'pic' ? b.pic_nama : b[sortKey.value]

      valA = String(valA || '').toLowerCase()
      valB = String(valB || '').toLowerCase()

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  const start = (currentPage.value - 1) * itemsPerPage.value
  return filtered.slice(start, start + itemsPerPage.value)
})

const totalDataFiltered = computed(() => {
  if (!searchQuery.value) return listPerusahaan.value.length
  return listPerusahaan.value.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ).length
})

const tableColumns = computed(() => [
  { key: 'nama', label: t('company_list.c_companyName'), width: 'w-[30%]' },
  { key: 'alamat', label: t('company_list.c_companyAddress'), width: 'w-[40%]' },
  { key: 'pic', label: 'PIC', width: 'w-[20%]' },
  { key: 'aksi', label: t('common_layout.action'), width: 'w-[10%]', sortable: false },
])

const miniTableColumns = computed(() => [
  { key: 'nama', label: t('company_panel.cp_name') },
  { key: 'kontak', label: t('company_panel.cp_contact'), width: 'w-[40%]' },
  { key: 'check_in', label: 'Check-in' },
])

const activeDropdown = ref(null)
const dropdownPos = ref({ top: '0px', right: '0px' })
const toggleDropdown = (id, event) => {
  if (activeDropdown.value === id) {
    activeDropdown.value = null
    return
  }
  activeDropdown.value = id
  const rect = event.currentTarget.getBoundingClientRect()
  dropdownPos.value = { top: `${rect.bottom + 8}px`, right: `${window.innerWidth - rect.right}px` }
}
const closeDropdown = () => {
  activeDropdown.value = null
}
</script>

<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 min-h-full flex flex-col min-w-0 w-full relative">
    <PageHeader
      :title="$t('sidebar.company_List')"
      :subtitle="$t('company_list.c_companyListdesc')"
    />
    <hr class="border-gray-100 mt-1 mb-4" />

    <SearchFilterBar v-model="searchQuery" :placeholderText="$t('company_list.c_Search')" />

    <div class="flex-1 flex flex-col justify-between min-w-0 relative">
      <div
        v-if="isLoadingData"
        class="absolute inset-0 z-10 bg-white/60 flex items-center justify-center"
      >
        <span class="text-[#2BB5F4] font-medium text-[13px] animate-pulse">{{
          $t('common_layout.take_data')
        }}</span>
      </div>

      <TableSuperAdmin
        :columns="tableColumns"
        :data="listPerusahaanDitampilkan"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @sort="handleSort"
      >
        <template #nama="{ item }">
          <div class="flex items-center gap-3">
            <div
              v-if="!item.logo"
              class="w-8 h-8 rounded-full bg-[#EAF8FF] text-[#2BB5F4] flex items-center justify-center text-[12px] font-bold shrink-0"
              aria-hidden="true"
            >
              {{ item.nama.charAt(0).toUpperCase() }}
            </div>
            <img
              v-else
              :src="item.logo"
              alt=""
              aria-hidden="true"
              loading="lazy"
              class="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0 bg-white"
            />
            <span class="text-[#303030] font-medium text-[14px] whitespace-nowrap">{{
              item.nama
            }}</span>
          </div>
        </template>

        <template #alamat="{ item }">
          <div
            class="text-[#303030] text-[14px] font-reguler line-clamp-2 leading-relaxed max-w-50 md:max-w-87.5 lg:max-w-100"
            :title="item.alamat"
          >
            {{ item.alamat }}
          </div>
        </template>

        <template #pic="{ item }">
          <div class="text-[#1E1E1D] text-[14px] font-reguler whitespace-nowrap">
            {{ item.pic_nama }}
          </div>
          <div class="text-[##6E6E6E] text-[13px] mt-0.5 whitespace-nowrap">
            {{ item.pic_telp }}
          </div>
        </template>

        <template #aksi="{ item }">
          <div class="flex items-center gap-2">
            <button
              @click="openDetail(item)"
              :aria-label="`Lihat detail perusahaan ${item.nama}`"
              title="Lihat Detail"
              class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#E8F8F3] transition-colors focus:outline-none"
            >
              <svg
                aria-hidden="true"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
            <div>
              <button
                @click="toggleDropdown(item.id, $event)"
                :aria-label="`Buka menu aksi untuk ${item.nama}`"
                aria-haspopup="true"
                :aria-expanded="activeDropdown === item.id"
                title="Buka Menu Aksi"
                class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#E8F8F3] transition-colors focus:outline-none"
              >
                <svg
                  aria-hidden="true"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  ></path>
                </svg>
              </button>
              <Teleport to="body">
                <div
                  v-if="activeDropdown === item.id"
                  @click="closeDropdown"
                  class="fixed inset-0 z-998"
                ></div>
                <div
                  v-if="activeDropdown === item.id"
                  class="fixed w-36 bg-white border border-gray-100 rounded-lg z-999 py-1.5 font-['Poppins']"
                  :style="{ top: dropdownPos.top, right: dropdownPos.right }"
                >
                  <button
                    @click="handleDelete(item.id)"
                    class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    {{ $t('button.company_delete') }}
                  </button>
                </div>
              </Teleport>
            </div>
          </div>
        </template>
      </TableSuperAdmin>

      <PaginationSuperAdmin
        v-model:current-page="currentPage"
        :total-data="totalDataFiltered"
        :per-page="itemsPerPage"
      />
    </div>

    <DetailPanel :is-open="isDetailOpen" @close="isDetailOpen = false">
      <template #header v-if="selectedDetail">
        <div class="px-6 md:px-8 pb-6 flex items-center gap-4">
          <img
            v-if="selectedDetail.logo"
            :src="selectedDetail.logo"
            alt=""
            aria-hidden="true"
            loading="lazy"
            class="w-13 h-13 rounded-full object-cover border-2 border-white/20 shrink-0 bg-white"
          />
          <div
            v-else
            class="w-13 h-13 bg-white rounded-full flex items-center justify-center text-[#2BB5F4] text-[18px] font-bold shadow-sm shrink-0"
            aria-hidden="true"
          >
            {{ selectedDetail.nama.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 overflow-hidden">
            <h2 class="text-[20px] font-semibold text-white mb-0.5 tracking-wide truncate">
              {{ selectedDetail.nama }}
            </h2>
            <div class="text-[12px] text-white/90">
              <span class="font-medium text-white">{{ $t('company_panel.cp_registered') }}</span>
              {{
                selectedDetail.created_at
                  ? new Date(selectedDetail.created_at).toLocaleDateString('id-ID')
                  : 'Memuat...'
              }}
            </div>
          </div>
        </div>

        <div class="px-6 w-211 md:px-8">
          <div
            class="relative z-20 flex h-14 md:h-15 rounded-t-[14px] bg-[#DDF4FF] shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-[1.5px] border-white"
          >
            <div
              class="bg-linear-to-r from-[#98E3FF] to-[#2BB5F4] px-5 flex items-center justify-center gap-2.5 shrink-0 rounded-tl-[14px] rounded-br-2xl"
            >
              <img
                :src="FreePlanVector"
                alt=""
                aria-hidden="true"
                loading="lazy"
                class="w-5.5 h-5.5"
              />
              <span class="text-white font-medium text-[15px]">{{
                $t('company_panel.cp_freePlan')
              }}</span>
            </div>
            <div class="flex-1 px-5 flex flex-col justify-center">
              <div class="text-[12px] text-gray-700 font-medium mb-1">
                {{ $t('company_panel.cp_visitLimits') }}
              </div>
              <div
                class="w-full h-1 bg-[#BCE6FF] rounded-full overflow-hidden mb-1.5"
                role="progressbar"
                :aria-valuenow="detailCounters.percentage"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  class="h-full bg-[#2BB5F4] transition-all duration-1000"
                  :style="{ width: `${detailCounters.percentage}%` }"
                ></div>
              </div>
              <div
                class="flex justify-between text-[10.5px] text-gray-500 font-medium"
                aria-hidden="true"
              >
                <span>{{ detailCounters.percentage }}% {{ $t('company_panel.cp_used') }}</span>
                <span>{{ detailCounters.quota }}/{{ $t('company_panel.cp_month') }}</span>
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
