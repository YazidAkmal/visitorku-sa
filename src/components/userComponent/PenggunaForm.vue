<script setup>
const props = defineProps({
  formData: { type: Object, required: true },
  panelMode: { type: String, default: 'create' },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])
</script>

<template>
  <div class="px-6 md:px-8 py-6 pb-10 bg-[#F8FAFC] h-full min-h-[calc(100vh-150px)] flex flex-col">
    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <h3 class="text-[15px] font-bold text-gray-800 mb-5 border-b border-gray-50 pb-3">
        {{ $t('user_panel.up_userInfo') }}
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('user_panel.up_name') }} <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.nama"
            type="text"
            :placeholder="$t('user_panel.up_namePlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
          />
        </div>

        <div>
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5"
            >{{ $t('user_panel.up_email') }} <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.email"
            type="email"
            :placeholder="$t('user_panel.up_emailPlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
            @input="(e) => e.target.setCustomValidity('')"
            @blur="(e) => e.target.reportValidity()"
          />
        </div>

        <div v-if="panelMode === 'create'">
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5">
            {{ $t('user_panel.up_password') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.password"
            type="password"
            :placeholder="$t('user_panel.up_passwordPlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
          />
        </div>

        <div v-if="panelMode === 'create'">
          <label class="block text-[13px] text-gray-800 font-medium mb-1.5">
            {{ $t('user_panel.up_confirmPassword') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            :placeholder="$t('user_panel.up_confirmPasswordPlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#2BB5F4]"
          />
        </div>
      </div>
    </div>

    <div class="flex-1"></div>

    <div class="flex gap-4 mt-8">
      <button
        @click="emit('close')"
        class="flex-1 py-3 rounded-xl border border-[#2BB5F4] text-[#2BB5F4] font-semibold text-[13px] hover:bg-[#EAF8FF] transition-colors"
      >
        {{ $t('user_panel.up_cancelButton') }}
      </button>
      <button
        @click="emit('save')"
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
        {{ isSaving ? 'Menyimpan...' : $t('user_panel.up_saveButton') }}
      </button>
    </div>
  </div>
</template>
