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
        Mind Dump
      </h2>
      <button
        @click="showPastEntries = !showPastEntries"
        class="text-xs text-[#7056B3] font-semibold hover:underline"
      >
        {{ showPastEntries ? "Tulis Baru" : "Riwayat" }}
      </button>
    </div>

    <!-- Mode 1: Editor Form -->
    <div v-if="!showPastEntries" class="flex-1 flex flex-col mt-4">
      <!-- Category & Emotion Chips -->
      <div class="mb-3">
        <span
          class="text-[10px] font-bold text-purple-500 uppercase tracking-wider block mb-1"
          >Kategori:</span
        >
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="text-[10px] px-2.5 py-1 rounded-full font-medium transition"
            :class="
              selectedCategory === cat
                ? 'bg-[#7056B3] text-white shadow-xs'
                : 'bg-purple-100/70 text-purple-700 hover:bg-purple-100'
            "
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Input Card Box -->
      <div
        class="bg-white rounded-3xl p-4 border border-purple-100/80 shadow-xs flex-1 flex flex-col relative overflow-hidden min-h-[220px]"
      >
        <label class="block text-xs font-bold text-[#4B377E] mb-2">
          What's on your mind?
        </label>

        <textarea
          v-model="thoughtText"
          placeholder="e.g. Aku takut gagal di presentasi besok di depan dosen dan teman-teman..."
          rows="6"
          class="w-full flex-1 resize-none bg-transparent outline-none text-slate-700 placeholder-purple-300 text-xs leading-relaxed"
        ></textarea>

        <!-- Untangling doodle SVG at bottom -->
        <div
          class="flex justify-between items-end pt-2 border-t border-purple-50"
        >
          <div class="text-[10px] text-purple-400 font-medium">
            <span>{{ thoughtText.length }} karakter</span>
            <span v-if="thoughtText.length > 0" class="text-emerald-600 ml-1.5"
              >• Pikiran sedang diurai</span
            >
          </div>

          <!-- Tangled yarn doodle SVG -->
          <div
            class="w-16 h-12 text-purple-400 opacity-80 transition transform hover:rotate-6"
          >
            <svg
              viewBox="0 0 100 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 65 Q 25 55 40 68 T 65 60"
                stroke="#9B7BDC"
                stroke-width="2"
                stroke-linecap="round"
              />
              <ellipse
                cx="68"
                cy="45"
                rx="22"
                ry="20"
                stroke="#7E57C2"
                stroke-width="2.2"
                stroke-dasharray="2 3"
              />
              <path
                d="M55 40 Q 65 25 78 38 T 68 55 Q 52 48 65 35"
                stroke="#7E57C2"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick prompts -->
      <div class="mt-3">
        <p
          class="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1.5"
        >
          Contoh kegelisahan:
        </p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(hint, i) in quickHints"
            :key="i"
            @click="thoughtText = hint"
            class="text-[11px] bg-[#EDE7F6] text-[#553896] px-2.5 py-1 rounded-full hover:bg-purple-200 transition"
          >
            {{ hint }}
          </button>
        </div>
      </div>

      <!-- Action Button: Save Entry -->
      <div class="mt-4 space-y-2">
        <button
          @click="saveEntry"
          :disabled="!thoughtText.trim() || isSaving"
          class="w-full py-3.5 bg-[#7056B3] hover:bg-[#5E44A1] active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md shadow-purple-900/15 transition flex items-center justify-center space-x-2"
        >
          <span v-if="!isSaving">Save Entry ♡</span>
          <span v-else class="flex items-center space-x-2">
            <span
              class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            <span>Menyimpan ke Database...</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Mode 2: Past Entries List for Active User -->
    <div v-else class="mt-4 space-y-3">
      <div
        v-for="item in pastEntries"
        :key="item.id"
        class="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs relative"
      >
        <div
          class="flex items-center justify-between text-[10px] text-purple-400 font-semibold mb-1.5"
        >
          <span
            class="bg-purple-100/80 text-purple-800 px-2 py-0.5 rounded-full"
            >{{ item.category }}</span
          >
          <span>{{ formatDate(item.createdAt) }}</span>
        </div>
        <p class="text-xs text-slate-700 leading-relaxed font-medium">
          {{ item.content }}
        </p>
        <div
          class="mt-3 pt-2 border-t border-purple-50 flex justify-between items-center"
        >
          <button
            @click="deleteEntry(item.id)"
            class="text-[10px] text-rose-500 hover:underline"
          >
            Hapus
          </button>
          <button
            @click="proceedToRealityCheck(item.content)"
            class="text-[11px] text-[#7056B3] font-bold hover:underline flex items-center space-x-1"
          >
            <span>Uji di Reality Check</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div
        v-if="pastEntries.length === 0"
        class="text-center py-12 text-purple-400 text-xs"
      >
        Belum ada catatan pikiran. Tuliskan beban pikiran pertamamu!
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-purple-100 text-center space-y-3"
      >
        <div
          class="w-12 h-12 bg-green-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center"
        >
          <Check :size="24" stroke-width="2.5" />
        </div>
        <h3 class="font-bold text-slate-800 text-sm">
          Pikiran Berhasil Disimpan!
        </h3>
        <p class="text-xs text-slate-500 leading-relaxed">
          Pikiranmu telah terurai di database. Ingin membedakan
          <b>fakta vs asumsi</b> dari pikiran ini lewat Reality Check?
        </p>
        <div class="space-y-2 pt-1">
          <button
            @click="goToRealityCheck"
            class="w-full py-2.5 bg-[#7056B3] hover:bg-[#5E44A1] text-white rounded-2xl font-bold text-xs transition"
          >
            Lanjut ke Reality Check ⚖️
          </button>
          <button
            @click="
              showSuccess = false;
              showPastEntries = true;
            "
            class="w-full py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-2xl font-semibold text-xs transition"
          >
            Lihat Riwayat Jurnal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeft, Check } from "lucide-vue-next";
import { MindEaseDB } from "../firebase";

const router = useRouter();
const thoughtText = ref("Aku pasti akan gagal presentasi besok...");
const isSaving = ref(false);
const showSuccess = ref(false);
const showPastEntries = ref(false);
const pastEntries = ref([]);

const categories = [
  "Overthinking",
  "Pekerjaan/Kuliah",
  "Hubungan",
  "Kesehatan",
  "Finansial",
];
const selectedCategory = ref("Pekerjaan/Kuliah");

const quickHints = [
  "Aku takut gagal presentasi",
  "Khawatir tugas tidak selesai tepat waktu",
  "Merasa cemas orang lain menilai buruk",
];

const loadPastEntries = async () => {
  pastEntries.value = await MindEaseDB.getMindDumps();
};

const saveEntry = async () => {
  if (!thoughtText.value.trim()) return;
  isSaving.value = true;
  try {
    await MindEaseDB.saveMindDump(thoughtText.value, selectedCategory.value);
    showSuccess.value = true;
    loadPastEntries();
  } finally {
    isSaving.value = false;
  }
};

const deleteEntry = async (id) => {
  await MindEaseDB.deleteMindDump(id);
  loadPastEntries();
};

const goToRealityCheck = () => {
  router.push({
    path: "/reality-check",
    query: { thought: thoughtText.value },
  });
};

const proceedToRealityCheck = (content) => {
  router.push({
    path: "/reality-check",
    query: { thought: content },
  });
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
    return "Baru saja";
  }
};

onMounted(() => {
  loadPastEntries();
});
</script>
