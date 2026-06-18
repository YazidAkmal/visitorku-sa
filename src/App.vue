<script setup>
import Topbar from '@/components/layout/Topbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { globalToast } from '@/components/utils/ToastState'
import ToastAlert from '@/components/common/ToastAlert.vue'
</script>

<template>
  <div v-if="!$route.meta.requiresAuth" class="h-screen w-full">
    <router-view />
  </div>

  <div v-else class="h-screen w-full bg-white-bg flex flex-col font-['Poppins'] overflow-hidden">
    <Topbar />

    <div class="flex flex-1 mt-1 overflow-hidden">
      <Sidebar />
      <main class="flex-1 px-4 pb-4 mt-4 overflow-y-auto min-w-0">
        <router-view />
      </main>
    </div>
  </div>

  <ToastAlert
    v-model:show="globalToast.show"
    :message="globalToast.message"
    :duration="globalToast.duration"
    :type="globalToast.type"
  />
</template>
