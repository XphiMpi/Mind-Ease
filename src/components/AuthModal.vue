<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
    @click.self="closeIfAllowed"
  >
    <div
      class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-100 flex flex-col relative overflow-hidden transition-all"
    >
      <!-- Top Decorative Accent -->
      <div
        class="absolute -top-12 -right-12 w-28 h-28 bg-[#7056B3]/10 rounded-full blur-md"
      ></div>

      <!-- Close Button (if user is already logged in and just opening switch modal) -->
      <button
        v-if="canClose"
        @click="$emit('close')"
        class="absolute top-4 right-4 text-purple-400 hover:text-purple-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-50 transition"
      >
        ✕
      </button>

      <!-- Logo & Welcome -->
      <div class="text-center mb-5">
        <!-- Purple Water Droplet Logo -->
        <div
          class="w-12 h-12 bg-[#EDE7F6] text-[#6D54B5] rounded-2xl mx-auto flex items-center justify-center shadow-xs mb-2"
        >
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient
                id="dropGradAuth"
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
              fill="url(#dropGradAuth)"
            />
            <path
              d="M9.5 13.5c0-2 1-3 2-4"
              stroke="white"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-opacity="0.85"
            />
          </svg>
        </div>
        <h2 class="text-xl font-extrabold text-[#38285F] tracking-tight">
          MindEase
        </h2>
        <p class="text-xs text-purple-600/80 mt-0.5">
          Satu aplikasi untuk menenangkan pikiranmu ♡
        </p>
      </div>

      <!-- Tab Toggle: Masuk vs Daftar -->
      <div class="flex bg-purple-100/60 p-1 rounded-2xl mb-4">
        <button
          @click="
            activeTab = 'login';
            errorMessage = '';
          "
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
          :class="
            activeTab === 'login'
              ? 'bg-[#7056B3] text-white shadow-xs'
              : 'text-purple-700 hover:text-purple-900'
          "
        >
          Masuk
        </button>
        <button
          @click="
            activeTab = 'register';
            errorMessage = '';
          "
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
          :class="
            activeTab === 'register'
              ? 'bg-[#7056B3] text-white shadow-xs'
              : 'text-purple-700 hover:text-purple-900'
          "
        >
          Daftar Baru
        </button>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2"
      >
        <span>⚠️</span>
        <span class="leading-tight">{{ errorMessage }}</span>
      </div>

      <!-- Form Inputs -->
      <form @submit.prevent="handleSubmit" class="space-y-3">
        <!-- Display Name (Register only) -->
        <div v-if="activeTab === 'register'">
          <label class="block text-[11px] font-bold text-purple-900 mb-1"
            >Nama Lengkap / Panggilan</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="e.g. Raditya"
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/40 text-xs text-slate-800 placeholder-purple-300 focus:outline-none focus:border-[#7056B3] focus:bg-white transition"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-[11px] font-bold text-purple-900 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/40 text-xs text-slate-800 placeholder-purple-300 focus:outline-none focus:border-[#7056B3] focus:bg-white transition"
          />
        </div>

        <!-- Password -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-[11px] font-bold text-purple-900"
              >Kata Sandi</label
            >
            <span
              v-if="activeTab === 'register'"
              class="text-[10px] text-purple-400"
              >Min. 6 karakter</span
            >
          </div>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              class="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-purple-200 bg-purple-50/40 text-xs text-slate-800 placeholder-purple-300 focus:outline-none focus:border-[#7056B3] focus:bg-white transition"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-purple-400 hover:text-purple-600 text-xs font-medium"
            >
              {{ showPassword ? "Sembunyi" : "Lihat" }}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full mt-2 py-3 bg-[#7056B3] hover:bg-[#5E44A1] active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-900/15 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span v-if="!isSubmitting">{{
            activeTab === "login" ? "Masuk ke Akun" : "Buat Akun Sekarang"
          }}</span>
          <span v-else class="flex items-center space-x-2">
            <span
              class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            <span>Memproses...</span>
          </span>
        </button>
      </form>

      <!-- Guest / Demo Mode Quick Access -->
      <div class="mt-4 pt-3 border-t border-purple-100 text-center">
        <button
          type="button"
          @click="handleGuest"
          class="text-xs text-purple-600 font-semibold hover:text-[#5E44A1] transition"
        >
          🌱 Lanjutkan sebagai Tamu (Guest Mode)
        </button>
        <p class="text-[10px] text-purple-400 mt-1">
          Data tersimpan aman di akun lokal Anda dan dapat dihubungkan ke
          Firebase kapan saja.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../auth";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  canClose: { type: Boolean, default: true },
});

const emit = defineEmits(["close", "authenticated"]);

const { login, register, continueAsGuest } = useAuth();

const activeTab = ref("login");
const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

const closeIfAllowed = () => {
  if (props.canClose) {
    emit("close");
  }
};

const handleSubmit = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    let res;
    if (activeTab.value === "login") {
      res = await login(email.value, password.value);
    } else {
      res = await register(name.value, email.value, password.value);
    }

    if (res.success) {
      emit("authenticated");
      emit("close");
    } else {
      errorMessage.value = res.error || "Terjadi kesalahan, periksa data Anda.";
    }
  } catch (e) {
    errorMessage.value = e.message;
  } finally {
    isSubmitting.value = false;
  }
};

const handleGuest = () => {
  continueAsGuest("Radit");
  emit("authenticated");
  emit("close");
};
</script>
