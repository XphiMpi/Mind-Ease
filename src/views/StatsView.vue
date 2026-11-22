<template>
  <div
    class="flex-1 flex flex-col px-5 pt-3 pb-6 select-none bg-[#FAF8FE] overflow-y-auto"
  >
    <!-- Top Header -->
    <div
      class="py-2 border-b border-purple-100/60 pb-3 flex justify-between items-center"
    >
      <h2 class="text-base font-bold text-[#3B2965] tracking-tight">
        Statistik Mindfulness
      </h2>
      <span
        class="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full"
        >Aktif</span
      >
    </div>

    <!-- Quick stats grid with live database metrics -->
    <div class="grid grid-cols-2 gap-3 mt-4">
      <div
        class="bg-white p-3.5 rounded-3xl border border-purple-100 shadow-2xs"
      >
        <span class="text-[11px] text-purple-400 font-semibold block"
          >Hari Berturut-turut</span
        >
        <span class="text-2xl font-black text-[#7056B3] mt-1 block"
          >{{ stats.streakDays }} Hari 🔥</span
        >
        <span class="text-[10px] text-emerald-600 mt-1 block"
          >Pertahankan konsistensimu!</span
        >
      </div>

      <div
        class="bg-white p-3.5 rounded-3xl border border-purple-100 shadow-2xs"
      >
        <span class="text-[11px] text-purple-400 font-semibold block"
          >Waktu Relaksasi</span
        >
        <span class="text-2xl font-black text-[#7056B3] mt-1 block"
          >{{ stats.meditationMinutes }} Mnt 🧘</span
        >
        <span class="text-[10px] text-purple-500 mt-1 block"
          >Di Calm Corner</span
        >
      </div>

      <div
        class="bg-white p-3.5 rounded-3xl border border-purple-100 shadow-2xs"
      >
        <span class="text-[11px] text-purple-400 font-semibold block"
          >Pikiran Terurai</span
        >
        <span class="text-2xl font-black text-[#7056B3] mt-1 block"
          >{{ stats.totalDumps }} Catatan 📝</span
        >
        <span class="text-[10px] text-purple-500 mt-1 block">Di Mind Dump</span>
      </div>

      <div
        class="bg-white p-3.5 rounded-3xl border border-purple-100 shadow-2xs"
      >
        <span class="text-[11px] text-purple-400 font-semibold block"
          >Reality Check Selesai</span
        >
        <span class="text-2xl font-black text-[#7056B3] mt-1 block"
          >{{ stats.totalRealityChecks }} Refleksi ⚖️</span
        >
        <span class="text-[10px] text-emerald-600 mt-1 block"
          >Fakta vs Asumsi</span
        >
      </div>
    </div>

    <!-- Mood Breakdown -->
    <div
      class="mt-4 bg-white rounded-3xl p-4 border border-purple-100 shadow-2xs"
    >
      <h4 class="text-xs font-bold text-[#4B377E] mb-3">
        Distribusi Suasana Hati:
      </h4>

      <div class="space-y-2">
        <div>
          <div
            class="flex justify-between text-[11px] text-purple-900 font-semibold mb-1"
          >
            <span>😊 Bahagia / Cukup Baik</span>
            <span>70%</span>
          </div>
          <div class="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
            <div class="w-[70%] h-full bg-[#825DC9] rounded-full"></div>
          </div>
        </div>

        <div>
          <div
            class="flex justify-between text-[11px] text-purple-900 font-semibold mb-1"
          >
            <span>😐 Netral / Tenang</span>
            <span>20%</span>
          </div>
          <div class="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
            <div class="w-[20%] h-full bg-[#B79EE7] rounded-full"></div>
          </div>
        </div>

        <div>
          <div
            class="flex justify-between text-[11px] text-purple-900 font-semibold mb-1"
          >
            <span>😢 Cemas / Sedih</span>
            <span>10%</span>
          </div>
          <div class="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
            <div class="w-[10%] h-full bg-amber-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement summary -->
    <div class="mt-4 bg-[#F2ECFD] rounded-3xl p-4 border border-purple-200/80">
      <h4 class="text-xs font-bold text-[#4B377E] mb-1">
        Pencapaian Minggu Ini:
      </h4>
      <p class="text-xs text-purple-800 leading-relaxed">
        Kamu telah membedakan asumsi negatif menjadi fakta nyata dan rutin
        melakukan relaksasi di Calm Corner. Terus jaga kedamaian pikiranmu!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { MindEaseDB } from "../firebase";

const stats = ref({
  totalDumps: 0,
  totalRealityChecks: 0,
  totalMoodLogs: 0,
  totalGratitudes: 0,
  meditationMinutes: 15,
  streakDays: 5,
});

onMounted(() => {
  stats.value = MindEaseDB.getUserStats();
});
</script>
