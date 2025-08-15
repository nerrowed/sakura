# Panduan Pengguna Aplikasi SakuraGo

Selamat datang di SakuraGo, sistem digitalisasi penjemputan sampah yang dirancang untuk memudahkan pengelolaan sampah dan memberikan nilai lebih bagi nasabah.

Dokumen ini akan memandu Anda dalam menggunakan aplikasi sesuai dengan peran Anda: **Nasabah**, **Petugas**, dan **Admin**.

---

## Daftar Isi
1.  [Panduan untuk Nasabah](#1-panduan-untuk-nasabah)
    -   [Pendaftaran dan Login](#pendaftaran-dan-login)
    -   [Beranda Nasabah](#beranda-nasabah)
    -   [Mengajukan Penjemputan](#mengajukan-penjemputan)
    -   [Melihat Riwayat Penjemputan](#melihat-riwayat-penjemputan)
    -   [Melihat Profil](#melihat-profil)
2.  [Panduan untuk Petugas](#2-panduan-untuk-petugas)
    -   [Login Petugas](#login-petugas)
    -   [Daftar Tugas Penjemputan](#daftar-tugas-penjemputan)
    -   [Input Hasil Penjemputan](#input-hasil-penjemputan)
    -   [Melihat Riwayat Tugas](#melihat-riwayat-tugas)
3.  [Panduan untuk Admin](#3-panduan-untuk-admin)
    -   [Login Admin](#login-admin)
    -   [Dashboard Statistik](#dashboard-statistik)
    -   [Manajemen Pengguna](#manajemen-pengguna)
    -   [Monitoring Penjemputan](#monitoring-penjemputan)

---

## 1. Panduan untuk Nasabah

Sebagai nasabah, Anda dapat mengajukan permintaan penjemputan sampah dan melacak tabungan poin Anda.

### Pendaftaran dan Login
1.  Buka halaman utama aplikasi.
2.  Pilih tab **"Daftar"**.
3.  Masukkan alamat email dan password yang Anda inginkan (minimal 6 karakter).
4.  Klik tombol **"Daftar Akun Baru"**. Setelah berhasil, Anda akan otomatis masuk dan diarahkan ke beranda nasabah.
5.  Untuk masuk kembali di lain waktu, pilih tab **"Masuk"** dan gunakan email serta password yang telah Anda daftarkan.

### Beranda Nasabah
Setelah login, Anda akan melihat ringkasan aktivitas Anda:
-   **Total Poin Tabungan**: Jumlah poin yang telah Anda kumpulkan dari penyetoran sampah.
-   **Jadwal Penjemputan Berikutnya**: Menampilkan tanggal penjemputan yang akan datang jika ada.
-   **Riwayat Transaksi Terbaru**: Menampilkan 3 transaksi terakhir Anda.

### Mengajukan Penjemputan
1.  Dari Beranda, klik tombol **"Ajukan Penjemputan"** atau navigasi ke menu **"Ajukan Penjemputan"**.
2.  Isi formulir dengan lengkap:
    -   **Jenis Sampah**: Pilih kategori sampah yang akan dijemput.
    -   **Tanggal & Waktu Penjemputan**: Tentukan jadwal yang Anda inginkan.
    -   **Lokasi**: Masukkan alamat lengkap lokasi penjemputan.
3.  Klik tombol **"Kirim"**. Permintaan Anda akan diteruskan ke petugas.

### Melihat Riwayat Penjemputan
1.  Buka menu **"Riwayat Penjemputan"**.
2.  Di halaman ini, Anda akan melihat daftar lengkap semua transaksi penjemputan yang pernah Anda ajukan, beserta detail tanggal, jenis sampah, berat (jika sudah diinput petugas), poin yang didapat, dan status terakhir (`Diajukan`, `Diproses`, `Selesai`).

### Melihat Profil
1.  Buka menu **"Profil"**.
2.  Anda dapat melihat detail akun Anda, seperti email dan peran Anda sebagai nasabah.

---

## 2. Panduan untuk Petugas

Sebagai petugas, tugas utama Anda adalah mengelola dan mengeksekusi permintaan penjemputan dari nasabah.

### Login Petugas
-   Akun petugas dibuat oleh Admin. Gunakan email dan password yang diberikan oleh Admin untuk masuk ke sistem.

### Daftar Tugas Penjemputan
1.  Setelah login, Anda akan langsung diarahkan ke halaman **"Tugas Penjemputan"**.
2.  Halaman ini menampilkan daftar semua permintaan penjemputan yang masih berstatus **"Diajukan"** atau **"Diproses"**, diurutkan berdasarkan tanggal.
3.  Setiap kartu tugas berisi informasi nasabah, lokasi, dan jadwal penjemputan.

### Input Hasil Penjemputan
1.  Setelah Anda melakukan penjemputan di lokasi nasabah, buka tugas yang sesuai di aplikasi.
2.  Klik tombol **"Input Hasil"**.
3.  Sebuah dialog akan muncul. Masukkan **berat sampah** dalam satuan kilogram (kg).
4.  Klik **"Simpan"**. Sistem akan secara otomatis:
    -   Mengubah status penjemputan menjadi **"Selesai"**.
    -   Menghitung poin untuk nasabah (1 kg = 1000 poin).
    -   Menyimpan data berat dan poin ke dalam riwayat transaksi.

### Melihat Riwayat Tugas
1.  Buka menu **"Riwayat Tugas"**.
2.  Halaman ini berisi daftar semua tugas penjemputan yang telah Anda selesaikan, lengkap dengan detail nasabah, tanggal, berat, dan poin yang diberikan.

---

## 3. Panduan untuk Admin

Sebagai admin, Anda memiliki akses penuh untuk memantau seluruh aktivitas sistem, mengelola pengguna, dan melihat data statistik.

### Login Admin
-   Akun admin adalah akun dengan hak akses tertinggi. Gunakan email dan password yang telah ditentukan untuk masuk.

### Dashboard Statistik
1.  Halaman utama admin adalah **"Statistik"**.
2.  Di sini Anda dapat melihat ringkasan data penting dalam rentang waktu tertentu:
    -   **Filter Data**: Pilih rentang tanggal dan klik **"Terapkan Filter"** untuk melihat data pada periode tersebut.
    -   **Kartu Statistik**: Menampilkan total sampah terkumpul, jumlah transaksi, total tabungan nasabah, dan jumlah pengguna aktif.
    -   **Grafik Volume Sampah**: Visualisasi data volume sampah harian dalam rentang tanggal yang dipilih.

### Manajemen Pengguna
1.  Buka menu **"Pengguna"**.
2.  Halaman ini menampilkan daftar semua pengguna yang terdaftar di sistem (admin, petugas, nasabah).
3.  Anda dapat menggunakan **kolom pencarian** untuk menemukan pengguna spesifik berdasarkan alamat email mereka.

### Monitoring Penjemputan
1.  Buka menu **"Monitoring Penjemputan"**.
2.  Halaman ini menampilkan seluruh riwayat transaksi penjemputan dari semua nasabah.
3.  Anda dapat memantau status setiap transaksi dan melihat detailnya, seperti nasabah, tanggal, berat, poin, dan status.

.
