<script setup>
import { Toast } from '@/components/utils/ToastState'

const props = defineProps({
  formData: { type: Object, required: true },
  panelMode: { type: String, default: 'create' },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])

const handleBatal = () => {
  emit('close')
}

const handleSimpan = () => {
  emit('save')
}

const validasiAngkaCustom = (event) => {
  event.target.setCustomValidity('')

  if (event.ctrlKey || event.metaKey || event.key.length > 1) return

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
    Toast.warning('Simbol tidak diperkenankan pada form')
  }
}

const validasiSimbolString = (event) => {
  event.target.setCustomValidity('')

  if (event.ctrlKey || event.metaKey || event.key.length > 1) return

  if (!/^[a-zA-Z0-9\s]$/.test(event.key)) {
    event.preventDefault()
    Toast.warning('Simbol tidak diperkenankan pada form')
  }
}

const resetValidasi = (event) => {
  event.target.setCustomValidity('')
}
</script>

<template>
  <div class="px-6 md:px-8 py-6 pb-10 space-y-6 bg-[#F8FAFC]">
    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <h3 class="text-[15px] font-bold text-gray-800 mb-5 border-b border-gray-50 pb-3">
        {{ $t('package_panel.pp_header1') }}
      </h3>
      <div class="space-y-4">
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('package_panel.pp_name') }} <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.namaPaket"
            @keydown="validasiSimbolString"
            @input="resetValidasi"
            type="text"
            :placeholder="$t('package_panel.pp_namePlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2BB5F4]"
          />
        </div>
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('package_panel.pp_desc') }} <span class="text-red-500">*</span></label
          >
          <textarea
            v-model="formData.deskripsi"
            @keydown="validasiSimbolString"
            @input="resetValidasi"
            :placeholder="$t('package_panel.pp_descPlaceholder')"
            rows="3"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4] resize-none"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <h3 class="text-[15px] font-bold text-gray-800 mb-1">{{ $t('package_panel.pp_header2') }}</h3>
      <p class="text-[12px] text-gray-400 mb-5 border-b border-gray-50 pb-3">
        {{ $t('package_panel.pp_h2desc') }}
      </p>

      <div class="space-y-5">
        <div>
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              v-model="formData.jenisHarga"
              value="bulanan"
              class="mt-1 w-4 h-4 text-[#2BB5F4] focus:ring-[#2BB5F4]"
            />
            <div>
              <div class="text-[14px] text-gray-800 font-medium">
                {{ $t('package_panel.pp_price') }}
              </div>
              <div class="text-[12px] text-gray-400">{{ $t('package_panel.pp_priceDesc') }}</div>
            </div>
          </label>

          <div v-if="formData.jenisHarga === 'bulanan'" class="mt-4 ml-7 flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <label class="block text-[12px] text-gray-800 font-medium mb-1.5"
                  >{{ $t('package_panel.pp_monthlyPrice')
                  }}<span class="text-red-500">*</span></label
                >
                <div class="relative">
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-4 text-[13px] font-bold text-gray-800"
                    >Rp</span
                  >
                  <input
                    v-model="formData.harga"
                    @keydown="validasiAngkaCustom"
                    @input="resetValidasi"
                    type="number"
                    :placeholder="$t('package_panel.pp_monthlyPricePlaceholder')"
                    class="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
                  />
                </div>
              </div>
              <div class="flex-1">
                <label class="block text-[12px] text-gray-800 font-medium mb-1.5"
                  >{{ $t('package_panel.pp_duration') }} <span class="text-red-500">*</span></label
                >
                <div class="relative">
                  <select
                    v-model="formData.durasi"
                    class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4] bg-white"
                  >
                    <option value="1 Bulan">1 Bulan</option>
                    <option value="3 Bulan">3 Bulan</option>
                    <option value="6 Bulan">6 Bulan</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.aktifkanTahunan" class="sr-only peer" />
                <div
                  class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2BB5F4]"
                ></div>
              </label>
              <span class="text-[13px] text-gray-800">{{
                $t('package_panel.pp_yearlyButton')
              }}</span>
            </div>

            <div v-if="formData.aktifkanTahunan" class="flex flex-col md:flex-row gap-4 pt-1">
              <div class="flex-1">
                <label class="block text-[12px] text-gray-800 font-medium mb-1.5"
                  >{{ $t('package_panel.pp_yearlyPrice')
                  }}<span class="text-red-500">*</span></label
                >
                <div class="relative">
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-4 text-[13px] font-bold text-gray-800"
                    >Rp</span
                  >
                  <input
                    v-model="formData.hargaTahunan"
                    @keydown="validasiAngkaCustom"
                    @input="resetValidasi"
                    type="number"
                    :placeholder="$t('package_panel.pp_yearlyPricePlaceholder')"
                    class="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
                  />
                </div>
              </div>
              <div class="flex-1">
                <label class="block text-[12px] text-gray-800 font-medium mb-1.5"
                  >{{ $t('package_panel.pp_duration') }} <span class="text-red-500">*</span></label
                >
                <div class="relative">
                  <select
                    disabled
                    class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-500 bg-gray-100 cursor-not-allowed appearance-none"
                  >
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
            <input
              type="radio"
              v-model="formData.jenisHarga"
              value="free"
              class="mt-1 w-4 h-4 text-[#2BB5F4] focus:ring-[#2BB5F4]"
            />
            <div>
              <div class="text-[14px] text-gray-800 font-medium">
                {{ $t('package_panel.pp_free') }}
              </div>
              <div class="text-[12px] text-gray-400">{{ $t('package_panel.pp_freeDesc') }}</div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <h3 class="text-[15px] font-bold text-gray-800 mb-1">{{ $t('package_panel.pp_header3') }}</h3>
      <p class="text-[12px] text-gray-400 mb-5 border-b border-gray-50 pb-3">
        {{ $t('package_panel.pp_h3desc') }}
      </p>

      <div class="space-y-4">
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('package_panel.pp_visitorLimits') }} <span class="text-red-500">*</span></label
          >
          <div class="relative">
            <input
              v-model="formData.kuotaVisit"
              @keydown="validasiAngkaCustom"
              @input="resetValidasi"
              type="number"
              :placeholder="$t('package_panel.pp_vlPlaceholder')"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
            />
            <span
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-[13px] text-gray-500"
              >{{ $t('package_panel.pp_month') }}</span
            >
          </div>
        </div>
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('package_panel.pp_branch') }} <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.jumlahCabang"
            @keydown="validasiAngkaCustom"
            @input="resetValidasi"
            type="number"
            :placeholder="$t('package_panel.pp_branchPlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
          />
        </div>
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('package_panel.pp_account') }} <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.jumlahAkun"
            @keydown="validasiAngkaCustom"
            @input="resetValidasi"
            type="number"
            :placeholder="$t('package_panel.pp_accountPlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
          />
        </div>
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('package_panel.pp_storage') }} <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.storageLimit"
            @keydown="validasiAngkaCustom"
            @input="resetValidasi"
            type="number"
            :placeholder="$t('package_panel.pp_storagePlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    class="sticky bottom-0 bg-white border-t border-gray-100 px-6 md:px-8 py-4 flex gap-4 mt-auto z-30"
  >
    <button
      @click="handleBatal"
      class="flex-1 py-3 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] transition-colors"
    >
      {{ $t('package_panel.pp_cancelButton') }}
    </button>
    <button
      @click="handleSimpan"
      :disabled="isSaving"
      class="flex-1 py-3 rounded-xl bg-[#2BB5F4] text-white font-semibold text-[13px] hover:bg-[#14A5E6] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
    >
      <svg
        v-if="isSaving"
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
      {{ isSaving ? 'Memproses...' : $t('package_panel.pp_saveButton') }}
    </button>
  </div>
</template>
