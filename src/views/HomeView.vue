<template>
  <div
    class="flex-1 flex flex-col px-5 pt-4 pb-6 select-none bg-[#FAF8FE] overflow-y-auto"
  >
    <!-- Top Header: Logo + User Status / Login Button + Notification -->
    <div class="flex items-center justify-between py-1.5 shrink-0">
      <div class="flex items-center space-x-2">
        <!-- Purple Water Droplet Logo -->
        <div
          class="w-8 h-8 rounded-full bg-[#EDE7F6] flex items-center justify-center text-[#6D54B5] shadow-2xs"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient
                id="dropGradHome"
                x1="4"
                y1="2"
                x2="20"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#9B7BDC" />
                <stop offset="100%" stop-color="#6B4FA8" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.69L6.34 8.35a8 8 0 1 0 11.32 0L12 2.69z"
              fill="url(#dropGradHome)"
            />
            <path
              d="M9.5 13.5c0-2 1-3 2-4"
              stroke="white"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-opacity="0.85"
            />
          </svg>
        </div>
        <span class="text-xl font-bold text-[#4A327E] tracking-tight"
          >MindEase</span
        >
      </div>

      <!-- Right controls: User Avatar & Notification Bell -->
      <div class="flex items-center space-x-2">
        <button
          @click="showAuthModal = true"
          class="flex items-center space-x-1.5 bg-[#EDE7F6] hover:bg-purple-200 border border-purple-200/80 px-2.5 py-1 rounded-full text-xs font-semibold text-[#573995] transition"
        >
          <span class="text-sm">{{ user?.avatar || "🌱" }}</span>
          <span class="max-w-[85px] truncate font-bold">
            {{ user?.isGuest ? "Tamu" : user?.displayName }}
          </span>
          <span
            v-if="user?.isGuest"
            class="text-[9px] bg-[#7056B3] text-white px-1.5 py-0.2 rounded-full font-medium ml-0.5"
          >
            Masuk
          </span>
        </button>

        <!-- Notification Bell -->
        <button
          @click="showNotice = true"
          class="w-8 h-8 rounded-full border border-purple-200/80 bg-white/80 flex items-center justify-center text-[#6D54B5] hover:bg-purple-50 transition shadow-xs relative"
        >
          <Bell :size="16" stroke-width="2" />
          <span
            class="absolute top-1 right-1 w-2 h-2 bg-[#6D54B5] rounded-full"
          ></span>
        </button>
      </div>
    </div>

    <!-- Greeting Section matching prototype -->
    <div class="mt-3 shrink-0">
      <h1 class="text-2xl font-extrabold text-[#38285F] tracking-tight">
        Hi, {{ user?.isGuest ? "there" : user?.displayName }}!
      </h1>
      <p class="text-xs font-medium text-purple-600/90 mt-0.5">
        Take a deep breath ♡
      </p>
    </div>

    <!-- Cute Smiling Cloud Illustration -->
    <div class="my-3 flex justify-center items-center relative py-1 shrink-0">
      <div
        class="absolute w-48 h-28 bg-purple-200/40 rounded-full blur-xl pointer-events-none"
      ></div>

      <!-- Floating Twinkle Stars -->
      <div class="absolute -top-1 left-16 text-purple-300 animate-pulse">
        <Sparkles :size="16" />
      </div>
      <div
        class="absolute top-6 right-16 text-purple-300 animate-pulse delay-300"
      >
        <Sparkles :size="18" />
      </div>

      <!-- Fluffy Smiling Purple Cloud SVG -->
      <div
        class="relative animate-float z-10 drop-shadow-sm cursor-pointer"
        @click="triggerCloudNudge"
      >
        <svg
          width="180"
          height="100"
          viewBox="0 0 190 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="cloudGrad"
              x1="20"
              y1="20"
              x2="170"
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#ECE5F8" />
              <stop offset="100%" stop-color="#D7C6F3" />
            </linearGradient>
          </defs>
          <path
            d="M48 92C32 92 18 78 18 62C18 48 29 36 43 33C47 20 59 11 74 11C87 11 98 18 103 28C108 24 115 22 122 22C137 22 150 33 152 48C164 50 174 60 174 72C174 85 163 92 150 92H48Z"
            fill="url(#cloudGrad)"
          />
          <path
            d="M78 55C80 58 84 58 86 55"
            stroke="#50377E"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <path
            d="M106 55C108 58 112 58 114 55"
            stroke="#50377E"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <path
            d="M92 63C94 66 98 66 100 63"
            stroke="#50377E"
            stroke-width="2.2"
            stroke-linecap="round"
          />
          <circle cx="72" cy="58" r="4.5" fill="#E8B4D8" fill-opacity="0.6" />
          <circle cx="120" cy="58" r="4.5" fill="#E8B4D8" fill-opacity="0.6" />
        </svg>
      </div>
    </div>

    <!-- "How are you today?" Purple Mood Card (Spacious, Symmetric, Never Clipped) -->
    <div
      class="w-full bg-[#6C53AF] rounded-3xl pt-4 pb-4 px-4 text-white shadow-md shadow-purple-900/15 mb-4 shrink-0 relative overflow-visible"
    >
      <!-- Title: Symmetrically Centered -->
      <h3
        class="w-full text-center font-bold text-xs sm:text-sm tracking-wide text-white leading-normal mb-3"
      >
        How are you today?
      </h3>

      <!-- 5 Mood Emojis: Full Row, Fully Visible -->
      <div class="flex items-center justify-around w-full">
        <!-- Mood 0: Sad -->
        <button
          @click="selectMood(0)"
          class="transition transform active:scale-90 p-0.5"
          title="Sangat Sedih"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="
              selectedMood === 0
                ? 'bg-[#FCE68C] ring-4 ring-amber-300 shadow-md scale-105'
                : 'bg-[#FDE68A] hover:scale-105'
            "
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M8 16C9 14.2 15 14.2 16 16"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </button>

        <!-- Mood 1: Worried / Down -->
        <button
          @click="selectMood(1)"
          class="transition transform active:scale-90 p-0.5"
          title="Kurang Baik"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="
              selectedMood === 1
                ? 'bg-[#FCE68C] ring-4 ring-amber-300 shadow-md scale-105'
                : 'bg-[#FDE68A] hover:scale-105'
            "
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M9 15.5H15"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </button>

        <!-- Mood 2: Neutral -->
        <button
          @click="selectMood(2)"
          class="transition transform active:scale-90 p-0.5"
          title="Netral"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="
              selectedMood === 2
                ? 'bg-[#FCE68C] ring-4 ring-amber-300 shadow-md scale-105'
                : 'bg-[#FDE68A] hover:scale-105'
            "
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M8.5 15C10 15 14 15 15.5 15"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </button>

        <!-- Mood 3: Happy -->
        <button
          @click="selectMood(3)"
          class="transition transform active:scale-90 p-0.5"
          title="Cukup Baik"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="
              selectedMood === 3
                ? 'bg-[#FCE68C] ring-4 ring-amber-300 shadow-md scale-105'
                : 'bg-[#FDE68A] hover:scale-105'
            "
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="8.5" cy="10" r="1.5" fill="#784B15" />
              <circle cx="15.5" cy="10" r="1.5" fill="#784B15" />
              <path
                d="M8.5 14.5C9.5 16 14.5 16 15.5 14.5"
                stroke="#784B15"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </button>

        <!-- Mood 4: Super Happy with halo and plus indicator (matching prototype) -->
        <button
          @click="selectMood(4)"
          class="transition transform active:scale-90 p-0.5 relative"
          title="Sangat Bahagia"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all relative"
            :class="
              selectedMood === 4
                ? 'bg-[#8CE5AB] ring-4 ring-[#83DBA0]/80 shadow-md scale-110'
                : 'bg-[#A8EBC0] hover:scale-105'
            "
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 10C7.5 8.8 9.5 8.8 10 10"
                stroke="#165A2E"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                d="M14 10C14.5 8.8 16.5 8.8 17 10"
                stroke="#165A2E"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path d="M8 13.5C8.8 16.8 15.2 16.8 16 13.5H8Z" fill="#165A2E" />
            </svg>
            <!-- White plus indicator mark underneath from prototype -->
            <div
              class="absolute -bottom-2 text-white/90 font-black text-xs leading-none"
            >
              +
            </div>
          </div>
        </button>
      </div>

      <!-- Feedback toast when mood selected -->
      <transition name="fade">
        <p
          v-if="moodFeedback"
          class="text-[11px] text-center text-purple-200 mt-2 font-medium"
        >
          {{ moodFeedback }}
        </p>
      </transition>
    </div>

    <!-- Quick Daily Affirmation Banner -->
    <div
      class="bg-[#F2EDFD] border border-purple-200/80 rounded-2xl p-3 mb-4 flex items-center space-x-2.5 shrink-0"
    >
      <span class="text-base shrink-0">🌿</span>
      <p class="text-[11px] text-[#483377] font-medium leading-snug">
        <b>Afirmasi Hari Ini:</b> "Satu napas dalam membawa ketenangan. Aku
        cukup dan mampu melewati hari ini."
      </p>
    </div>

    <!-- 4 Main Feature Cards (Grid 2x2) matching prototype -->
    <div class="grid grid-cols-2 gap-3 mb-3 shrink-0">
      <!-- 1. Mind Dump -->
      <button
        @click="$router.push('/mind-dump')"
        class="bg-[#F4EFFC] hover:bg-[#EAE1F8] border border-purple-200/70 rounded-3xl p-3.5 flex flex-col items-center justify-center space-y-1.5 transition-all active:scale-95 group shadow-xs"
      >
        <div
          class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#6D54B5] group-hover:scale-110 transition shadow-2xs"
        >
          <Edit3 :size="20" stroke-width="2.2" />
        </div>
        <div class="text-center">
          <span class="font-bold text-[#422C70] text-xs block">Mind Dump</span>
          <span class="text-[10px] text-purple-600/80 font-medium"
            >Lepaskan beban</span
          >
        </div>
      </button>

      <!-- 2. Reality Check -->
      <button
        @click="$router.push('/reality-check')"
        class="bg-[#F4EFFC] hover:bg-[#EAE1F8] border border-purple-200/70 rounded-3xl p-3.5 flex flex-col items-center justify-center space-y-1.5 transition-all active:scale-95 group shadow-xs"
      >
        <div
          class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#6D54B5] group-hover:scale-110 transition shadow-2xs"
        >
          <Scale :size="20" stroke-width="2.2" />
        </div>
        <div class="text-center">
          <span class="font-bold text-[#422C70] text-xs block"
            >Reality Check</span
          >
          <span class="text-[10px] text-purple-600/80 font-medium"
            >Fakta vs asumsi</span
          >
        </div>
      </button>

      <!-- 3. Calm Corner -->
      <button
        @click="$router.push('/calm-corner')"
        class="bg-[#F4EFFC] hover:bg-[#EAE1F8] border border-purple-200/70 rounded-3xl p-3.5 flex flex-col items-center justify-center space-y-1.5 transition-all active:scale-95 group shadow-xs"
      >
        <div
          class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#6D54B5] group-hover:scale-110 transition shadow-2xs"
        >
          <Flower2 :size="20" stroke-width="2.2" />
        </div>
        <div class="text-center">
          <span class="font-bold text-[#422C70] text-xs block"
            >Calm Corner</span
          >
          <span class="text-[10px] text-purple-600/80 font-medium"
            >Relaksasi & suara</span
          >
        </div>
      </button>

      <!-- 4. Mood Tracker -->
      <button
        @click="$router.push('/mood-tracker')"
        class="bg-[#F4EFFC] hover:bg-[#EAE1F8] border border-purple-200/70 rounded-3xl p-3.5 flex flex-col items-center justify-center space-y-1.5 transition-all active:scale-95 group shadow-xs"
      >
        <div
          class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#6D54B5] group-hover:scale-110 transition shadow-2xs"
        >
          <BarChart3 :size="20" stroke-width="2.2" />
        </div>
        <div class="text-center">
          <span class="font-bold text-[#422C70] text-xs block"
            >Mood Tracker</span
          >
          <span class="text-[10px] text-purple-600/80 font-medium"
            >Pantau harian</span
          >
        </div>
      </button>
    </div>

    <!-- 5. Bonus Feature Card: Catatan Rasa Syukur -->
    <button
      @click="$router.push('/gratitude')"
      class="w-full bg-gradient-to-r from-[#FFFBF0] to-[#FDF4DF] border border-amber-200/80 rounded-3xl p-3.5 flex items-center justify-between shadow-xs hover:border-amber-300 transition text-left shrink-0"
    >
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg"
        >
          💛
        </div>
        <div>
          <span class="text-xs font-bold text-amber-950 block"
            >Catatan Rasa Syukur</span
          >
          <span class="text-[10px] text-amber-800/80"
            >Tulis 3 hal baik yang kamu syukuri hari ini</span
          >
        </div>
      </div>
      <span class="text-xs text-amber-700 font-bold">Buka →</span>
    </button>

    <!-- Auth Modal -->
    <AuthModal
      :isOpen="showAuthModal"
      :canClose="true"
      @close="showAuthModal = false"
      @authenticated="onAuthenticated"
    />

    <!-- Notification Dialog Modal -->
    <div
      v-if="showNotice"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      @click.self="showNotice = false"
    >
      <div
        class="bg-white rounded-3xl p-5 max-w-xs w-full shadow-xl border border-purple-100 text-center space-y-3"
      >
        <div
          class="w-12 h-12 bg-purple-100 text-[#6D54B5] rounded-full mx-auto flex items-center justify-center"
        >
          <Bell :size="22" />
        </div>
        <h3 class="font-bold text-slate-800 text-base">
          Pengingat Mindfulness
        </h3>
        <p class="text-xs text-slate-500 leading-relaxed">
          Jangan lupa luangkan 2 menit hari ini untuk menarik napas dalam dan
          menenangkan pikiran. Anda melakukan yang terbaik!
        </p>
        <button
          @click="showNotice = false"
          class="w-full py-2.5 bg-[#7056B3] hover:bg-[#5E44A1] text-white rounded-2xl font-semibold text-xs transition"
        >
          Siap, terima kasih ♡
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Bell,
  Sparkles,
  Edit3,
  Scale,
  Flower2,
  BarChart3,
} from "lucide-vue-next";
import { MindEaseDB } from "../firebase";
import { useAuth } from "../auth";
import { calmAudio } from "../utils/soundEngine";
import AuthModal from "../components/AuthModal.vue";

