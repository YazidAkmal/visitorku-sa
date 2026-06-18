<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// Import Components Utama
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue'
import PaginationSuperAdmin from '@/components/common/PaginationSuperAdmin.vue'
import TagihanCounter from '@/components/invoiceComponent/RiwayatTagihanCounter.vue'

const DetailPanel = defineAsyncComponent(() => import('@/components/common/DetailPanel.vue'))
const TagihanViewDetail = defineAsyncComponent(
  () => import('@/components/invoiceComponent/RiwayatTagihanDetail.vue'),
)
const TagihanEditForm = defineAsyncComponent(
  () => import('@/components/invoiceComponent/RiwayatTagihanForm.vue'),
)

// Import Icon
import MenungguPembayaran from '@/assets/images/icon/menunggu-pembayaran-state-vector.svg'
import Lunas from '@/assets/images/icon/lunas-state-vector.svg'
import KonfirmasiBayar from '@/assets/images/alert-konfirmasi-pembayaran.svg'
import Invoice from '@/assets/images/icon/monthly-invoice-vector.svg'

import { ApiInvoice } from '@/services/ApiInvoice'
import { Toast } from '@/components/utils/ToastState'

const { t } = useI18n()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const isLoading = ref(false)

const rawListTagihan = ref([])

const sortKey = ref('nomor') // Default sort berdasarkan nomor tagihan
const sortOrder = ref('asc')

const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  currentPage.value = 1 // Kembali ke halaman 1 saat sort diklik
}

const formatDateShort = (dateStr) => (!dateStr ? '-' : dateStr.split('T')[0])

