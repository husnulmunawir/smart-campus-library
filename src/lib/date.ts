import type { Peminjaman, StatusPinjaman } from '../types'

/** Tanggal lokal dalam format YYYY-MM-DD (menghindari pergeseran timezone UTC). */
export function todayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDaysISO(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isOverdue(loan: Peminjaman, nowISO: string = todayISO()): boolean {
  return (
    loan.tanggalPengembalian === null &&
    loan.status !== 'Dikembalikan' &&
    nowISO > loan.tanggalKembali
  )
}

export function getLoanStatus(loan: Peminjaman, nowISO: string = todayISO()): StatusPinjaman {
  if (loan.status === 'Dikembalikan' || loan.tanggalPengembalian !== null) return 'Dikembalikan'
  if (isOverdue(loan, nowISO)) return 'Terlambat'
  return 'Dipinjam'
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function formatDateTime(): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

export function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}
