<script setup>
import { useI18n } from 'vue-i18n'
import TableSuperAdmin from '@/components/common/TableSuperAdmin.vue'

const { t } = useI18n()

const props = defineProps({
  isLoadingDetail: { type: Boolean, required: true },
  selectedDetail: { type: Object, required: true },
  detailCounters: { type: Object, required: true },
  activeTab: { type: String, required: true },
  showChart: { type: Boolean, required: true },
  monthlyChartOptions: { type: Object, required: true },
  monthlyChartSeries: { type: Array, required: true },
  detailLatestVisitors: { type: Array, required: true },
  miniTableColumns: { type: Array, required: true },
})

const emit = defineEmits(['update:activeTab'])

const changeTab = (tabName) => {
  emit('update:activeTab', tabName)
}
</script>

<template>
  <div
    v-if="isLoadingDetail"
    class="flex flex-col items-center justify-center py-20 h-full min-h-[calc(100vh-200px)] bg-[#F8FAFC]"
  >
    <svg
      class="animate-spin h-8 w-8 text-[#2BB5F4] mb-4"
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
    <span class="text-sm text-gray-400">{{ $t('common_layout.sync') }}</span>
  </div>

  <div v-else class="bg-[#F8FAFC] h-full min-h-[calc(100vh-200px)]">
    <div class="px-6 md:px-8 mb-8 mt-6">
      <h3 class="text-[15px] font-semibold text-[#2BB5F4] mb-1">
        {{ $t('company_panel.cp_summary') }}
      </h3>
      <p class="text-[12px] text-gray-400 mb-4">{{ $t('company_panel.cp_subtitle') }}</p>

      <div class="grid grid-cols-3 gap-3 md:gap-4">
        <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div class="text-[12px] text-gray-500 font-medium mb-2.5">
            {{ $t('company_panel.cp_totVisitor') }}
          </div>
          <div class="text-2xl font-bold text-gray-900 leading-none">
            {{ detailCounters.visitor }}
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div class="text-[12px] text-gray-500 font-medium mb-2.5">
            {{ $t('company_panel.cp_totVisit') }}
          </div>
          <div class="text-2xl font-bold text-gray-900 leading-none">
            {{ detailCounters.visit }}
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div class="text-[12px] text-gray-500 font-medium mb-2.5">
            {{ $t('company_panel.cp_totUser') }}
          </div>
          <div class="text-2xl font-bold text-gray-900 leading-none">{{ detailCounters.user }}</div>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-8 mb-8 relative z-20">
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-[14px] font-semibold text-gray-800 mb-5">
          {{ $t('company_panel.cp_information') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
          <div class="col-span-1 md:col-span-3">
            <div class="text-[11px] text-gray-400 font-medium mb-1">
              {{ $t('company_panel.cp_companyName') }}
            </div>
            <div
              class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ selectedDetail.nama }}
            </div>
          </div>
          <div class="col-span-1">
            <div class="text-[11px] text-gray-400 font-medium mb-1">
              {{ $t('company_panel.cp_emailAddress') }}
            </div>
            <div
              class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ selectedDetail.email }}
            </div>
          </div>
          <div class="col-span-1">
            <div class="text-[11px] text-gray-400 font-medium mb-1">
              {{ $t('company_panel.cp_phone') }}
            </div>
            <div
              class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ selectedDetail.pic_telp }}
            </div>
          </div>
          <div class="col-span-1">
            <div class="text-[11px] text-gray-400 font-medium mb-1">
              {{ $t('company_panel.cp_informationPIC') }}
            </div>
            <div
              class="text-[13px] text-gray-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ selectedDetail.pic_nama }}
            </div>
          </div>
          <div class="col-span-1 md:col-span-3">
            <div class="text-[11px] text-gray-400 font-medium mb-1">
              {{ $t('company_panel.cp_address') }}
            </div>
            <div class="text-[13px] text-gray-800 leading-relaxed">{{ selectedDetail.alamat }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-8 mb-4 flex gap-4 items-center">
      <span class="text-[13px] text-gray-500 font-medium mr-1.5">Filter</span>
      <button
        @click="changeTab('Jumlah Visitor')"
        class="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-colors focus:outline-none"
        :class="
          activeTab === 'Jumlah Visitor'
            ? 'border-[#2BB5F4] text-[#2BB5F4] bg-[#2BB5F4]/5'
            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
        "
      >
        {{ $t('company_panel.cp_visitor') }}
      </button>
      <button
        @click="changeTab('Latest Visitor')"
        class="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-colors focus:outline-none"
        :class="
          activeTab === 'Latest Visitor'
            ? 'border-[#2BB5F4] text-[#2BB5F4] bg-[#2BB5F4]/5'
            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
        "
      >
        {{ $t('company_panel.cp_latestVisitor') }}
      </button>
    </div>

    <div class="px-6 md:px-8 pb-10">
      <div v-if="activeTab === 'Jumlah Visitor'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[14px] text-gray-800 font-medium">
            {{ $t('company_panel.cp_filterDesc1') }}
          </h3>
          <div class="flex items-center gap-4 text-[12px]">
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

        <div
          class="w-full h-80 border border-gray-100 rounded-xl bg-white flex flex-col p-4 relative"
        >
          <apexchart
            v-if="showChart"
            class="w-full h-full"
            type="line"
            height="280"
            width="100%"
            :options="monthlyChartOptions"
            :series="monthlyChartSeries"
          />
          <div
            v-else
            class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-[13px]"
          >
            <svg
              class="animate-spin h-6 w-6 text-[#2BB5F4] mb-2"
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
            {{ $t('common_layout.graphic_rendering') }}
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'Latest Visitor'">
        <div class="flex items-center justify-between mb-3.5">
          <h3 class="text-[14px] text-gray-800 font-medium">
            {{ $t('company_panel.cp_filterDesc2') }}
          </h3>
        </div>

        <div
          v-if="detailLatestVisitors.length"
          class="border border-gray-100 rounded-lg overflow-hidden bg-white"
        >
          <TableSuperAdmin :columns="miniTableColumns" :data="detailLatestVisitors">
            <template #nama="{ item }">
              <div class="flex items-center gap-3">
                <img
                  v-if="item.photo"
                  :src="item.photo"
                  class="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0 bg-white"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-[#EAF8FF] text-[#2BB5F4] flex items-center justify-center text-[12px] font-bold shrink-0"
                >
                  {{ item.nama.charAt(0).toUpperCase() }}
                </div>
                <span class="text-[12px] text-gray-800 font-medium whitespace-nowrap">{{
                  item.nama
                }}</span>
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

        <div
          v-else
          class="w-full py-10 flex flex-col items-center justify-center text-gray-400 bg-white border border-gray-100 rounded-lg"
        >
          <svg
            class="w-10 h-10 mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <span class="text-[13px]">{{ $t('company_panel.cp_caption') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
