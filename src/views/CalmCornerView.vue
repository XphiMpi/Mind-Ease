<template>
  <div
    class="flex-1 flex flex-col justify-between pt-3 pb-4 select-none bg-[#FAF8FE] relative overflow-hidden"
  >
    <!-- Top Header: Back Arrow + Title + Sound & Mode Toggle -->
    <div class="px-5 flex items-center justify-between py-2 z-20">
      <button
        @click="exitCalmCorner"
        class="w-9 h-9 rounded-full bg-[#EDE7F6] flex items-center justify-center text-[#553896] hover:bg-purple-200 transition"
      >
        <ChevronLeft :size="22" stroke-width="2.5" />
      </button>
      <h2 class="text-base font-bold text-[#3B2965] tracking-tight">
        Calm Corner
      </h2>

      <!-- Audio sound toggle button -->
      <button
        @click="showSoundSettings = !showSoundSettings"
        class="w-9 h-9 rounded-full bg-[#EDE7F6] flex items-center justify-center text-[#553896] hover:bg-purple-200 transition relative"
        :class="
          activeSound !== 'none' ? 'text-[#6D54B5] ring-2 ring-purple-300' : ''
        "
      >
        <Volume2 v-if="activeSound !== 'none'" :size="18" />
        <VolumeX v-else :size="18" />
      </button>
    </div>

    <!-- Mode Selector: Latihan Pernapasan vs Grounding 5-4-3-2-1 -->
    <div class="px-5 flex justify-center space-x-2 z-20">
      <button
        @click="mainMode = 'breath'"
        class="text-xs px-3.5 py-1 rounded-full font-bold transition-all"
        :class="
          mainMode === 'breath'
            ? 'bg-[#7056B3] text-white shadow-xs'
            : 'bg-purple-100/70 text-purple-700'
        "
      >
        🌬️ Latihan Napas
      </button>
      <button
        @click="mainMode = 'grounding'"
        class="text-xs px-3.5 py-1 rounded-full font-bold transition-all"
        :class="
          mainMode === 'grounding'
            ? 'bg-[#7056B3] text-white shadow-xs'
            : 'bg-purple-100/70 text-purple-700'
        "
      >
        🧘‍♂️ Grounding 5-4-3-2-1
      </button>
    </div>

    <!-- Sub-Technique Selector for Breath -->
    <div
      v-if="mainMode === 'breath'"
      class="px-5 flex justify-center space-x-1.5 z-20 mt-1.5"
    >
      <button
        v-for="mode in breathingModes"
        :key="mode.id"
        @click="changeMode(mode)"
        class="text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-all"
        :class="
          selectedMode.id === mode.id
            ? 'bg-purple-700 text-white shadow-2xs'
            : 'bg-purple-100/50 text-purple-700 hover:bg-purple-100'
        "
      >
        {{ mode.name }}
      </button>
    </div>

    <!-- Audio / Ambient Sound Selector Drawer -->
    <transition name="slide-down">
      <div
        v-if="showSoundSettings"
        class="mx-5 bg-white/95 backdrop-blur-md border border-purple-200 rounded-2xl p-3 shadow-lg z-30 mt-2 space-y-2.5"
      >
        <div
          class="flex justify-between items-center text-xs font-bold text-[#4B377E]"
        >
          <span>Suara Relaksasi (Procedural Web Audio):</span>
          <button
            @click="showSoundSettings = false"
            class="text-purple-400 hover:text-purple-600"
          >
            ✕
          </button>
        </div>

        <div class="grid grid-cols-4 gap-1.5">
          <button
            v-for="s in soundOptions"
            :key="s.id"
            @click="selectSound(s.id)"
            class="text-[10px] py-1.5 px-2 rounded-xl text-center font-medium border transition"
            :class="
              activeSound === s.id
                ? 'bg-[#7056B3] text-white border-purple-600'
                : 'bg-purple-50 text-purple-700 border-purple-100'
            "
          >
            {{ s.label }}
          </button>
        </div>

        <!-- Volume slider -->
        <div class="flex items-center space-x-2 pt-1 text-xs text-purple-700">
          <Volume1 :size="14" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            v-model.number="soundVolume"
            @input="updateVolume"
            class="w-full accent-[#7056B3] h-1.5 bg-purple-100 rounded-lg cursor-pointer"
          />
          <Volume2 :size="14" />
        </div>
      </div>
    </transition>

    <!-- CONTENT 1: GUIDED BREATHING -->
    <div
      v-if="mainMode === 'breath'"
      class="flex-1 flex flex-col items-center justify-center relative my-auto z-10 px-4"
    >
      <!-- Outer soft pulsing ripple rings -->
      <div
        class="absolute rounded-full pointer-events-none transition-all duration-1000 ease-in-out border border-purple-300/40"
        :style="{
          width: circleOuterSize + 'px',
          height: circleOuterSize + 'px',
          opacity: isPlaying ? 0.6 : 0.2,
        }"
      ></div>

      <!-- Main Animated Breath Circle -->
      <div
        class="rounded-full flex items-center justify-center transition-all ease-linear shadow-xl relative cursor-pointer"
        :style="circleStyle"
        @click="togglePlay"
      >
        <div
          class="absolute inset-2 rounded-full bg-gradient-to-tr from-[#9B7BDC]/20 to-white/60 pointer-events-none"
        ></div>

        <div class="text-center z-10">
          <span
            class="text-xl sm:text-2xl font-bold text-[#3B2965] tracking-tight block"
          >
            {{ currentPhaseText }}
          </span>
          <span
            v-if="isPlaying"
            class="text-xs font-semibold text-purple-600 block mt-1"
          >
            {{ remainingSeconds }}s
          </span>
        </div>
      </div>

      <!-- Instruction Below Circle -->
      <div class="mt-7 text-center min-h-[46px]">
        <p
          class="text-xs sm:text-sm font-semibold text-[#4F3980] transition-opacity duration-300"
        >
          {{ currentSubtext }}
        </p>
        <p class="text-[10px] text-purple-400 mt-1">
          Siklus {{ completedCycles + 1 }} • {{ sessionMinutes }} menit
          relaksasi
        </p>
      </div>
    </div>

    <!-- CONTENT 2: 5-4-3-2-1 GROUNDING TECHNIQUE -->
    <div
      v-else
      class="flex-1 flex flex-col justify-center px-6 z-10 my-auto space-y-3"
    >
      <div
        class="bg-white/95 rounded-3xl p-5 border border-purple-100 shadow-md text-center space-y-3"
      >
        <div
          class="w-12 h-12 bg-purple-100 text-[#7056B3] rounded-2xl mx-auto flex items-center justify-center text-xl font-bold"
        >
          {{ groundingStep.num }}
        </div>
        <h3 class="font-bold text-sm text-[#38285F]">
          {{ groundingStep.title }}
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ groundingStep.desc }}
        </p>

        <div
          class="pt-2 flex justify-between items-center border-t border-purple-50"
        >
          <button
            @click="prevGrounding"
            :disabled="groundingIndex === 0"
            class="text-xs text-purple-600 disabled:opacity-30 font-semibold"
          >
            ← Sebelumnya
          </button>
          <span class="text-[11px] text-purple-400 font-bold"
            >Langkah {{ groundingIndex + 1 }} dari 5</span
          >
          <button
            @click="nextGrounding"
            class="text-xs text-[#7056B3] font-bold"
          >
            {{ groundingIndex === 4 ? "Selesai ✓" : "Lanjut →" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Aesthetic Soft Purple Mountain Silhouettes -->
    <div class="w-full relative pointer-events-none -mb-3 select-none">
      <svg
        class="w-full h-32"
        viewBox="0 0 375 140"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="hillGrad1"
            x1="187"
            y1="20"
            x2="187"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#D9C7F3" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#CBB5EE" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient
            id="hillGrad2"
            x1="187"
            y1="50"
            x2="187"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#B79AE5" stop-opacity="0.75" />
            <stop offset="100%" stop-color="#9C79DC" stop-opacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M-20 140V75C40 60 90 90 150 70C210 50 280 85 395 60V140H-20Z"
          fill="url(#hillGrad1)"
        />
        <path
          d="M-20 140V95C50 80 120 115 190 90C260 65 320 100 395 85V140H-20Z"
          fill="url(#hillGrad2)"
        />
        <path
          d="M25 140C25 105 28 85 45 80C32 95 34 115 35 140"
          stroke="#7E57C2"
          stroke-width="3"
          stroke-linecap="round"
        />
        <ellipse cx="45" cy="80" rx="4" ry="7" fill="#7E57C2" />
        <path
          d="M350 140C348 110 342 90 325 85C338 100 340 120 342 140"
          stroke="#7E57C2"
          stroke-width="3"
          stroke-linecap="round"
        />
        <ellipse cx="325" cy="85" rx="4" ry="7" fill="#7E57C2" />
      </svg>
    </div>

    <!-- Media Controls at bottom: Play/Pause Button & Progress Bar -->
    <div class="px-6 pb-1 z-20 flex flex-col items-center">
      <button
        @click="togglePlay"
        class="w-13 h-13 rounded-full bg-[#7056B3] hover:bg-[#5E44A1] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-purple-900/20 transition-all z-20 -mt-6"
      >
        <Pause v-if="isPlaying" :size="22" stroke-width="2.8" />
        <Play
          v-else
          :size="22"
          class="ml-0.5"
          stroke-width="2.8"
          fill="white"
        />
      </button>

      <div
        class="w-full h-1.5 bg-purple-200/70 rounded-full mt-3 overflow-hidden"
      >
        <div
          class="h-full bg-[#7056B3] rounded-full transition-all duration-300"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import {
  ChevronLeft,
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
} from "lucide-vue-next";
import { calmAudio } from "../utils/soundEngine";
import { MindEaseDB } from "../firebase";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const router = useRouter();
const mainMode = ref("breath");

const breathingModes = [
  {
    id: "box",
    name: "Box (4-4-4-4)",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  { id: "478", name: "Deep (4-7-8)", inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  {
    id: "quick",
    name: "Quick (4-4)",
    inhale: 4,
    hold1: 0,
    exhale: 4,
    hold2: 0,
  },
];

const selectedMode = ref(breathingModes[0]);
const isPlaying = ref(true);
const currentPhase = ref("inhale");
const remainingSeconds = ref(4);
const completedCycles = ref(0);
const totalElapsedSeconds = ref(0);

const groundingIndex = ref(0);
const groundingSteps = [
  {
    num: "5",
    title: "5 Benda yang Kamu Lihat",
    desc: "Arahkan pandanganmu ke sekitar. Sebutkan 5 hal nyata yang bisa kamu lihat saat ini (misal: meja, dinding, cahaya lampu).",
  },
  {
    num: "4",
    title: "4 Benda yang Kamu Sentuh",
    desc: "Rasakan 4 sensasi fisik di sekelilingmu: kain bajumu, telapak kaki yang menempel di lantai, atau dinginnya udara.",
  },
  {
    num: "3",
    title: "3 Suara yang Kamu Dengar",
    desc: "Fokuskan telinga sejenak. Dengarkan 3 suara berbeda, baik yang dekat maupun suara dari kejauhan.",
  },
  {
    num: "2",
    title: "2 Aroma yang Kamu Cium",
    desc: "Tarik napas lembut melalui hidung. Sadari 2 aroma yang ada di ruangan atau udara sekitarmu.",
  },
  {
    num: "1",
    title: "1 Rasa yang Kamu Kecap",
    desc: "Rasakan 1 rasa di lidahmu saat ini, atau nikmati tegukan air putih yang segar. Sadari bahwa kamu aman di saat ini.",
  },
];

const groundingStep = computed(() => groundingSteps[groundingIndex.value]);

const nextGrounding = () => {
  if (groundingIndex.value < 4) {
    groundingIndex.value++;
  } else {
    groundingIndex.value = 0;
    mainMode.value = "breath";
  }
};

const prevGrounding = () => {
  if (groundingIndex.value > 0) {
    groundingIndex.value--;
  }
};

const showSoundSettings = ref(false);
const activeSound = ref("waves");
const soundVolume = ref(0.6);
const soundOptions = [
  { id: "none", label: "Bisu" },
  { id: "chime", label: "Lonceng" },
  { id: "rain", label: "Hujan" },
  { id: "waves", label: "Ombak" },
];

const currentPhaseText = computed(() => {
  switch (currentPhase.value) {
    case "inhale":
      return "Inhale...";
    case "hold1":
      return "Hold...";
    case "exhale":
      return "Exhale...";
    case "hold2":
      return "Rest...";
    default:
      return "Inhale...";
  }
});

const currentSubtext = computed(() => {
  switch (currentPhase.value) {
    case "inhale":
      return `Tarik napas pelan selama ${selectedMode.value.inhale} detik`;
    case "hold1":
      return `Tahan napas sejenak selama ${selectedMode.value.hold1} detik`;
    case "exhale":
      return `Hembuskan napas perlahan selama ${selectedMode.value.exhale} detik`;
    case "hold2":
      return `Tenangkan diri sejenak...`;
    default:
      return "Tarik napas pelan...";
  }
});

const circleOuterSize = computed(() => 210);

const circleStyle = computed(() => {
  let size = 175;
  let bg = "#EAE2F8";
  let border = "6px solid #D1BFEC";

  if (currentPhase.value === "inhale") {
    size = 170 + (selectedMode.value.inhale - remainingSeconds.value) * 12;
    bg = "#E5DBF6";
    border = "8px solid #9B7BDC";
  } else if (currentPhase.value === "hold1" || currentPhase.value === "hold2") {
    size = 215;
    bg = "#E3D7F5";
    border = "8px solid #825DC9";
  } else if (currentPhase.value === "exhale") {
    size = 215 - (selectedMode.value.exhale - remainingSeconds.value) * 12;
    bg = "#ECE5F9";
    border = "6px solid #B89EE5";
  }

  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: bg,
    border: border,
  };
});

const progressPercent = computed(() => {
  const targetSession = 180;
  return Math.min(100, (totalElapsedSeconds.value / targetSession) * 100);
});

const sessionMinutes = computed(() => {
  return (totalElapsedSeconds.value / 60).toFixed(1);
});

let timer = null;
let mountAudioTimer = null;
let isExited = false;

const triggerHaptic = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {}
};

const runCycleStep = () => {
  if (!isPlaying.value || isExited) return;

  totalElapsedSeconds.value++;
  remainingSeconds.value--;

  if (remainingSeconds.value <= 0) {
    triggerHaptic();
    if (activeSound.value === "chime" && !isExited) {
      calmAudio.playChime(260);
    }

    if (currentPhase.value === "inhale") {
      if (selectedMode.value.hold1 > 0) {
        currentPhase.value = "hold1";
        remainingSeconds.value = selectedMode.value.hold1;
      } else {
        currentPhase.value = "exhale";
        remainingSeconds.value = selectedMode.value.exhale;
      }
    } else if (currentPhase.value === "hold1") {
      currentPhase.value = "exhale";
      remainingSeconds.value = selectedMode.value.exhale;
    } else if (currentPhase.value === "exhale") {
      if (selectedMode.value.hold2 > 0) {
        currentPhase.value = "hold2";
        remainingSeconds.value = selectedMode.value.hold2;
      } else {
        completedCycles.value++;
        currentPhase.value = "inhale";
        remainingSeconds.value = selectedMode.value.inhale;
      }
    } else if (currentPhase.value === "hold2") {
      completedCycles.value++;
      currentPhase.value = "inhale";
      remainingSeconds.value = selectedMode.value.inhale;
    }
  }
};

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    if (activeSound.value === "rain" || activeSound.value === "waves") {
      calmAudio.startAmbient(activeSound.value);
    }
  } else {
    calmAudio.stopAllImmediate();
  }
};

