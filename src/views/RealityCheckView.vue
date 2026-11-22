<template>
  <div
    class="flex-1 flex flex-col px-5 pt-3 pb-6 select-none bg-[#FAF8FE] overflow-y-auto"
  >
    <!-- Top Header: Back Arrow + Title -->
    <div
      class="flex items-center justify-between py-2 border-b border-purple-100/60 pb-3"
    >
      <button
        @click="$router.push('/')"
        class="w-9 h-9 rounded-full bg-[#EDE7F6] flex items-center justify-center text-[#553896] hover:bg-purple-200 transition"
      >
        <ChevronLeft :size="22" stroke-width="2.5" />
      </button>
      <h2 class="text-base font-bold text-[#3B2965] tracking-tight">
        Reality Check
      </h2>
      <div class="w-9"></div>
    </div>

    <!-- Thought Bubble matching prototype -->
    <div class="my-3 flex justify-center">
      <div
        class="relative bg-white border border-purple-100 shadow-sm rounded-3xl px-5 py-3.5 max-w-[320px] text-center"
      >
        <div
          class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1"
        >
          <div
            class="w-2 h-2 bg-white border border-purple-100 rounded-full"
          ></div>
          <div
            class="w-1 h-1 bg-white border border-purple-100 rounded-full mt-1"
          ></div>
        </div>
        <p class="text-xs font-semibold text-[#4A327E] leading-relaxed">
          "{{ currentThought }}"
        </p>
      </div>
    </div>

    <!-- CBT Cognitive Distortion Identifier -->
    <div class="mb-3">
      <div class="flex justify-between items-center mb-1">
        <span
          class="text-[10px] font-bold text-purple-700 uppercase tracking-wider"
          >Identifikasi Pola Pikir:</span
        >
      </div>
      <select
        v-model="selectedDistortion"
        class="w-full text-[11px] font-medium bg-[#F3EEFC] border border-purple-200/80 rounded-xl px-2.5 py-1.5 text-purple-900 outline-none"
      >
        <option
          v-for="(dist, idx) in cognitiveDistortions"
          :key="idx"
          :value="dist"
        >
          {{ dist }}
        </option>
      </select>
    </div>

    <!-- 2 Column Comparison: Fakta vs Asumsi matching prototype -->
    <div class="grid grid-cols-2 gap-2.5 flex-1 mb-3">
      <!-- 1. Kolom Fakta (Pastel Mint Green) -->
      <div
        class="bg-[#F0FBF5] border border-emerald-200/60 rounded-3xl p-3 flex flex-col min-h-[160px]"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-emerald-800">Fakta Nyata</span>
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <!-- Facts list -->
        <div class="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
          <div
            v-for="(item, idx) in facts"
            :key="'fact-' + idx"
            class="flex items-start justify-between space-x-1 text-[11px] text-emerald-950 font-medium group"
          >
            <div class="flex items-start space-x-1">
              <Check
                :size="13"
                class="text-emerald-600 shrink-0 mt-0.5"
                stroke-width="3"
              />
              <span class="leading-tight">{{ item }}</span>
            </div>
            <button
              @click="removeFact(idx)"
              class="text-emerald-400 hover:text-emerald-700 text-[10px] opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Add fact small input -->
        <div class="mt-2 pt-1.5 border-t border-emerald-100 flex items-center">
          <input
            v-model="newFact"
            @keyup.enter="addFact"
            type="text"
            placeholder="+ Tambah fakta"
            class="w-full text-[10px] bg-transparent outline-none placeholder-emerald-400 text-emerald-800"
          />
        </div>
      </div>

      <!-- 2. Kolom Asumsi (Pastel Lavender) -->
      <div
        class="bg-[#F6F2FD] border border-purple-200/60 rounded-3xl p-3 flex flex-col min-h-[160px]"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-[#573A94]">Asumsi & Takut</span>
          <span class="w-2 h-2 rounded-full bg-purple-400"></span>
        </div>

        <!-- Assumptions list -->
        <div class="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
          <div
            v-for="(item, idx) in assumptions"
            :key="'assump-' + idx"
            class="flex items-start justify-between space-x-1 text-[11px] text-purple-950 font-medium group"
          >
            <div class="flex items-start space-x-1">
              <div
                class="w-3 h-3 rounded-full border-2 border-purple-400 shrink-0 mt-0.5"
              ></div>
              <span class="leading-tight">{{ item }}</span>
            </div>
            <button
              @click="removeAssumption(idx)"
              class="text-purple-400 hover:text-purple-700 text-[10px] opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Add assumption small input -->
        <div class="mt-2 pt-1.5 border-t border-purple-100 flex items-center">
          <input
            v-model="newAssumption"
            @keyup.enter="addAssumption"
            type="text"
            placeholder="+ Tambah asumsi"
            class="w-full text-[10px] bg-transparent outline-none placeholder-purple-400 text-purple-800"
          />
        </div>
      </div>
    </div>

    <!-- Reframed Thought Card (Pikiran Baru yang Seimbang) -->
    <div
      class="bg-white rounded-2xl p-3 border border-purple-100/90 shadow-2xs mb-3"
    >
      <label class="block text-[11px] font-bold text-[#4B377E] mb-1">
        🌿 Pikiran Baru yang Lebih Seimbang:
      </label>
      <input
        v-model="reframeText"
        type="text"
        placeholder="e.g. Walaupun gugup, aku sudah bersiap dan pasti bisa melaluinya."
        class="w-full text-xs text-slate-700 bg-transparent outline-none placeholder-purple-300"
      />
    </div>

    <!-- Tip / Insight Card matching prototype -->
    <div
      class="bg-[#F3EEFC] border border-purple-200/80 rounded-2xl p-2.5 flex items-center space-x-2.5 mb-3 shadow-xs"
    >
      <div
        class="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-amber-500 shrink-0"
      >
        <Lightbulb :size="16" stroke-width="2.2" />
      </div>
      <p class="text-[11px] text-[#483377] font-medium leading-snug">
        Coba fokus pada <b>faktanya</b>, bukan asumsi yang belum tentu terjadi.
      </p>
    </div>

    <!-- Button: Lanjut -->
    <button
      @click="proceedNext"
      class="w-full py-3.5 bg-[#7056B3] hover:bg-[#5E44A1] active:scale-[0.98] text-white font-bold text-xs rounded-2xl shadow-md shadow-purple-900/15 transition flex items-center justify-center space-x-2"
    >
      <span>Simpan Refleksi & Lanjut ke Calm Corner</span>
      <ArrowRight :size="16" />
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ChevronLeft, Check, Lightbulb, ArrowRight } from "lucide-vue-next";
import { MindEaseDB } from "../firebase";

