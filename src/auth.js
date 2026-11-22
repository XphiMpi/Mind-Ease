// src/auth.js
import { reactive, computed } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { app } from "./firebase";

// Helper for consistent guest UID
const getOrCreateGuestId = () => {
  let gId = localStorage.getItem("mindease_guest_id");
  if (!gId) {
    gId = "guest_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("mindease_guest_id", gId);
  }
  return gId;
};

const createDefaultGuestUser = () => ({
  uid: getOrCreateGuestId(),
  displayName: "Tamu",
  email: "",
  avatar: "🌱",
  isGuest: true,
  streak: 1,
  joinedDate: new Date().toLocaleDateString("id-ID"),
});

const state = reactive({
  user: createDefaultGuestUser(),
  isAuthenticated: false,
  isLoading: true,
  error: null,
});

// Initialize from local cache
const cachedUser = localStorage.getItem("mindease_active_user");
if (cachedUser) {
  try {
    const parsed = JSON.parse(cachedUser);
    if (parsed && parsed.displayName && !parsed.isGuest) {
      state.user = parsed;
      state.isAuthenticated = true;
    } else {
      state.user = createDefaultGuestUser();
      state.isAuthenticated = false;
    }
  } catch (e) {
    state.user = createDefaultGuestUser();
    state.isAuthenticated = false;
  }
}
state.isLoading = false;

let firebaseAuth = null;
try {
  if (app) {
    firebaseAuth = getAuth(app);
    onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        state.user = {
          uid: firebaseUser.uid,
          displayName:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Pengguna",
          email: firebaseUser.email,
          avatar: "🌸",
          isGuest: false,
          streak: state.user?.streak || 1,
          joinedDate:
            state.user?.joinedDate || new Date().toLocaleDateString("id-ID"),
        };
        state.isAuthenticated = true;
        localStorage.setItem(
          "mindease_active_user",
          JSON.stringify(state.user),
        );
      }
      state.isLoading = false;
    });
  }
} catch (err) {
  console.warn("Firebase Auth using local store:", err);
}

export const useAuth = () => {
  const login = async (email, password) => {
    state.isLoading = true;
    state.error = null;

    try {
      if (!email || !password) {
        throw new Error("Harap masukkan email dan kata sandi.");
      }

      // Check Firebase Auth if available
      if (firebaseAuth) {
        try {
          const userCred = await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
          );
          state.user = {
            uid: userCred.user.uid,
            displayName: userCred.user.displayName || email.split("@")[0],
            email: userCred.user.email,
            avatar: "🌸",
            isGuest: false,
            streak: 1,
            joinedDate: new Date().toLocaleDateString("id-ID"),
          };
          state.isAuthenticated = true;
          localStorage.setItem(
            "mindease_active_user",
            JSON.stringify(state.user),
          );
          return { success: true };
        } catch (fbErr) {
          console.warn("Firebase auth login error:", fbErr.message);
        }
      }

      // Local accounts registry fallback
      const accounts = JSON.parse(
        localStorage.getItem("mindease_registered_users") || "[]",
      );
      const matched = accounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase(),
      );

      if (matched) {
        if (matched.password !== password) {
          throw new Error("Kata sandi salah. Silakan periksa kembali.");
        }
        state.user = {
          uid: matched.uid,
          displayName: matched.displayName,
          email: matched.email,
          avatar: matched.avatar || "🌸",
          isGuest: false,
          streak: matched.streak || 2,
          joinedDate: matched.joinedDate,
        };
        state.isAuthenticated = true;
        localStorage.setItem(
          "mindease_active_user",
          JSON.stringify(state.user),
        );
        return { success: true };
      } else {
        // Create user session directly
        state.user = {
          uid: "usr_" + Date.now(),
          displayName: email.split("@")[0],
          email: email,
          avatar: "🌸",
          isGuest: false,
          streak: 1,
          joinedDate: new Date().toLocaleDateString("id-ID"),
        };
        state.isAuthenticated = true;
        localStorage.setItem(
          "mindease_active_user",
          JSON.stringify(state.user),
        );
        return { success: true };
      }
    } catch (err) {
      state.error = err.message || "Gagal masuk akun";
      return { success: false, error: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  const register = async (displayName, email, password) => {
    state.isLoading = true;
    state.error = null;

    try {
      if (!displayName || !email || !password) {
        throw new Error("Harap lengkapi semua kolom formulir pendaftaran.");
      }
      if (password.length < 6) {
        throw new Error("Kata sandi minimal 6 karakter.");
      }

      const uid =
        "usr_" + Date.now() + Math.random().toString(36).substring(2, 6);
      const newUser = {
        uid,
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatar: "🌸",
        isGuest: false,
        streak: 1,
        joinedDate: new Date().toLocaleDateString("id-ID"),
      };

      if (firebaseAuth) {
        try {
          const userCred = await createUserWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
          );
          await updateProfile(userCred.user, {
            displayName: displayName.trim(),
          });
          newUser.uid = userCred.user.uid;
        } catch (e) {
          console.warn("Firebase create user offline fallback:", e.message);
        }
      }

      const accounts = JSON.parse(
        localStorage.getItem("mindease_registered_users") || "[]",
      );
      accounts.push(newUser);
      localStorage.setItem(
        "mindease_registered_users",
        JSON.stringify(accounts),
      );

      state.user = { ...newUser };
      delete state.user.password;
      state.isAuthenticated = true;
      localStorage.setItem("mindease_active_user", JSON.stringify(state.user));

      return { success: true };
    } catch (err) {
      state.error = err.message || "Pendaftaran gagal";
      return { success: false, error: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  const continueAsGuest = () => {
    state.user = createDefaultGuestUser();
    state.isAuthenticated = false;
    localStorage.removeItem("mindease_active_user");
    return { success: true };
  };

  const updateProfileData = (updates) => {
    if (!state.user) return;
    state.user = { ...state.user, ...updates };
    if (!state.user.isGuest) {
      localStorage.setItem("mindease_active_user", JSON.stringify(state.user));
    }
  };

  const logout = async () => {
    if (firebaseAuth) {
      try {
        await signOut(firebaseAuth);
      } catch (e) {}
    }
    state.user = createDefaultGuestUser();
    state.isAuthenticated = false;
    localStorage.removeItem("mindease_active_user");
  };

  return {
    user: computed(() => state.user),
    isAuthenticated: computed(() => state.isAuthenticated),
    isLoading: computed(() => state.isLoading),
    error: computed(() => state.error),
    login,
    register,
    continueAsGuest,
    updateProfileData,
    logout,
  };
};
