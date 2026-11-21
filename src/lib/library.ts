import type { Buku, LibraryData, Mahasiswa, Peminjaman } from '../types'
import { addDaysISO, isOverdue, todayISO } from './date'

export const BATAS_PINJAMAN_AKTIF = 3
export const LAMA_PINJAMAN_HARI = 7

export function findMahasiswa(data: LibraryData, npm: string): Mahasiswa | undefined {
  return data.mahasiswa.find((item) => item.npm === npm.trim())
}

export function findBuku(data: LibraryData, kodeBuku: string): Buku | undefined {
  return data.buku.find((item) => item.kodeBuku === kodeBuku.trim().toUpperCase())
}

export function findPetugasById(data: LibraryData, id: string) {
  return data.petugas.find((item) => item.id === id)
}

export function getLoansOf(data: LibraryData, npm?: string): Peminjaman[] {
  return npm ? data.peminjaman.filter((loan) => loan.npm === npm) : [...data.peminjaman]
}

export function getActiveLoans(data: LibraryData, npm?: string): Peminjaman[] {
  return getLoansOf(data, npm).filter((loan) => loan.status !== 'Dikembalikan')
}

export function getOverdueLoans(data: LibraryData, npm?: string, nowISO: string = todayISO()): Peminjaman[] {
  return getActiveLoans(data, npm).filter((loan) => isOverdue(loan, nowISO))
}

export function countActiveLoans(data: LibraryData, npm: string): number {
  return getActiveLoans(data, npm).length
}

export function sisaKuota(data: LibraryData, npm: string): number {
  return Math.max(0, BATAS_PINJAMAN_AKTIF - countActiveLoans(data, npm))
}

export interface LoanInput {
  npm: string
  kodeBuku: string
  tanggalPinjam?: string
}

export interface ProcessResult {
  ok: boolean
  reasons: string[]
  message: string
  peminjaman?: Peminjaman
  data: LibraryData
}

function nextLoanNumber(data: LibraryData, tanggalPinjam: string): string {
  const year = tanggalPinjam.slice(0, 4)
  const prefix = `PINJ-${year}-`
  const highest = data.peminjaman.reduce((max, loan) => {
    if (!loan.nomorPinjaman.startsWith(prefix)) return max
    const suffix = Number(loan.nomorPinjaman.slice(prefix.length))
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max
  }, 0)
  return `${prefix}${String(highest + 1).padStart(4, '0')}`
}

/**
 * Satu transaksi = satu buku. Seluruh aturan bisnis divalidasi terhadap data
 * transaksi sebenarnya; kegagalan tidak mengubah data sama sekali.
 */
export function processLoan(data: LibraryData, input: LoanInput, nowISO: string = todayISO()): ProcessResult {
  const reasons: string[] = []
  const npm = input.npm.trim()
  const kodeBuku = input.kodeBuku.trim().toUpperCase()
  const tanggalPinjam = input.tanggalPinjam ?? nowISO

  if (!npm) reasons.push('NPM mahasiswa wajib diisi.')
  if (!kodeBuku) reasons.push('Kode buku wajib diisi.')

  const mahasiswa = npm ? findMahasiswa(data, npm) : undefined
  const buku = kodeBuku ? findBuku(data, kodeBuku) : undefined

  if (npm && !mahasiswa) reasons.push(`Mahasiswa dengan NPM ${npm} tidak ditemukan.`)
  if (kodeBuku && !buku) reasons.push(`Buku dengan kode ${kodeBuku} tidak ditemukan.`)

  if (mahasiswa && mahasiswa.status !== 'Aktif') {
    reasons.push('Peminjaman ditolak: mahasiswa tidak aktif.')
  }

  if (mahasiswa && countActiveLoans(data, mahasiswa.npm) >= BATAS_PINJAMAN_AKTIF) {
    reasons.push('Peminjaman ditolak: mahasiswa telah mencapai batas maksimal tiga buku.')
  }

  if (buku && buku.status === 'Dipinjam') {
    reasons.push('Peminjaman ditolak: buku sedang dipinjam.')
  }

  // Pengaman tambahan terhadap peminjaman ganda walau status buku tidak sinkron.
  if (buku && getActiveLoans(data).some((loan) => loan.kodeBuku === buku.kodeBuku)) {
    if (!reasons.includes('Peminjaman ditolak: buku sedang dipinjam.')) {
      reasons.push('Peminjaman ditolak: buku sedang dipinjam.')
    }
  }

  if (reasons.length > 0) {
    return { ok: false, reasons, message: 'Peminjaman tidak dapat diproses.', data }
  }

  const peminjaman: Peminjaman = {
    id: `pinj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    nomorPinjaman: nextLoanNumber(data, tanggalPinjam),
    npm: mahasiswa!.npm,
    kodeBuku: buku!.kodeBuku,
    tanggalPinjam,
    tanggalKembali: addDaysISO(tanggalPinjam, LAMA_PINJAMAN_HARI),
    tanggalPengembalian: null,
    status: 'Dipinjam',
  }

  return {
    ok: true,
    reasons: [],
    message: `Peminjaman ${peminjaman.nomorPinjaman} berhasil dicatat.`,
    peminjaman,
    data: {
      ...data,
      buku: data.buku.map((item) =>
        item.id === buku!.id ? { ...item, status: 'Dipinjam' as const } : item,
      ),
      peminjaman: [...data.peminjaman, peminjaman],
    },
  }
}

export function processReturn(data: LibraryData, peminjamanId: string, nowISO: string = todayISO()): ProcessResult {
  const loan = data.peminjaman.find((item) => item.id === peminjamanId)

  if (!loan) {
    return {
      ok: false,
      reasons: ['Transaksi peminjaman tidak ditemukan.'],
      message: 'Pengembalian tidak dapat diproses.',
      data,
    }
  }

  if (loan.status === 'Dikembalikan' || loan.tanggalPengembalian !== null) {
    return {
      ok: false,
      reasons: ['Pengembalian ditolak: transaksi sudah dikembalikan.'],
      message: 'Pengembalian tidak dapat diproses.',
      data,
    }
  }

  const returned: Peminjaman = {
    ...loan,
    status: 'Dikembalikan',
    tanggalPengembalian: nowISO,
  }

  return {
    ok: true,
    reasons: [],
    message: `Pengembalian ${loan.nomorPinjaman} berhasil dicatat.`,
    peminjaman: returned,
    data: {
      ...data,
      buku: data.buku.map((item) =>
        item.kodeBuku === loan.kodeBuku ? { ...item, status: 'Tersedia' as const } : item,
      ),
      peminjaman: data.peminjaman.map((item) => (item.id === loan.id ? returned : item)),
    },
  }
}