const changeMode = (mode) => {
  selectedMode.value = mode;
  currentPhase.value = "inhale";
  remainingSeconds.value = mode.inhale;
};

const selectSound = (soundId) => {
  if (isExited) return;
  activeSound.value = soundId;
  calmAudio.init();
  calmAudio.setVolume(soundVolume.value);

  if (soundId === "rain" || soundId === "waves") {
    calmAudio.startAmbient(soundId);
  } else {
    calmAudio.stopAllImmediate();
    if (soundId === "chime") {
      calmAudio.playChime(320);
    }
  }
};

const updateVolume = () => {
  calmAudio.setVolume(soundVolume.value);
};

// Guaranteed Cleanup
const cleanupEverything = () => {
  isExited = true;
  if (mountAudioTimer) clearTimeout(mountAudioTimer);
  if (timer) clearInterval(timer);
  calmAudio.stopAllImmediate();
};

const exitCalmCorner = async () => {
  cleanupEverything();
  if (totalElapsedSeconds.value >= 10) {
    await MindEaseDB.logCalmSession({
      mode: selectedMode.value.name,
      durationSeconds: totalElapsedSeconds.value,
      cycles: completedCycles.value,
    });
  }
  router.push("/");
};

onBeforeRouteLeave((to, from, next) => {
  cleanupEverything();
  next();
});

onMounted(() => {
  isExited = false;
  remainingSeconds.value = selectedMode.value.inhale;
  timer = setInterval(runCycleStep, 1000);

  mountAudioTimer = setTimeout(() => {
    if (!isExited) {
      selectSound("waves");
    }
  }, 350);
});

onUnmounted(() => {
  cleanupEverything();
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
