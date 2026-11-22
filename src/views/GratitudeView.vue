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
        Catatan Rasa Syukur
      </h2>
      <div class="w-9"></div>
    </div>

    <!-- Motivational Prompt Banner -->
    <div
      class="mt-4 bg-gradient-to-r from-[#FFF9E6] to-[#FBF1D5] border border-amber-200/80 rounded-3xl p-4 shadow-xs"
    >
      <div class="flex items-center space-x-2.5 mb-1.5">
        <span class="text-lg">✨</span>
        <h3 class="text-xs font-bold text-amber-900">3 Hal Baik Hari Ini</h3>
      </div>
      <p class="text-xs text-amber-800/90 leading-relaxed">
        Menyadari hal-hal kecil yang positif dapat melatih otak kita untuk lebih
        tenang dan bahagia secara alami.
      </p>
    </div>

    <!-- 3 Input Cards -->
    <div class="mt-4 space-y-2.5">
      <div
        class="bg-white rounded-2xl p-3.5 border border-purple-100/90 shadow-2xs"
      >
        <label class="block text-[11px] font-bold text-[#7056B3] mb-1"
          >1. Hal sederhana yang membuatku tersenyum:</label
        >
        <input
          v-model="items[0]"
          type="text"
          placeholder="e.g. Secangkir kopi hangat di pagi hari"
          class="w-full text-xs text-slate-700 bg-transparent outline-none placeholder-purple-300"
        />
      </div>

      <div
        class="bg-white rounded-2xl p-3.5 border border-purple-100/90 shadow-2xs"
      >
        <label class="block text-[11px] font-bold text-[#7056B3] mb-1"
          >2. Seseorang atau momen yang berharga:</label
        >
        <input
          v-model="items[1]"
          type="text"
          placeholder="e.g. Pesan singkat menyemangati dari teman"
          class="w-full text-xs text-slate-700 bg-transparent outline-none placeholder-purple-300"
        />
      </div>

      <div
        class="bg-white rounded-2xl p-3.5 border border-purple-100/90 shadow-2xs"
      >
        <label class="block text-[11px] font-bold text-[#7056B3] mb-1"
          >3. Hal positif tentang diriku hari ini:</label
        >
        <input
          v-model="items[2]"
          type="text"
          placeholder="e.g. Aku berhasil menahan emosi dan tetap sabar"
          class="w-full text-xs text-slate-700 bg-transparent outline-none placeholder-purple-300"
        />
      </div>

      <!-- Optional reflection -->
      <div
        class="bg-white rounded-2xl p-3.5 border border-purple-100/90 shadow-2xs"
      >
        <label class="block text-[11px] font-bold text-[#553896] mb-1"
          >Pesan refleksi untuk diriku sendiri (opsional):</label
        >
        <textarea
          v-model="reflection"
          rows="2"
          placeholder="e.g. Bersyukur masih diberi kesehatan dan kesempatan berproses..."
          class="w-full text-xs text-slate-700 bg-transparent outline-none placeholder-purple-300 resize-none"
        ></textarea>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-4">
      <button
        @click="saveGratitude"
        :disabled="!isValid || isSaving"
        class="w-full py-3.5 bg-[#7056B3] hover:bg-[#5E44A1] active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md shadow-purple-900/15 transition flex items-center justify-center space-x-2"
      >
        <span v-if="!isSaving">Simpan Catatan Syukur ♡</span>
        <span v-else>Menyimpan ke Database...</span>
      </button>
    </div>

    <!-- Past Gratitude Entries -->
    <div class="mt-6">
      <h4 class="text-xs font-bold text-purple-900 mb-2.5">
        Koleksi Rasa Syukur Sebelumnya
      </h4>
      <div class="space-y-3">
        <div
          v-for="entry in history"
          :key="entry.id"
          class="bg-white/90 rounded-2xl p-3.5 border border-purple-100 shadow-2xs"
        >
          <div
            class="flex justify-between items-center text-[10px] text-purple-400 font-semibold mb-2"
          >
            <span>🌸 Jurnal Syukur</span>
            <span>{{ entry.date }}</span>
          </div>
          <ul class="space-y-1.5 text-xs text-slate-700 mb-2">
            <li
              v-for="(it, idx) in entry.items"
              :key="idx"
              class="flex items-start space-x-1.5"
            >
              <span class="text-amber-500 font-bold">•</span>
              <span class="leading-tight">{{ it }}</span>
            </li>
          </ul>
          <p
            v-if="entry.reflection"
            class="text-[11px] text-purple-700 italic bg-purple-50/60 p-2 rounded-xl mt-1.5"
          >
            "{{ entry.reflection }}"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeft } from "lucide-vue-next";
import { MindEaseDB } from "../firebase";

const router = useRouter();
const items = ref(["", "", ""]);
const reflection = ref("");
const isSaving = ref(false);
const history = ref([]);

const isValid = computed(() => {
  return items.value.some((it) => it.trim().length > 0);
});

const saveGratitude = async () => {
  if (!isValid.value) return;
  isSaving.value = true;
  try {
    const validItems = items.value.filter((it) => it.trim().length > 0);
    await MindEaseDB.saveGratitude({
      items: validItems,
      reflection: reflection.value,
    });
    items.value = ["", "", ""];
    reflection.value = "";
    loadHistory();
  } finally {
    isSaving.value = false;
  }
};

const loadHistory = () => {
  history.value = MindEaseDB.getGratitudes();
};

onMounted(() => {
  loadHistory();
});
</script>
