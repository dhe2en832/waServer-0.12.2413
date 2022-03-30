# WACSA

## Deskripsi
WACSA-MD merupakan aplikasi yang dapat digunakan untuk mengirim pesan via API yang terhubung dengan Whatsapp Web, terdapat juga callback untuk webhook status pesan terkirim dan informasi statistik. WACSA versi Multi Device bisa tetap digunakan walaupun Whatsapp di HP tidak terhubung ke internet.

## Struktur
* dist, folder hasil build kode proyek
* environment, folder aset tambahan untuk mode produksi
* node_modules, folder library kode proyek
* session, folder penyimpanan session WACSA-MD
* src, folder utama seluruh sumber kode WACSA-MD
  * images, folder aset gambar
  * main, folder kode untuk sisi backend
  * renderer, folder kode untuk sisi frontend
  * scripts, folder kode lainnya 
  * styles, folder kode untuk style
  * utils, folder kode untuk utilitas
* backup_wacsa.ini, file cadangan untuk konfigurasi wacsa.
* installer.nsh, file konfigurasi untuk mengatur kebutuhan saat membuat installer.
* package.json, file utama untuk mengatur versi, dependensi, command.
* wacsa.ini, file konfigurasi yang digunakan WACSA saat berjalan.
* yarn.lock, file kunci untuk menetapkan dependensi yang digunakan.

## Fitur
* Halaman Login
* Halaman Scan QR Code
* Halaman Statistik
* API Kirim Pesan Teks
* API Kirim Pesan Media
* API Log Statistik, Kirim Pesan dan Terima Pesan
* Webhook Status Kirim Pesan
* Multi Device Beta Support

## Log
11/03/2022 - v0.9.3.rc.17
* Fitur: Tambah sistem penyimpanan untuk Multi Device.
* Fitur: Tambah informasi versi, waktu loading dan memperbaiki layout space.
* Fitur: Tambah UI baru untuk loading indikator.
* Perbaiki: import dan bug penyimpanan statistik.
* Sistem: Update library ke wawebjs versi 1.16.4.

## Masalah
28/03/2022 - v0.9.3.rc.17
* Session tidak bisa bekerja dengan baik dengan mode headless = true.
* Login selalu gagal dengan informasi "Tidak ada koneksi internet, silahkan coba lagi" saat scan QR Code dengan mode headless = true.
* WACSA-MD berjalan baik dengan headless = false, namun akan menampilkan browser layaknya menggunakan Whatsapp Web  
sehingga chat OTP atau history pesan akan tampil ke user.
