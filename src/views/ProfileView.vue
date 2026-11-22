<template>
  <div
    class="flex-1 flex flex-col px-5 pt-3 pb-6 select-none bg-[#FAF8FE] overflow-y-auto"
  >
    <!-- Top Header -->
    <div
      class="py-2 border-b border-purple-100/60 pb-3 flex justify-between items-center"
    >
      <h2 class="text-base font-bold text-[#3B2965] tracking-tight">
        Profil & Akun
      </h2>
      <button
        v-if="user?.isGuest"
        @click="showAuthModal = true"
        class="text-xs text-[#7056B3] font-bold bg-[#EDE7F6] px-3 py-1 rounded-full hover:bg-purple-200 transition"
      >
        Masuk Akun
      </button>
      <button
        v-else
        @click="showAuthModal = true"
        class="text-xs text-[#7056B3] font-bold hover:underline"
      >
        Ganti Akun
      </button>
    </div>

    <!-- User Profile Card -->
    <div
      class="mt-4 bg-white rounded-3xl p-5 border border-purple-100 text-center shadow-xs relative"
    >
      <div class="relative inline-block">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9B7BDC] to-[#7056B3] mx-auto p-1 text-white flex items-center justify-center text-3xl font-bold shadow-md"
        >
          {{ user?.avatar || "🌱" }}
        </div>
        <!-- Quick avatar picker triggers -->
        <button
          @click="cycleAvatar"
          class="absolute -bottom-1 -right-1 bg-white border border-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow-xs"
          title="Ubah Emoji"
        >
          ✏️
        </button>
      </div>

      <h3 class="font-bold text-slate-800 text-base mt-2.5">
        {{ user?.isGuest ? "Tamu" : user?.displayName }}
      </h3>
      <p class="text-xs text-purple-600 font-medium">
        {{ user?.isGuest ? "Mode Penjelajah Tamu" : user?.email }}
      </p>

      <div class="mt-3 flex justify-center space-x-2">
        <span
          class="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
          :class="
            user?.isGuest
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          "
        >
          {{ user?.isGuest ? "Belum Masuk" : "Akun Terhubung" }}
        </span>
        <span
          class="text-[10px] bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full"
        >
          🔥 {{ user?.streak || 1 }} Hari Streak
        </span>
      </div>
    </div>

    <!-- CTA Card if still Guest -->
    <div
      v-if="user?.isGuest"
      class="mt-4 bg-gradient-to-r from-[#F6F1FD] to-[#EFE7FA] border border-purple-200/80 rounded-3xl p-4 shadow-xs"
    >
      <div class="flex items-start space-x-3">
        <div
          class="w-9 h-9 rounded-2xl bg-[#7056B3] text-white flex items-center justify-center text-base shrink-0 mt-0.5"
        >
          🔒
        </div>
        <div class="flex-1">
          <h4 class="text-xs font-bold text-[#3B2965]">Masuk atau Buat Akun</h4>
          <p class="text-[11px] text-purple-700/90 leading-snug mt-0.5">
            Simpan semua curahan hati di Mind Dump, hasil refleksi, dan grafik
            mood agar tersinkronisasi aman.
          </p>
          <button
            @click="showAuthModal = true"
            class="mt-2.5 px-4 py-2 bg-[#7056B3] hover:bg-[#5E44A1] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Masuk / Daftar Sekarang →
          </button>
        </div>
      </div>
    </div>

    <!-- Clean User-Facing Settings -->
    <div class="mt-4 space-y-2.5">
      <!-- 1. Daily Notification Setting -->
      <div
        class="bg-white rounded-2xl p-3.5 border border-purple-100/90 flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <span class="text-base">🔔</span>
          <div>
            <span class="text-xs font-bold text-slate-800 block"
              >Pengingat Relaksasi Harian</span
            >
            <span class="text-[10px] text-slate-500"
              >Notifikasi lembut di waktu tenang</span
            >
          </div>
        </div>
        <button
          @click="notificationsEnabled = !notificationsEnabled"
          class="w-10 h-5 rounded-full transition-colors relative p-0.5"
          :class="notificationsEnabled ? 'bg-[#7056B3]' : 'bg-slate-300'"
        >
          <div
            class="w-4 h-4 rounded-full bg-white transition-transform"
            :class="notificationsEnabled ? 'translate-x-5' : 'translate-x-0'"
          ></div>
        </button>
      </div>

      <!-- 2. Haptic Feedback Setting -->
      <div
        class="bg-white rounded-2xl p-3.5 border border-purple-100/90 flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <span class="text-base">📳</span>
          <div>
            <span class="text-xs font-bold text-slate-800 block"
              >Getaran Haptik Napas</span
            >
            <span class="text-[10px] text-slate-500"
              >Getar halus saat transisi napas di Calm Corner</span
            >
          </div>
        </div>
        <button
          @click="hapticsEnabled = !hapticsEnabled"
          class="w-10 h-5 rounded-full transition-colors relative p-0.5"
          :class="hapticsEnabled ? 'bg-[#7056B3]' : 'bg-slate-300'"
        >
          <div
            class="w-4 h-4 rounded-full bg-white transition-transform"
            :class="hapticsEnabled ? 'translate-x-5' : 'translate-x-0'"
          ></div>
        </button>
      </div>

      <!-- 3. Backup / Export Data -->
      <button
        @click="exportData"
        class="w-full bg-white hover:bg-purple-50 text-[#7056B3] border border-purple-200/90 rounded-2xl p-3 text-xs font-bold transition flex items-center justify-between"
      >
        <div class="flex items-center space-x-3 text-left">
          <span class="text-base">📥</span>
          <div>
            <span class="text-xs font-bold text-slate-800 block"
              >Cadangkan Data Refleksi</span
            >
            <span class="text-[10px] text-purple-500 font-normal"
              >Unduh riwayat jurnal dalam file JSON</span
            >
          </div>
        </div>
        <span class="text-xs font-bold text-[#7056B3]">Unduh</span>
      </button>

      <!-- 4. About App -->
      <div
        class="bg-white rounded-2xl p-3.5 border border-purple-100/90 flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <span class="text-base">🌸</span>
          <div>
            <span class="text-xs font-bold text-slate-800 block"
              >MindEase Version</span
            >
            <span class="text-[10px] text-slate-500"
              >v1.0.0 • Dibuat dengan penuh cinta ♡</span
            >
          </div>
        </div>
        <span
          class="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full"
          >Terbaru</span
        >
      </div>

      <!-- Logout / Keluar Button (Shown when logged in) -->
      <button
        v-if="!user?.isGuest"
        @click="handleLogout"
        class="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl p-3 text-xs font-bold transition flex items-center justify-center space-x-1.5 mt-2"
      >
        <span>🚪 Keluar dari Akun</span>
      </button>
    </div>

    <!-- Auth Modal -->
    <AuthModal
      :isOpen="showAuthModal"
      :canClose="true"
      @close="showAuthModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../auth";
import AuthModal from "../components/AuthModal.vue";

const router = useRouter();
const { user, logout, updateProfileData } = useAuth();
const showAuthModal = ref(false);

const notificationsEnabled = ref(true);
const hapticsEnabled = ref(true);

const avatars = ["🌱", "🌸", "☀️", "🌙", "💜", "🍃", "🌊"];
let avatarIdx = 0;

const cycleAvatar = () => {
  avatarIdx = (avatarIdx + 1) % avatars.length;
  updateProfileData({ avatar: avatars[avatarIdx] });
};

const exportData = () => {
  const uid = user.value?.uid || "guest";
  const keys = [
    "mind_dumps",
    "reality_checks",
    "mood_logs",
    "gratitudes",
    "calm_sessions",
  ];
  const exportObj = {
    user: user.value,
    exportedAt: new Date().toISOString(),
    data: {},
  };

  keys.forEach((k) => {
    try {
      const raw = localStorage.getItem(`mindease_${uid}_${k}`);
      exportObj.data[k] = raw ? JSON.parse(raw) : [];
    } catch (e) {}
  });

  const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mindease_backup_${uid}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const handleLogout = async () => {
  if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
    await logout();
  }
};
</script>
