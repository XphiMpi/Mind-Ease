<template>
  <div
    class="flex-1 flex flex-col px-5 pt-3 pb-6 select-none bg-[#FAF8FE] overflow-y-auto"
  >
    <!-- Top Header -->
    <div
      class="flex items-center justify-between py-2 border-b border-purple-100/60 pb-3"
    >
      <h2 class="text-base font-bold text-[#3B2965] tracking-tight">
        Jurnal & Refleksi
      </h2>
      <button
        @click="$router.push('/mind-dump')"
        class="text-xs bg-[#7056B3] text-white px-3 py-1.5 rounded-full font-bold hover:bg-[#5E44A1] transition"
      >
        + Catat Baru
      </button>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex space-x-1.5 mt-3 overflow-x-auto pb-1">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="text-[11px] px-3 py-1 rounded-full font-bold shrink-0 transition"
        :class="
          activeTab === tab.id
            ? 'bg-[#7056B3] text-white shadow-xs'
            : 'bg-purple-100/70 text-purple-700'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content Items -->
    <div class="mt-4 space-y-3">
      <!-- 1. Mind Dumps -->
      <template v-if="activeTab === 'all' || activeTab === 'dumps'">
        <div
          v-for="dump in filteredDumps"
          :key="dump.id"
          class="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs"
        >
          <div
            class="flex items-center justify-between text-[10px] text-purple-400 font-semibold mb-2"
          >
            <span
              class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold"
              >✏️ Mind Dump • {{ dump.category }}</span
            >
            <span>{{ formatDate(dump.createdAt) }}</span>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed font-medium">
            {{ dump.content }}
          </p>
          <div class="mt-3 pt-2 border-t border-purple-50 flex justify-end">
            <button
              @click="
                $router.push({
                  path: '/reality-check',
                  query: { thought: dump.content },
                })
              "
              class="text-[11px] text-[#7056B3] font-bold hover:underline flex items-center space-x-1"
            >
              <span>Uji di Reality Check</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </template>

      <!-- 2. Reality Checks -->
      <template v-if="activeTab === 'all' || activeTab === 'reality'">
        <div
          v-for="rc in realityChecks"
          :key="rc.id"
          class="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs"
        >
          <div
            class="flex items-center justify-between text-[10px] text-purple-400 font-semibold mb-2"
          >
            <span
              class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold"
              >⚖️ Reality Check Reframed</span
            >
            <span>{{ formatDate(rc.createdAt) }}</span>
          </div>
          <div class="space-y-1.5 text-xs">
            <p class="text-slate-500 italic">"{{ rc.thought }}"</p>
            <div
              class="bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl text-emerald-950 font-medium"
            >
              🌿 <b>Pikiran Seimbang:</b> {{ rc.reframe || rc.note }}
            </div>
          </div>
        </div>
      </template>

      <!-- 3. Gratitude Entries -->
      <template v-if="activeTab === 'all' || activeTab === 'gratitude'">
        <div
          v-for="grat in gratitudes"
          :key="grat.id"
          class="bg-gradient-to-r from-white to-[#FFFBF2] rounded-2xl p-4 border border-amber-200/60 shadow-2xs"
        >
          <div
            class="flex items-center justify-between text-[10px] text-amber-600 font-semibold mb-2"
          >
            <span
              class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold"
              >💛 Rasa Syukur</span
            >
            <span>{{ grat.date }}</span>
          </div>
          <ul class="text-xs text-slate-700 space-y-1 mb-1.5">
            <li
              v-for="(it, i) in grat.items"
              :key="i"
              class="flex items-start space-x-1.5"
            >
              <span class="text-amber-500">•</span>
              <span>{{ it }}</span>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { MindEaseDB } from "../firebase";

const activeTab = ref("all");
const filterTabs = [
  { id: "all", label: "Semua" },
  { id: "dumps", label: "Mind Dump" },
  { id: "reality", label: "Reality Check" },
  { id: "gratitude", label: "Rasa Syukur" },
];

const dumps = ref([]);
const realityChecks = ref([]);
const gratitudes = ref([]);

const filteredDumps = computed(() => dumps.value);

const loadData = async () => {
  dumps.value = await MindEaseDB.getMindDumps();
  realityChecks.value = await MindEaseDB.getRealityChecks();
  gratitudes.value = MindEaseDB.getGratitudes();
};

const formatDate = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Hari ini";
  }
};

onMounted(() => {
  loadData();
});
</script>
