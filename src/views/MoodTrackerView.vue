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
        Mood Tracker
      </h2>
      <div class="w-9"></div>
    </div>

    <!-- "How are you today?" Section matching prototype -->
    <div
      class="mt-3 w-full flex flex-col items-center justify-center text-center"
    >
      <div class="flex items-center justify-center text-center pb-2.5">
        <h3 class="text-xs font-bold text-[#3E2B6B] leading-none">
          How are you today?
        </h3>
      </div>

      <!-- 5 Mood Emojis matching prototype -->
      <div class="flex items-center justify-around px-2 mb-3">
        <button
          v-for="(face, idx) in 5"
          :key="idx"
          @click="selectMood(idx)"
          class="transition transform active:scale-90 relative"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="
              selectedMood === idx
                ? idx === 4
                  ? 'bg-[#98E4B0] ring-4 ring-[#83DBA0]/80 shadow-md scale-105'
                  : 'bg-amber-200 ring-4 ring-amber-300 shadow-md scale-105'
                : idx === 4
                  ? 'bg-[#B4EDC7]'
                  : 'bg-[#FBE8A6]'
            "
          >
            <!-- Face 0: Sad -->
            <svg
              v-if="idx === 0"
              class="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M8 16C9 14.2 15 14.2 16 16"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <!-- Face 1: Down -->
            <svg
              v-else-if="idx === 1"
              class="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M9 15.5H15"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <!-- Face 2: Neutral -->
            <svg
              v-else-if="idx === 2"
              class="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M8.5 15C10 15 14 15 15.5 15"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <!-- Face 3: Good -->
            <svg
              v-else-if="idx === 3"
              class="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M8.5 14.5C9.5 16 14.5 16 15.5 14.5"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <!-- Face 4: Super Happy -->
            <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 10C7.5 8.8 9.5 8.8 10 10"
                stroke="#1B5E34"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                d="M14 10C14.5 8.8 16.5 8.8 17 10"
                stroke="#1B5E34"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path d="M8 13.5C8.8 16.8 15.2 16.8 16 13.5H8Z" fill="#1B5E34" />
            </svg>

            <div
              v-if="idx === 4"
              class="absolute -bottom-1.5 text-[#7056B3] font-black text-[10px] leading-none"
            >
              +
            </div>
          </div>
        </button>
      </div>

      <!-- Detail Emotion Tags -->
      <div class="mb-3">
        <span
          class="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1"
          >Nuansa Perasaan:</span
        >
        <div class="flex flex-wrap justify-center gap-1">
          <button
            v-for="tag in emotionOptions"
            :key="tag"
            @click="toggleEmotion(tag)"
            class="text-[10px] px-2.5 py-0.5 rounded-full transition font-medium"
            :class="
              selectedEmotions.includes(tag)
                ? 'bg-[#7056B3] text-white'
                : 'bg-purple-100/70 text-purple-700 hover:bg-purple-100'
            "
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>

    <!-- "Your mood this week" Chart Card matching prototype -->
    <div
      class="bg-white rounded-3xl p-4 border border-purple-100 shadow-xs mb-3.5"
    >
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-xs font-bold text-[#4B377E]">Your mood this week</h4>
        <span
          class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full"
          >Tren Positif</span
        >
      </div>

      <!-- SVG Line Chart with data points for Mon - Sun -->
      <div class="w-full h-28 relative">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 300 100">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#9B7BDC" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#9B7BDC" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Grid Lines -->
          <line
            x1="10"
            y1="20"
            x2="290"
            y2="20"
            stroke="#F1EDF8"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <line
            x1="10"
            y1="50"
            x2="290"
            y2="50"
            stroke="#F1EDF8"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <line
            x1="10"
            y1="80"
            x2="290"
            y2="80"
            stroke="#F1EDF8"
            stroke-width="1"
            stroke-dasharray="3 3"
          />

          <!-- Area & Line -->
          <path :d="areaPath" fill="url(#chartGrad)" />
          <path
            :d="linePath"
            fill="none"
            stroke="#7E57C2"
            stroke-width="2.5"
            stroke-linecap="round"
          />

          <!-- Dots for Mon - Sun -->
          <g v-for="(pt, idx) in chartPoints" :key="idx">
            <circle
              :cx="pt.x"
              :cy="pt.y"
              r="4.5"
              fill="#7E57C2"
              stroke="#FFFFFF"
              stroke-width="2"
              class="cursor-pointer transition hover:r-6"
            />
          </g>
        </svg>

        <!-- Mon Tue Wed Thu Fri Sat Sun matching prototype -->
        <div
          class="flex justify-between px-1 text-[10px] text-purple-400 font-semibold mt-1"
        >
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>

    <!-- Motivational Card matching prototype: Star + "You're doing great! Keep going ♡" -->
    <div
      class="bg-[#FFFBF0] border border-amber-200/70 rounded-3xl p-3.5 flex items-center space-x-3 shadow-xs mb-3.5"
    >
      <div
        class="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 shrink-0"
      >
        <Star :size="18" class="fill-amber-400 text-amber-500" />
      </div>
      <div>
        <p class="text-xs font-bold text-amber-900">You're doing great!</p>
        <p class="text-[11px] font-medium text-amber-700/90 mt-0.5">
          Keep going ♡
        </p>
      </div>
    </div>

    <!-- Recent Mood Logs for this User -->
    <div>
      <h4 class="text-xs font-bold text-purple-900 mb-2">
        Riwayat Catatan Suasana Hati
      </h4>
      <div class="space-y-2">
        <div
          v-for="log in recentLogs.slice(0, 4)"
          :key="log.id"
          class="bg-white/90 border border-purple-100 rounded-2xl p-2.5 flex items-center justify-between text-xs"
        >
          <div class="flex items-center space-x-2.5">
            <span class="text-base">{{ getMoodEmoji(log.moodIndex) }}</span>
            <div>
              <span class="font-semibold text-purple-900 block leading-tight">{{
                getMoodLabel(log.moodIndex)
              }}</span>
              <span class="text-[10px] text-purple-400"
                >{{ log.day }}, {{ log.date }}</span
              >
            </div>
          </div>
          <div class="flex space-x-1">
            <span
              v-for="tag in (log.emotionTags || []).slice(0, 2)"
              :key="tag"
              class="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-md font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ChevronLeft, Star } from "lucide-vue-next";
import { MindEaseDB } from "../firebase";

const selectedMood = ref(4);
const weeklyMood = ref([1, 2, 2, 3, 2, 3, 4]);
const recentLogs = ref([]);

const emotionOptions = [
  "Tenang",
  "Bersyukur",
  "Bersemangat",
  "Cemas",
  "Lelah",
  "Gelisah",
];
const selectedEmotions = ref(["Tenang", "Bersyukur"]);

const chartPoints = computed(() => {
  const xs = [20, 63, 106, 150, 193, 236, 280];
  return weeklyMood.value.map((val, idx) => {
    const y = 80 - (val / 4) * 60;
    return { x: xs[idx], y };
  });
});

const linePath = computed(() => {
  const pts = chartPoints.value;
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
});

const areaPath = computed(() => {
  const pts = chartPoints.value;
  if (!pts.length) return "";
  return `${linePath.value} L ${pts[pts.length - 1].x} 90 L ${pts[0].x} 90 Z`;
});

const selectMood = async (idx) => {
  selectedMood.value = idx;
  await MindEaseDB.saveMood(idx, {
    emotionTags: selectedEmotions.value,
  });
  loadData();
};

const toggleEmotion = (tag) => {
  if (selectedEmotions.value.includes(tag)) {
    selectedEmotions.value = selectedEmotions.value.filter((t) => t !== tag);
  } else {
    selectedEmotions.value.push(tag);
  }
};

const getMoodEmoji = (idx) => {
  const emojis = ["😢", "🙁", "😐", "🙂", "😊"];
  return emojis[idx] || "🙂";
};

const getMoodLabel = (idx) => {
  const labels = [
    "Sangat Sedih",
    "Kurang Baik",
    "Netral",
    "Cukup Baik",
    "Sangat Bahagia",
  ];
  return labels[idx] || "Bahagia";
};

const loadData = () => {
  weeklyMood.value = MindEaseDB.getWeeklyMood();
  recentLogs.value = MindEaseDB.getRecentMoodLogs();
};

onMounted(() => {
  loadData();
});
</script>
