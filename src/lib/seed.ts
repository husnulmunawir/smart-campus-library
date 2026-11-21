import type { Buku, LibraryData, Mahasiswa, Peminjaman, Petugas } from '../types'
import { addDaysISO, todayISO } from './date'

const buku = (
  id: string,
  kodeBuku: string,
  judul: string,
  penulis: string,
  penerbit: string,
  tahunTerbit: number,
  kategori: string,
  deskripsi: string,
  status: Buku['status'] = 'Tersedia',
): Buku => ({
  id,
  kodeBuku,
  judul,
  penulis,
  penerbit,
  tahunTerbit,
  kategori,
  deskripsi,
  cover: `/covers/${id}.svg`,
  status,
})

export function createSeedData(nowISO: string = todayISO()): LibraryData {
  const year = nowISO.slice(0, 4)
  const d = (offset: number) => addDaysISO(nowISO, offset)

  const mahasiswa: Mahasiswa[] = [
    {
      id: 'mhs-001',
      npm: '011250040',
      nama: 'Alya Putri Ramadhani',
      status: 'Aktif',
      programStudi: 'Informatika',
      angkatan: '2022',
    },
    {
      id: 'mhs-002',
      npm: '011250041',
      nama: 'Bima Saputra',
      status: 'Aktif',
      programStudi: 'Informatika',
      angkatan: '2023',
    },
    {
      id: 'mhs-003',
      npm: '011250042',
      nama: 'Sinta Wulandari',
      status: 'Aktif',
      programStudi: 'Sistem Informasi',
      angkatan: '2022',
    },
    {
      id: 'mhs-004',
      npm: '011250099',
      nama: 'Raka Pratama',
      status: 'Tidak Aktif',
      programStudi: 'Informatika',
      angkatan: '2021',
    },
  ]

  const petugas: Petugas[] = [
    {
      id: 'ptg-001',
      username: 'PETUGAS001',
      nama: 'Rangga Mahendra',
      jabatan: 'Petugas Perpustakaan',
    },
    {
      id: 'ptg-002',
      username: 'PETUGAS002',
      nama: 'Dewi Anggraini',
      jabatan: 'Petugas Perpustakaan',
    },
  ]

  const bukuList: Buku[] = [
    buku('bku-001', 'BKU-001', 'Sistem Operasi Modern', 'Andrew S. Tanenbaum', 'Prentice Hall', 2022, 'Teknologi Informasi', 'Konsep inti sistem operasi: proses, penjadwalan, memori, sistem berkas, dan keamanan, disajikan dengan pendekatan praktis.'),
    buku('bku-002', 'BKU-002', 'Struktur Data dan Algoritma', 'Robert L. Lafore', 'Pearson', 2021, 'Pemrograman', 'Panduan membangun struktur data dasar hingga lanjutan beserta analisis kompleksitas dan contoh implementasi.'),
    buku('bku-003', 'BKU-003', 'Rekayasa Perangkat Lunak', 'Ian Sommerville', 'Pearson', 2020, 'Rekayasa Perangkat Lunak', 'Membahas proses rekayasa perangkat lunak, kebutuhan, perancangan arsitektur, pengujian, dan pemeliharaan sistem.', 'Dipinjam'),
    buku('bku-004', 'BKU-004', 'Sistem Basis Data Relasional', 'C. J. Date', 'Addison-Wesley', 2019, 'Basis Data', 'Referensi mendalam mengenai model relasional, normalisasi, SQL, integritas data, dan perancangan basis data.'),
    buku('bku-005', 'BKU-005', 'Analisis dan Perancangan Sistem', 'John W. Satzinger', 'Cengage Learning', 2021, 'Sistem Informasi', 'Teknik elisitasi kebutuhan, pemodelan proses, model data, serta perancangan antarmuka untuk sistem informasi.', 'Dipinjam'),
    buku('bku-006', 'BKU-006', 'Jaringan Komputer', 'James F. Kurose', 'Pearson', 2023, 'Jaringan', 'Mempelajari arsitektur jaringan, protokol TCP/IP, lapisan aplikasi, transport, jaringan, dan keamanan dasar.', 'Dipinjam'),
    buku('bku-007', 'BKU-007', 'Manajemen Proyek Perangkat Lunak', 'Pankaj Jalote', 'Springer', 2018, 'Manajemen', 'Metode perencanaan, penjadwalan, estimasi biaya, manajemen risiko, dan pengendalian kualitas proyek perangkat lunak.'),
    buku('bku-008', 'BKU-008', 'Pemrograman Web Modern', 'David Flanagan', "O'Reilly Media", 2022, 'Pemrograman', 'Panduan JavaScript modern, DOM, asynchronous programming, dan praktik pengembangan antarmuka web interaktif.'),
    buku('bku-009', 'BKU-009', 'Statistik untuk Penelitian', 'Jonathan Sarwono', 'UPP STIM YKPN', 2020, 'Statistik', 'Pengantar statistik deskriptif dan inferensia untuk penelitian, lengkap dengan contoh perhitungan dan interpretasi.', 'Dipinjam'),
    buku('bku-010', 'BKU-010', 'Metodologi Penelitian Kuantitatif', 'Sugiyono', 'Alfabeta', 2021, 'Penelitian', 'Panduan menyusun proposal penelitian, variabel, instrumen pengumpulan data, pengujian hipotesis, dan pelaporan.'),
    buku('bku-011', 'BKU-011', 'Desain Interaksi Manusia dan Komputer', 'Ben Shneiderman', 'Pearson', 2022, 'Desain', 'Prinsip desain antarmuka berpusat pada pengguna, usability, aksesibilitas, dan evaluasi pengalaman pengguna.'),
    buku('bku-012', 'BKU-012', 'Keamanan Informasi', 'William Stallings', 'Pearson', 2021, 'Keamanan', 'Konsep kriptografi, kontrol akses, keamanan jaringan, manajemen identitas, dan tata kelola keamanan informasi.', 'Dipinjam'),
    buku('bku-013', 'BKU-013', 'Kecerdasan Buatan', 'Stuart J. Russell', 'Pearson', 2023, 'Kecerdasan Buatan', 'Pengantar agen cerdas, pencarian, penalaran, pembelajaran mesin, dan pertimbangan etis dalam sistem cerdas.'),
    buku('bku-014', 'BKU-014', 'Ekonomi Mikro', 'Paul A. Samuelson', 'McGraw-Hill', 2019, 'Ekonomi', 'Konsep dasar permintaan, penawaran, elastisitas, biaya produksi, struktur pasar, dan keseimbangan pasar.'),
  ]

  const loan = (
    no: number,
    npm: string,
    kodeBuku: string,
    pinjamOffset: number,
    kembaliOffset: number,
    pengembalianOffset: number | null,
  ): Peminjaman => ({
    id: `pinj-${String(no).padStart(3, '0')}`,
    nomorPinjaman: `PINJ-${year}-${String(no).padStart(4, '0')}`,
    npm,
    kodeBuku,
    tanggalPinjam: d(pinjamOffset),
    tanggalKembali: d(kembaliOffset),
    tanggalPengembalian: pengembalianOffset === null ? null : d(pengembalianOffset),
    status: pengembalianOffset === null ? 'Dipinjam' : 'Dikembalikan',
  })

  const peminjaman: Peminjaman[] = [
    loan(1, '011250040', 'BKU-003', -2, 5, null),
    loan(2, '011250040', 'BKU-009', -12, -5, null),
    loan(3, '011250041', 'BKU-006', -1, 6, null),
    loan(4, '011250042', 'BKU-005', -3, 4, null),
    loan(5, '011250042', 'BKU-012', -3, 4, null),
    loan(6, '011250040', 'BKU-010', -20, -13, -15),
    loan(7, '011250041', 'BKU-002', -10, -3, -4),
    loan(8, '011250042', 'BKU-011', -8, -1, -2),
  ]

  return { mahasiswa, petugas, buku: bukuList, peminjaman }
}

/** Kredensial prototype disimpan terpisah dari entitas data. */
export interface DemoCredential {
  role: 'mahasiswa' | 'petugas'
  password: string
}

export const DEMO_CREDENTIALS: Record<string, DemoCredential> = {
  '011250040': { role: 'mahasiswa', password: 'mahasiswa123' },
  '011250041': { role: 'mahasiswa', password: 'mahasiswa123' },
  '011250042': { role: 'mahasiswa', password: 'mahasiswa123' },
  '011250099': { role: 'mahasiswa', password: 'mahasiswa123' },
  PETUGAS001: { role: 'petugas', password: 'petugas123' },
  PETUGAS002: { role: 'petugas', password: 'petugas123' },
}
