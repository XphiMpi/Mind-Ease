<template>
  <nav
    class="w-full bg-[#FAF8FE] border-t border-purple-100/80 px-6 py-2.5 flex justify-between items-center z-20"
  >
    <!-- Home Tab -->
    <button
      @click="navigate('/')"
      class="flex flex-col items-center space-y-1 transition-all group"
      :class="
        currentRoute === 'home'
          ? 'text-[#6D54B5] font-semibold'
          : 'text-purple-400 hover:text-purple-600'
      "
    >
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        :class="currentRoute === 'home' ? 'bg-[#EDE7F6]' : 'bg-transparent'"
      >
        <Home :size="20" stroke-width="2.2" />
      </div>
      <span class="text-[11px]">Home</span>
    </button>

    <!-- Journal Tab -->
    <button
      @click="navigate('/journal')"
      class="flex flex-col items-center space-y-1 transition-all group"
      :class="
        currentRoute === 'journal'
          ? 'text-[#6D54B5] font-semibold'
          : 'text-purple-400 hover:text-purple-600'
      "
    >
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        :class="currentRoute === 'journal' ? 'bg-[#EDE7F6]' : 'bg-transparent'"
      >
        <BookOpen :size="20" stroke-width="2.2" />
      </div>
      <span class="text-[11px]">Journal</span>
    </button>

    <!-- Stats Tab -->
    <button
      @click="navigate('/stats')"
      class="flex flex-col items-center space-y-1 transition-all group"
      :class="
        currentRoute === 'stats'
          ? 'text-[#6D54B5] font-semibold'
          : 'text-purple-400 hover:text-purple-600'
      "
    >
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        :class="currentRoute === 'stats' ? 'bg-[#EDE7F6]' : 'bg-transparent'"
      >
        <BarChart2 :size="20" stroke-width="2.2" />
      </div>
      <span class="text-[11px]">Stats</span>
    </button>

    <!-- Profile Tab -->
    <button
      @click="navigate('/profile')"
      class="flex flex-col items-center space-y-1 transition-all group"
      :class="
        currentRoute === 'profile'
          ? 'text-[#6D54B5] font-semibold'
          : 'text-purple-400 hover:text-purple-600'
      "
    >
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        :class="currentRoute === 'profile' ? 'bg-[#EDE7F6]' : 'bg-transparent'"
      >
        <User :size="20" stroke-width="2.2" />
      </div>
      <span class="text-[11px]">Profile</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Home, BookOpen, BarChart2, User } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const currentRoute = computed(() => route.name);

const navigate = (path) => {
  router.push(path);
};
</script>
