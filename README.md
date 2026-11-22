# MindEase - Mobile Mind Relaxation App 🌸

Aplikasi mobile mindfulness & relaksasi pikiran lengkap berbasis **Vue 3**, **Capacitor**, **Tailwind CSS**, dan **Firebase** (Firestore, Firebase Auth, dan Firebase Hosting).

> 🌐 **Live Web URL (Firebase Hosting):**  
> **[https://mindease-relax.web.app](https://mindease-relax.web.app)**  
> _(Sesuai ketersediaan domain unik Firebase: `mindease-relax.web.app`)_

---

## ✨ Fitur Lengkap Aplikasi

### 1. 🔐 Sistem Autentikasi Pengguna & Database Scoped

- **Formulir Masuk (Login) & Daftar Akun (Register)** dengan validasi email dan proteksi kata sandi.
- **Penyimpanan Terisolasi Sesuai Akun**: Setiap pengguna yang login memiliki database masing-masing (`/users/{uid}/...` di Cloud Firestore). Catatan pengguna A tidak akan bercampur dengan pengguna B.
- **Mode Tamu (Guest Mode)**: Pengguna dapat langsung mencoba aplikasi tanpa harus menunggu verifikasi email.
- **Ganti Akun & Edit Profil**: Pengguna dapat mengubah nama tampilan, memilih emoji avatar, serta mencadangkan/mengekspor riwayat jurnal dalam format JSON.

---

### 2. 🏠 Beranda Personal (Home Dashboard)

- Sapaan hangat personal sesuai nama akun (_"Hi, [Nama]! Take a deep breath ♡"_).
- Avatar profil interaktif dengan indikator status login.
- **Awan Ungu Tersenyum Animatif**: Dilengkapi kerlip bintang dan sentuhan interaktif.
- **Kartu Suasana Hati Harian**: 5 ekspresi mood dengan highlight visual.
- **Afirmasi Harian**: Kutipan positif harian untuk menenangkan batin.
- **Navigasi Cepat 5 Fitur Utama**: Mind Dump, Reality Check, Calm Corner, Mood Tracker, dan Catatan Rasa Syukur.

---

### 3. ✏️ Mind Dump (Jurnal Mengurai Pikiran)

- Ruang luas untuk menuangkan seluruh beban pikiran tanpa batasan.
- **Pilihan Kategori**: _Overthinking_, _Pekerjaan/Kuliah_, _Hubungan_, _Kesehatan_, _Finansial_.
- Ilustrasi benang kusut (_Tangled Yarn_) interaktif yang melambangkan pikiran yang sedang diurai.
- Riwayat catatan pikiran tersimpan khusus untuk akun aktif dengan opsi hapus atau uji langsung di Reality Check.

---

### 4. ⚖️ Reality Check (CBT Cognitive Restructuring)

- Menguji pikiran otomatis (_thought bubble_) berdasarkan prinsip terapi kognitif (CBT).
- **Identifikasi Pola Pikir Negatif (Cognitive Distortions)**:
  - _Meramal Masa Depan Negatif (Fortune Telling)_
  - _Pikiran Semua-atau-Tidak Sama Sekali (All-or-Nothing)_
  - _Membaca Pikiran Orang Lain (Mind Reading)_
  - _Katastrofikasi (Membayangkan yang Terburuk)_
- **Papan Komparasi Dua Kolom**:
  - 🌿 **Fakta Nyata** (Pastel hijau mint dengan tanda centang): Tambah/hapus fakta obyektif.
  - 💜 **Asumsi & Ketakutan** (Pastel lavender dengan bullet radio): Tambah/hapus praduga yang belum terbukti.
- **Reframed Thought**: Menyusun kesimpulan pikiran baru yang lebih sehat dan realistis.

---

### 5. 🌸 Calm Corner (Pusat Relaksasi Khusus)

- **Latihan Pernapasan Terpandu**:
  - 🧘 **Box Breathing (4-4-4-4)**: Relaksasi anti-panik & fokus.
  - 🌙 **Deep Calm (4-7-8)**: Relaksasi tidur & menenangkan sistem saraf.
  - ⚡ **Quick Peace (4-4)**: Relaksasi kilat.
- **Sintesis Audio Ambient Alami (Procedural Web Audio API)**:
  - 🌧️ Suara Hujan (_Rain Pink-Noise_)
  - 🌊 Suara Deburan Ombak Laut (_Ocean Waves Swell_)
  - 🔔 Lonceng Meditasi Tibet (_Singing Bowl Tone_)
  - _100% bekerja secara lokal dan offline tanpa aset audio eksternal!_
- **Teknik Grounding 5-4-3-2-1**:
  - Panduan 5 indra untuk mengatasi kecemasan akut secara bertahap.
- **Getaran Haptik Mobile**:
  - Getaran halus di perangkat mobile via `@capacitor/haptics` saat transisi fase napas.
- **Pencatatan Waktu Meditasi**:
  - Menghitung menit meditasi yang otomatis diakumulasikan ke profil pengguna.

---

### 6. 📊 Mood Tracker & Analisis Mingguan

- Pilihan 5 ekspresi suasana hati dilengkapi detail nuansa perasaan (_Tenang, Bersyukur, Bersemangat, Cemas, Lelah, Gelisah_).
- **Grafik Garis Mingguan (_Mon - Sun_)**: Kurva bezier halus dengan titik indikator harian.
- **Kartu Motivasi**: ⭐ _"You're doing great! Keep going ♡"_.
- Riwayat suasana hati harian tersimpan rapi.

---

### 7. 💛 Catatan Rasa Syukur (Gratitude Journal)

- Latihan menuliskan 3 hal baik setiap hari untuk melatih fokus pada hal-hal positif.
- Kolom refleksi harian dan arsip catatan syukur sebelumnya.

---

### 8. 📈 Statistik & Profil Pengguna

- Pelacakan jumlah hari _streak_ beruntun (🔥).
- Total menit relaksasi di Calm Corner.
- Total catatan pikiran yang telah diurai dan distrukturisasi.
- Grafik persentase distribusi suasana hati.

---

## 🚀 Deployment & Akses

### Website Resmi (Firebase Hosting):

Aplikasi sudah ter-deploy dan aktif di:
👉 **[https://mindease-relax.web.app](https://mindease-relax.web.app)**

### Menjalankan di Lokal (Development):

```bash
npm run dev
```

### Menjalankan di Android (Capacitor):

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```
