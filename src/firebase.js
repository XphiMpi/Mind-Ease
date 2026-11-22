// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

// Firebase configuration targeting emier-50769
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "emier-50769.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "emier-50769",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "emier-50769.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "127452588622",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export let app = null;
export let db = null;
let isFirebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseReady = true;
} catch (e) {
  console.warn("Firebase initialized with local offline fallback:", e.message);
}

// Get active user ID helper
const getActiveUid = () => {
  try {
    const raw = localStorage.getItem("mindease_active_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u && u.uid) return u.uid;
    }
  } catch (e) {}
  return "demo_user_01";
};

// Scoped LocalStorage helpers
const getScopedData = (collectionName) => {
  const uid = getActiveUid();
  try {
    const key = `mindease_${uid}_${collectionName}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const setScopedData = (collectionName, data) => {
  const uid = getActiveUid();
  try {
    const key = `mindease_${uid}_${collectionName}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Local storage error:", err);
  }
};

// Comprehensive User-Scoped Database Service
export const MindEaseDB = {
  // === 1. MIND DUMP (JURNAL PIKIRAN) ===
  async saveMindDump(content, category = "Overthinking", tags = ["Gelisah"]) {
    const uid = getActiveUid();
    const entry = {
      id: "dump_" + Date.now(),
      uid,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [tags],
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Save locally
    const existing = getScopedData("mind_dumps");
    existing.unshift(entry);
    setScopedData("mind_dumps", existing);

    // Try Firestore
    if (isFirebaseReady && db) {
      try {
        await addDoc(collection(db, "users", uid, "mind_dumps"), {
          ...entry,
          serverTime: serverTimestamp(),
        });
      } catch (err) {}
    }
    return entry;
  },

  async getMindDumps() {
    const local = getScopedData("mind_dumps");
    if (local.length > 0) return local;

    // Seed default if empty
    const uid = getActiveUid();
    const seed = [
      {
        id: "dump_sample_1",
        uid,
        content:
          "Aku takut gagal di presentasi besok di depan dosen dan rekan satu tim...",
        category: "Pekerjaan/Kuliah",
        tags: ["Cemas", "Presentasi"],
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: "dump_sample_2",
        uid,
        content:
          "Merasa semua orang menilai kekuranganku saat berbicara di ruang rapat.",
        category: "Sosial",
        tags: ["Overthinking", "Insecure"],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    setScopedData("mind_dumps", seed);
    return seed;
  },

  async deleteMindDump(id) {
    const existing = getScopedData("mind_dumps");
    const filtered = existing.filter((item) => item.id !== id);
    setScopedData("mind_dumps", filtered);
    return true;
  },

  // === 2. REALITY CHECK (CBT REFRAMING) ===
  async saveRealityCheck({
    thought,
    facts,
    assumptions,
    cognitiveDistortion,
    reframe,
  }) {
    const uid = getActiveUid();
    const entry = {
      id: "rc_" + Date.now(),
      uid,
      thought,
      facts: facts || [],
      assumptions: assumptions || [],
      cognitiveDistortion:
        cognitiveDistortion ||
        "Pikiran Semua-atau-Tidak Sama Sekali (All-or-Nothing)",
      reframe:
        reframe ||
        "Aku telah bersiap dengan baik dan kesalahan kecil adalah hal manusiawi.",
      note: "Fokus pada faktanya, bukan asumsi.",
      createdAt: new Date().toISOString(),
    };
    const existing = getScopedData("reality_checks");
    existing.unshift(entry);
    setScopedData("reality_checks", existing);

    if (isFirebaseReady && db) {
      try {
        await addDoc(collection(db, "users", uid, "reality_checks"), {
          ...entry,
          serverTime: serverTimestamp(),
        });
      } catch (e) {}
    }
    return entry;
  },

  async getRealityChecks() {
    const local = getScopedData("reality_checks");
    if (local.length > 0) return local;

    const uid = getActiveUid();
    const seed = [
      {
        id: "rc_default_1",
        uid,
        thought: "Aku pasti akan gagal presentasi...",
        facts: [
          "Aku sudah belajar materi",
          "Aku pernah berhasil presentasi sebelumnya",
        ],
        assumptions: ["Dosen pasti marah", "Teman-teman menilai buruk"],
        cognitiveDistortion: "Meramal Masa Depan (Fortune Telling)",
        reframe:
          "Walau aku gugup, aku sudah mempersiapkan diri dan pernah berhasil.",
        note: "Fokus pada faktanya, bukan asumsi.",
        createdAt: new Date().toISOString(),
      },
    ];
    setScopedData("reality_checks", seed);
    return seed;
  },

  async deleteRealityCheck(id) {
    const existing = getScopedData("reality_checks");
    const filtered = existing.filter((item) => item.id !== id);
    setScopedData("reality_checks", filtered);
    return true;
  },

  // === 3. MOOD TRACKER & ANALYTICS ===
  async saveMood(
    moodIndex,
    { emotionTags = [], triggers = [], note = "" } = {},
  ) {
    const uid = getActiveUid();
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const entry = {
      id: "mood_" + Date.now(),
      uid,
      moodIndex, // 0: Very Sad, 1: Sad, 2: Neutral, 3: Good, 4: Super Happy
      day: days[new Date().getDay()],
      date: new Date().toLocaleDateString("id-ID"),
      emotionTags,
      triggers,
      note,
      createdAt: new Date().toISOString(),
    };

    const existing = getScopedData("mood_logs");
    existing.unshift(entry);
    setScopedData("mood_logs", existing);

    // Update weekly array
    const weekly = getScopedData("weekly_mood");
    const defaultWeekly = weekly.length === 7 ? weekly : [1, 2, 2, 3, 2, 3, 4];
    const dayIdx = new Date().getDay();
    const adjustedIdx = dayIdx === 0 ? 6 : dayIdx - 1; // Mon (0) to Sun (6)
    defaultWeekly[adjustedIdx] = moodIndex;
    setScopedData("weekly_mood", defaultWeekly);

    if (isFirebaseReady && db) {
      try {
        await addDoc(collection(db, "users", uid, "mood_logs"), {
          ...entry,
          serverTime: serverTimestamp(),
        });
      } catch (e) {}
    }
    return entry;
  },

  getWeeklyMood() {
    const weekly = getScopedData("weekly_mood");
    return weekly.length === 7 ? weekly : [1, 2, 2, 3, 2, 3, 4];
  },

  getRecentMoodLogs() {
    return getScopedData("mood_logs");
  },

  // === 4. GRATITUDE JOURNAL (CATATAN SYUKUR) ===
  async saveGratitude({ items, reflection }) {
    const uid = getActiveUid();
    const entry = {
      id: "gratitude_" + Date.now(),
      uid,
      items: items || [],
      reflection: reflection || "",
      date: new Date().toLocaleDateString("id-ID"),
      createdAt: new Date().toISOString(),
    };

    const existing = getScopedData("gratitudes");
    existing.unshift(entry);
    setScopedData("gratitudes", existing);

    if (isFirebaseReady && db) {
      try {
        await addDoc(collection(db, "users", uid, "gratitudes"), {
          ...entry,
          serverTime: serverTimestamp(),
        });
      } catch (e) {}
    }
    return entry;
  },

  getGratitudes() {
    const local = getScopedData("gratitudes");
    if (local.length > 0) return local;

    const uid = getActiveUid();
    const seed = [
      {
        id: "gratitude_sample_1",
        uid,
        items: [
          "Secangkir teh hangat di pagi hari yang tenang",
          "Dukungan semangat dari sahabat dekat",
          "Menyelesaikan tugas penting tepat waktu",
        ],
        reflection: "Hari ini terasa damai saat aku melambat sejenak.",
        date: new Date().toLocaleDateString("id-ID"),
        createdAt: new Date().toISOString(),
      },
    ];
    setScopedData("gratitudes", seed);
    return seed;
  },

  // === 5. CALM SESSIONS & OVERALL STATS ===
  async logCalmSession({ mode, durationSeconds, cycles }) {
    const uid = getActiveUid();
    const session = {
      id: "calm_" + Date.now(),
      uid,
      mode,
      durationSeconds,
      cycles,
      createdAt: new Date().toISOString(),
    };

    const existing = getScopedData("calm_sessions");
    existing.unshift(session);
    setScopedData("calm_sessions", existing);
    return session;
  },

  getUserStats() {
    const dumps = getScopedData("mind_dumps");
    const reality = getScopedData("reality_checks");
    const moods = getScopedData("mood_logs");
    const calmSessions = getScopedData("calm_sessions");
    const gratitudes = getScopedData("gratitudes");

    const totalCalmSeconds = calmSessions.reduce(
      (acc, curr) => acc + (curr.durationSeconds || 0),
      0,
    );
    const meditationMinutes = Math.max(
      15,
      Math.round(totalCalmSeconds / 60) + 12,
    );

    return {
      totalDumps: dumps.length,
      totalRealityChecks: reality.length,
      totalMoodLogs: moods.length,
      totalGratitudes: gratitudes.length,
      meditationMinutes,
      streakDays: 5,
    };
  },
};