const fetchInvoices = async () => {
  isLoading.value = true
  try {
    const response = await ApiInvoice.getAllInvoices()
    if (response.message === 'Success' && response.data) {
      rawListTagihan.value = response.data
    }
  } catch (error) {
    Toast.error('Gagal mengambil data tagihan: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => fetchInvoices())

const listTagihan = computed(() => {
  return rawListTagihan.value.map((item) => {
    const isPaid = item.status === 'paid'
    const basePrice = item.payment_type === 'yearly' ? item.yearly_price : item.monthly_price
    return {
      id: item.id,
      noTagihan: item.number,
      dateRange: `${formatDateShort(item.active_from_date)} • ${formatDateShort(item.active_to_date)}`,
      perusahaan: item.company || '-',
      periode: item.payment_type
        ? item.payment_type.charAt(0).toUpperCase() + item.payment_type.slice(1)
        : '-',
      status: isPaid ? t('invoice.i_paidStatus') : t('invoice.i_waitingStatus'),
      statusDesc: isPaid
        ? `${t('invoice.i_verify')} ${formatDateShort(item.updated_at)}`
        : t('invoice.i_Nopaid'),
      statusCode: isPaid ? 'success' : 'pending',
      price_type: item.price_type || 'Unknown',
      base_price: basePrice,
      disc: item.disc || 0,
      payment_total: item.payment_total || 0,
      invoice_url: item.invoice_url,
      raw_status: item.status,
      raw_payment_type: item.payment_type,
      raw: item,
    }
  })
})

const summary = computed(() => {
  let lunas = 0,
    belumDibayar = 0
  listTagihan.value.forEach((item) =>
    item.statusCode === 'success'
      ? (lunas += item.payment_total)
      : (belumDibayar += item.payment_total),
  )
  return { total: lunas + belumDibayar, lunas, belumDibayar }
})

// Filter data
const listTagihanFiltered = computed(() => {
  if (!searchQuery.value) return listTagihan.value
  return listTagihan.value.filter(
    (item) =>
      item.noTagihan.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.perusahaan.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const listTagihanDitampilkan = computed(() => {
  let result = [...listTagihanFiltered.value]

  if (sortKey.value) {
    result.sort((a, b) => {
      let valA, valB

      if (sortKey.value === 'nomor') {
        valA = a.noTagihan
        valB = b.noTagihan
      } else {
        valA = a[sortKey.value]
        valB = b[sortKey.value]
      }

      valA = String(valA || '').toLowerCase()
      valB = String(valB || '').toLowerCase()

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  // Proses Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  return result.slice(start, start + itemsPerPage.value)
})

const tableColumns = computed(() => [
  { key: 'nomor', label: t('invoice.i_Number'), width: 'w-[25%]' },
  { key: 'perusahaan', label: t('invoice.i_company'), width: 'w-[25%]' },
  { key: 'periode', label: t('invoice.i_period'), width: 'w-[13%]' },
  { key: 'status', label: 'Status', width: 'w-[24%]' },
  { key: 'aksi', label: t('common_layout.action'), sortable: false, width: 'w-[13%]' },
])

const activeDropdown = ref(null)
const dropdownPos = ref({ top: '0px', right: '0px' })
const toggleDropdown = (id, event) => {
  if (activeDropdown.value === id) {
    activeDropdown.value = null
    return
  }
  activeDropdown.value = id
  dropdownPos.value = {
    top: `${event.currentTarget.getBoundingClientRect().bottom + 8}px`,
    right: `${window.innerWidth - event.currentTarget.getBoundingClientRect().right}px`,
  }
}
const closeDropdown = () => {
  activeDropdown.value = null
}

const isDetailOpen = ref(false)
const selectedDetail = ref(null)
const openDetail = (item) => {
  selectedDetail.value = item
  isDetailOpen.value = true
}

const isEditOpen = ref(false)
const isSavingEdit = ref(false)
const editFormData = ref({
  id: null,
  status: '',
  payment_type: '',
  active_from_date: '',
  active_to_date: '',
})

const openEditPanel = (item) => {
  const dates = item.dateRange.split(' • ')
  editFormData.value = {
    id: item.id,
    status: item.raw_status || 'unpaid',
    payment_type: item.raw_payment_type || 'monthly',
    active_from_date: dates[0] && dates[0] !== '-' ? dates[0] : '',
    active_to_date: dates[1] && dates[1] !== '-' ? dates[1] : '',
    raw: item.raw,
  }
  isEditOpen.value = true
  closeDropdown()
}

const handleEditSave = async () => {
  isSavingEdit.value = true
  try {
    const raw = editFormData.value.raw
    const payload = {
      active_from_date: editFormData.value.active_from_date,
      active_to_date: editFormData.value.active_to_date,
      quota: raw.quota || 0,
      payment_type: editFormData.value.payment_type,
      price_id: raw.price_id || '',
      status: editFormData.value.status,
      level: raw.level || 0,
      monthly_price: raw.monthly_price || 0,
      monthly_quota: raw.monthly_quota || 0,
      yearly_price: raw.yearly_price || 0,
      yearly_quota: raw.yearly_quota || 0,
      description: raw.description || '-',
      branch_limit: raw.branch_limit || 0,
      account_limit: raw.account_limit || 0,
      storage_limit: raw.storage_limit || 0,
      retention: raw.retention || 0,
      open_api: raw.open_api || false,
      signage_limit: raw.signage_limit || 0,
      event_visitor_limit: raw.event_visitor_limit || 0,
    }
    await ApiInvoice.updateInvoice(editFormData.value.id, payload)
    await fetchInvoices()
    isEditOpen.value = false

    Toast.success('Data tagihan berhasil diperbarui.')
  } catch (error) {
    Toast.error(error.message || 'Gagal menyimpan perubahan.')
  } finally {
    isSavingEdit.value = false
  }
}

const isAlertOpen = ref(false)
const isProcessingPayment = ref(false)
const openAlert = () => {
  isAlertOpen.value = true
}
const closeAlert = () => {
  if (!isProcessingPayment.value) isAlertOpen.value = false
}

const confirmPayment = async () => {
  if (!selectedDetail.value) return
  isProcessingPayment.value = true
  try {
    await ApiInvoice.approveInvoice(selectedDetail.value.id)
    await fetchInvoices()
    isAlertOpen.value = false
    isDetailOpen.value = false

    Toast.success('Berhasil dikonfirmasi menjadi Lunas.')
  } catch (error) {
    Toast.error('Gagal mengkonfirmasi pembayaran.')
  } finally {
    isProcessingPayment.value = false
  }
}

const openInvoicePDF = (url) => {
  if (url) {
    window.open(url, '_blank')
  } else {
    Toast.error('Dokumen Invoice tidak tersedia.')
  }
}
</script>

<template>
  <div
    class="bg-white rounded-2xl p-4 md:p-6 shadow-sm min-h-full flex flex-col min-w-0 w-full relative"
  >
    <PageHeader :title="$t('sidebar.invoice')" :subtitle="$t('invoice.i_invoicedesc')" />
    <hr class="border-gray-100 mt-1 mb-4" />

    <TagihanCounter :summary="summary" />

    <SearchFilterBar v-model="searchQuery" :placeholderText="$t('invoice.i_Search')" />

    <div class="flex-1 flex flex-col justify-between min-w-0 relative">
      <div
        v-if="isLoading"
        class="absolute inset-0 z-10 bg-white/60 flex items-center justify-center"
      >
        <span class="text-[#2BB5F4] font-medium text-[13px] animate-pulse">{{
          $t('common_layout.take_data')
        }}</span>
      </div>

      <TableSuperAdmin
        :columns="tableColumns"
        :data="listTagihanDitampilkan"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @sort="handleSort"
      >
        <template #nomor="{ item }">
          <div class="text-[13px] font-semibold text-gray-800 mb-0.5 whitespace-nowrap">
            {{ item.noTagihan }}
          </div>
          <div class="text-[12px] text-gray-500 whitespace-nowrap">{{ item.dateRange }}</div>
        </template>
        <template #perusahaan="{ item }">
          <span class="text-[13px] text-gray-800 whitespace-nowrap">{{ item.perusahaan }}</span>
        </template>
        <template #periode="{ item }">
          <span class="text-[13px] text-gray-800 whitespace-nowrap">{{ item.periode }}</span>
        </template>
        <template #status="{ item }">
          <div class="flex flex-col items-start gap-1">
            <div
              v-if="item.statusCode === 'success'"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F8F3] text-[#38CA99] border border-[#38CA99]/20 text-[12px] font-medium whitespace-nowrap"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
              {{ item.status }}
            </div>
            <div
              v-if="item.statusCode === 'pending'"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF4E3] text-[#F59E0B] border border-[#F59E0B]/20 text-[12px] font-medium whitespace-nowrap"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3"></path>
              </svg>
              {{ item.status }}
            </div>
            <span class="text-[12px] text-gray-400 whitespace-nowrap">{{ item.statusDesc }}</span>
          </div>
        </template>

        <template #aksi="{ item }">
          <div class="flex items-center gap-2">
            <button
              @click="openDetail(item)"
              :aria-label="`Lihat detail tagihan ${item.noTagihan}`"
              title="Lihat Detail"
              class="w-8 h-8 flex items-center justify-center border border-[#2BB5F4] rounded-lg text-[#2BB5F4] hover:bg-[#EAF8FF] transition-colors focus:outline-none"
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
              <Teleport to="body">
                <div
                  v-if="activeDropdown === item.id"
                  @click="closeDropdown"
                  class="fixed inset-0 z-998"
                ></div>
                <div
                  v-if="activeDropdown === item.id"
                  class="fixed w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-999 py-1.5 font-['Poppins']"
                  :style="{ top: dropdownPos.top, right: dropdownPos.right }"
                >
                  <button
                    @click="openEditPanel(item)"
                    class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#EAF8FF] hover:text-[#2BB5F4] transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </Teleport>
            </div>
          </div>
        </template>
      </TableSuperAdmin>

      <PaginationSuperAdmin
        v-model:current-page="currentPage"
        :total-data="listTagihanFiltered.length"
        :per-page="itemsPerPage"
      />
    </div>

    <DetailPanel :is-open="isDetailOpen" @close="isDetailOpen = false">
      <template #header v-if="selectedDetail">
        <div class="px-6 md:px-8 pb-4 flex items-center gap-4">
          <div
            class="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm"
          >
            <img :src="Invoice" alt="Invoice Icon" loading="lazy" class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-1.5">
              <h2 class="text-[18px] font-semibold text-white tracking-wide">
                {{ selectedDetail.periode }} Invoice
              </h2>
              <div
                v-if="selectedDetail.statusCode === 'success'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CDF2E6] text-[#38CA99] text-[13px] shadow-sm"
              >
                <img :src="Lunas" loading="lazy" class="w-3.5 h-3.5" alt="Lunas" />
                {{ $t('invoice.i_paidStatus') }}
              </div>
              <div
                v-else-if="selectedDetail.statusCode === 'pending'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5DA] text-[#F59E0B] text-[13px] shadow-sm"
              >
                <img :src="MenungguPembayaran" loading="lazy" class="w-3.5 h-3.5" alt="Menunggu" />
                {{ $t('invoice.i_waitingStatus') }}
              </div>
            </div>
            <div class="text-[13px] text-white/90">
              {{ $t('invoice_panel.ip_invoiceDate') }} :
              {{ selectedDetail.dateRange.split(' • ')[0] }}
            </div>
          </div>
        </div>
      </template>

      <template #body v-if="selectedDetail">
        <TagihanViewDetail
          :selectedDetail="selectedDetail"
          @download="openInvoicePDF"
          @confirm="openAlert"
        />
      </template>
    </DetailPanel>

    <DetailPanel :is-open="isEditOpen" @close="isEditOpen = false">
      <template #header>
        <div class="px-6 md:px-8 pt-0 pb-0 relative z-20">
          <h2 class="text-lg mb-4 font-bold text-white tracking-wide">
            {{ $t('invoice_panel.ip_editInvoiceData') }}
          </h2>
        </div>
      </template>

      <template #body>
        <TagihanEditForm
          :editFormData="editFormData"
          :isSavingEdit="isSavingEdit"
          @close="isEditOpen = false"
          @save="handleEditSave"
        />
      </template>
    </DetailPanel>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isAlertOpen" class="fixed inset-0 z-10000 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeAlert"></div>
          <div
            class="relative bg-white rounded-3xl w-full max-w-100 p-8 flex flex-col items-center text-center shadow-2xl z-10"
          >
            <button
              @click="closeAlert"
              :disabled="isProcessingPayment"
              aria-label="Tutup pesan alert"
              title="Tutup"
              class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors disabled:opacity-50"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <img
              :src="KonfirmasiBayar"
              alt="Ilustrasi Konfirmasi"
              loading="lazy"
              class="w-32 h-32 mb-4"
            />
            <h3 class="text-[18px] font-bold text-gray-800 mb-3">
              {{ $t('invoice_panel.ip_condirm_button') }}
            </h3>
            <p class="text-[14px] text-gray-500 mb-8 leading-relaxed">
              Tindakan ini menandai tagihan sebagai
              <span class="font-bold text-gray-700">{{ $t('invoice.i_paidStatus') }}</span> dan
              mengaktifkan layanan perusahaan.
            </p>
            <div class="flex w-full gap-4">
              <button
                @click="closeAlert"
                :disabled="isProcessingPayment"
                class="flex-1 py-2.5 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                @click="confirmPayment"
                :disabled="isProcessingPayment"
                class="flex-1 py-2.5 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                <svg
                  v-if="isProcessingPayment"
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isProcessingPayment ? 'Memproses...' : $t('invoice_panel.ip_condirm_button') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
