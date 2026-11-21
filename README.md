# Smart Campus Library

Prototype aplikasi peminjaman dan pengembalian buku perpustakaan kampus untuk UAS Rekayasa Perangkat Lunak.
Dibangun dengan React + TypeScript + Vite + Tailwind CSS + Lucide React. Seluruh data disimpan di `localStorage`.

**Demo online:** https://smart-campus-library-psi.vercel.app

Repo GitHub sudah terhubung ke proyek Vercel, sehingga setiap push ke `main` otomatis di-deploy.
Konfigurasi SPA (`vercel.json`) meneruskan semua rute ke `index.html` agar refresh pada halaman seperti
`/katalog` tidak 404.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Perintah lain:

```bash
npm run build   # type-check + build produksi
npm test        # pengujian aturan bisnis U1–U4 dan kasus tambahan
```

## Akun demo

Klik kartu akun pada halaman login untuk mengisi otomatis.

| Role | ID / NPM | Password | Nama |
| --- | --- | --- | --- |
| Mahasiswa | `011250040` | `mahasiswa123` | Alya Putri Ramadhani |
| Petugas | `PETUGAS001` | `petugas123` | Rangga Mahendra |

Data tambahan untuk simulasi (password mahasiswa sama): `011250041` Bima Saputra (1 pinjaman aktif),
`011250042` Sinta Wulandari (2 pinjaman aktif), `011250099` Raka Pratama (status **Tidak Aktif**).
`PETUGAS002` juga dapat digunakan dengan password `petugas123`.

Untuk mengulang demonstrasi dari awal: **Profil → Reset Data Demo**.

## Alur utama

- **Mahasiswa:** login, dashboard, katalog (cari judul/penulis, filter kategori & status, grid/list), detail buku,
  pinjaman saya (detail transaksi), profil, logout. Mahasiswa tidak dapat mencatat transaksi atau melihat pinjaman mahasiswa lain.
- **Petugas:** dashboard operasional, katalog, catat peminjaman, catat pengembalian dengan dialog konfirmasi,
  pinjaman aktif, profil, logout.

Aturan bisnis diverifikasi pada data transaksi: mahasiswa harus aktif, maksimal 3 pinjaman aktif, buku harus
Tersedia, satu transaksi untuk satu buku, tanggal kembali = 7 hari kalender setelah tanggal pinjam, dan status
buku/transaksi selalu sinkron. Tidak ada peminjaman atau pengembalian ganda.

## Status Terlambat (Change Request CR-01)

Status `Dipinjam`, `Terlambat`, dan `Dikembalikan` dihitung otomatis dari tanggal kembali dan status transaksi.
Tanggal kembali tidak pernah diubah otomatis. Badan badge **Terlambat** diberi penanda **CR-01** dan catatan
"simulasi usulan, menunggu persetujuan" pada dashboard, daftar pinjaman, dan sidebar. Tidak ada fitur denda.

## Skenario pengujian wajib

Reset data terlebih dahulu agar kondisi awal sesuai.

| Skenario | Langkah | Hasil yang diharapkan |
| --- | --- | --- |
| U1 | Petugas → Catat Peminjaman → NPM `011250041`, kode `BKU-001` → Proses | Berhasil, nomor `PINJ-2026-0009`, tanggal kembali 7 hari setelah pinjam, `BKU-001` menjadi Dipinjam |
| U2 | NPM `011250042`, kode `BKU-003` (sedang dipinjam) → Proses | Ditolak: "buku sedang dipinjam"; tidak ada transaksi baru; status buku tidak berubah |
| U3 | NPM `011250040` (2 pinjaman aktif), kode `BKU-004` → Proses | Pinjaman ketiga diterima; kuota habis tepat di 3; pinjaman keempat ditolak |
| U4 | Login sebagai `011250040` → Pinjaman Saya | `PINJ-2026-0002` (`BKU-009`) berstatus **Terlambat CR-01** karena tanggal kembali sudah lewat |

Nomor transaksi pada U1–U3 menggunakan tahun berjalan dan dapat berbeda jika pengujian dijalankan pada tahun lain.
Data seed dibuat relatif terhadap tanggal hari ini sehingga skenario U4 tetap terlambat kapan pun dijalankan.

Pengujian otomatis: `npm test` — 8 test lolos (U1, U2, U3, U4, mahasiswa tidak aktif, pengembalian ganda,
sinkronisasi buku/kuota, kode buku tidak ditemukan).

## Keterbatasan prototype

- Tanpa backend: data dan sesi hanya tersimpan di browser (`localStorage`), bukan database server.
- Kredensial demo disimpan di kode sumber; ini bukan sistem autentikasi produksi.
- Satu kode buku mewakili satu eksemplar fisik; tidak ada multi-copy.
- Sesuai batasan kebutuhan: tidak ada denda, pembayaran, perpanjangan, reservasi, e-book, atau marketplace.
- CR-01 adalah simulasi change request yang masih berstatus usulan dalam dokumen UAS.
