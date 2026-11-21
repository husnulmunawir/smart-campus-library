export type Role = 'mahasiswa' | 'petugas'

export interface Mahasiswa {
  id: string
  npm: string
  nama: string
  status: 'Aktif' | 'Tidak Aktif'
  programStudi: string
  angkatan: string
}

export interface Petugas {
  id: string
  username: string
  nama: string
  jabatan: string
}

export interface Buku {
  id: string
  kodeBuku: string
  judul: string
  penulis: string
  penerbit: string
  tahunTerbit: number
  kategori: string
  deskripsi: string
  cover: string
  status: 'Tersedia' | 'Dipinjam'
}

export interface Peminjaman {
  id: string
  nomorPinjaman: string
  npm: string
  kodeBuku: string
  tanggalPinjam: string
  tanggalKembali: string
  tanggalPengembalian: string | null
  status: 'Dipinjam' | 'Dikembalikan'
}

export interface LibraryData {
  mahasiswa: Mahasiswa[]
  petugas: Petugas[]
  buku: Buku[]
  peminjaman: Peminjaman[]
}

export interface Session {
  userId: string
  role: Role
}

/** Status tampilan diturunkan dari tanggal + status transaksi (bukan disimpan manual). */
export type StatusPinjaman = 'Dipinjam' | 'Terlambat' | 'Dikembalikan'

export interface Kredensial {
  identifier: string
  password: string
}
