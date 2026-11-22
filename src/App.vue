<template>
  <div
    class="min-h-screen bg-[#EDE7F6] flex justify-center items-stretch sm:py-6 sm:px-4"
  >
    <!-- Main App Container (No fake mobile status bar or clock/battery) -->
    <div
      class="w-full max-w-[420px] min-h-[100dvh] sm:min-h-[840px] bg-[#FAF8FE] sm:rounded-3xl sm:shadow-2xl sm:border border-purple-200/80 overflow-hidden flex flex-col relative transition-all"
    >
      <!-- App View Router Container -->
      <main
        class="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#FAF8FE]"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Bottom Nav Bar (conditionally shown on core views) -->
      <BottomNav v-if="showBottomNav" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "./components/BottomNav.vue";

const route = useRoute();
const showBottomNav = computed(() => {
  return ["home", "journal", "stats", "profile"].includes(route.name);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