const { user } = useAuth();

const selectedMood = ref(4);
const moodFeedback = ref("");
const showNotice = ref(false);
const showAuthModal = ref(false);

const moodTexts = [
  "Terima kasih telah jujur dengan perasaanmu. Bernapaslah sejenak ♡",
  "Hari yang berat ya? Kamu tidak sendirian di sini.",
  "Netral dan tenang. Luangkan waktu untuk dirimu sendiri.",
  "Senang melihatmu merasa cukup baik hari ini!",
  "Luar biasa! Pertahankan energi positif ini ya ♡",
];

const selectMood = async (idx) => {
  selectedMood.value = idx;
  moodFeedback.value = moodTexts[idx];
  await MindEaseDB.saveMood(idx);
  setTimeout(() => {
    moodFeedback.value = "";
  }, 3500);
};

const triggerCloudNudge = () => {
  moodFeedback.value = 'Awan tersenyum kepadamu: "Tarik napas dalam..."';
  setTimeout(() => {
    moodFeedback.value = "";
  }, 2500);
};

const onAuthenticated = () => {
  moodFeedback.value = `Selamat datang, ${user.value?.displayName || "Pengguna"}!`;
  setTimeout(() => {
    moodFeedback.value = "";
  }, 3000);
};

onMounted(() => {
  // Guarantee silence outside Calm Corner
  calmAudio.stopAllImmediate();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