const router = useRouter();
const route = useRoute();

const currentThought = ref(
  route.query.thought || "Aku pasti akan gagal presentasi...",
);

const cognitiveDistortions = [
  "Meramal Masa Depan Negatif (Fortune Telling)",
  "Pikiran Semua-atau-Tidak Sama Sekali (All-or-Nothing)",
  "Membaca Pikiran Orang Lain (Mind Reading)",
  "Katastrofikasi (Membayangkan yang Terburuk)",
  "Mengabaikan Hal Positif (Discounting the Positive)",
];

const selectedDistortion = ref(cognitiveDistortions[0]);
const reframeText = ref(
  "Walaupun aku gugup, aku sudah mempersiapkan diri dan mampu melewatinya.",
);

const facts = ref(["Aku sudah belajar", "Aku pernah berhasil"]);

const assumptions = ref(["Dosen pasti marah", "Teman-teman menilai buruk"]);

const newFact = ref("");
const newAssumption = ref("");

const addFact = () => {
  if (newFact.value.trim()) {
    facts.value.push(newFact.value.trim());
    newFact.value = "";
  }
};

const removeFact = (idx) => {
  facts.value.splice(idx, 1);
};

const addAssumption = () => {
  if (newAssumption.value.trim()) {
    assumptions.value.push(newAssumption.value.trim());
    newAssumption.value = "";
  }
};

const removeAssumption = (idx) => {
  assumptions.value.splice(idx, 1);
};

const proceedNext = async () => {
  await MindEaseDB.saveRealityCheck({
    thought: currentThought.value,
    facts: facts.value,
    assumptions: assumptions.value,
    cognitiveDistortion: selectedDistortion.value,
    reframe: reframeText.value,
  });
  router.push("/calm-corner");
};
</script>
