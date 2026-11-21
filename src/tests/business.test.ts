import { describe, expect, it } from 'vitest'
import { addDaysISO, getLoanStatus } from '../lib/date'
import {
  countActiveLoans,
  findBuku,
  processLoan,
  processReturn,
} from '../lib/library'
import { createSeedData } from '../lib/seed'

const HARI_INI = '2026-11-21'

describe('Skenario wajib UAS', () => {
  it('U1 — peminjaman berhasil: mahasiswa aktif, 1 pinjaman aktif, buku tersedia', () => {
    const data = createSeedData(HARI_INI)
    expect(countActiveLoans(data, '011250041')).toBe(1)

    const result = processLoan(data, { npm: '011250041', kodeBuku: 'BKU-001' }, HARI_INI)

    expect(result.ok).toBe(true)
    expect(result.peminjaman?.nomorPinjaman).toBe('PINJ-2026-0009')
    expect(result.peminjaman?.tanggalPinjam).toBe(HARI_INI)
    expect(result.peminjaman?.tanggalKembali).toBe(addDaysISO(HARI_INI, 7))
    expect(findBuku(result.data, 'BKU-001')?.status).toBe('Dipinjam')
    expect(countActiveLoans(result.data, '011250041')).toBe(2)
    expect(data.peminjaman).toHaveLength(8)
  })

  it('U2 — peminjaman ditolak: buku sedang dipinjam, data tidak berubah', () => {
    const data = createSeedData(HARI_INI)
    expect(countActiveLoans(data, '011250042')).toBe(2)

    const result = processLoan(data, { npm: '011250042', kodeBuku: 'BKU-003' }, HARI_INI)

    expect(result.ok).toBe(false)
    expect(result.reasons).toContain('Peminjaman ditolak: buku sedang dipinjam.')
    expect(result.data).toBe(data)
    expect(result.data.peminjaman).toHaveLength(8)
    expect(findBuku(result.data, 'BKU-003')?.status).toBe('Dipinjam')
  })

  it('U3 — batas maksimal: pinjaman ketiga diterima, kuota habis tepat di tiga', () => {
    const data = createSeedData(HARI_INI)
    expect(countActiveLoans(data, '011250040')).toBe(2)

    const result = processLoan(data, { npm: '011250040', kodeBuku: 'BKU-004' }, HARI_INI)

    expect(result.ok).toBe(true)
    expect(countActiveLoans(result.data, '011250040')).toBe(3)

    const keempat = processLoan(result.data, { npm: '011250040', kodeBuku: 'BKU-007' }, HARI_INI)
    expect(keempat.ok).toBe(false)
    expect(keempat.reasons).toContain(
      'Peminjaman ditolak: mahasiswa telah mencapai batas maksimal tiga buku.',
    )
    expect(keempat.data.peminjaman).toHaveLength(9)
  })

  it('U4 — status terlambat dihitung otomatis dari tanggal kembali', () => {
    const data = createSeedData(HARI_INI)
    const overdue = data.peminjaman.find((loan) => loan.kodeBuku === 'BKU-009')!

    expect(getLoanStatus(overdue, HARI_INI)).toBe('Terlambat')
    expect(overdue.tanggalKembali).toBe(addDaysISO(HARI_INI, -5))
    expect(overdue.tanggalPengembalian).toBeNull()

    const result = processReturn(data, overdue.id, HARI_INI)
    expect(result.ok).toBe(true)
    expect(getLoanStatus(result.peminjaman!, HARI_INI)).toBe('Dikembalikan')
    expect(result.peminjaman?.tanggalKembali).toBe(addDaysISO(HARI_INI, -5))
    expect(result.peminjaman?.tanggalPengembalian).toBe(HARI_INI)
  })
})

describe('Aturan bisnis tambahan', () => {
  it('menolak mahasiswa tidak aktif', () => {
    const data = createSeedData(HARI_INI)
    const result = processLoan(data, { npm: '011250099', kodeBuku: 'BKU-001' }, HARI_INI)
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain('Peminjaman ditolak: mahasiswa tidak aktif.')
    expect(findBuku(result.data, 'BKU-001')?.status).toBe('Tersedia')
  })

  it('mencegah pengembalian ganda', () => {
    const data = createSeedData(HARI_INI)
    const selesai = data.peminjaman.find((loan) => loan.tanggalPengembalian !== null)!

    const result = processReturn(data, selesai.id, HARI_INI)
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain('Pengembalian ditolak: transaksi sudah dikembalikan.')
    expect(result.data).toBe(data)
  })

  it('pengembalian menyinkronkan status buku dan kuota mahasiswa', () => {
    const data = createSeedData(HARI_INI)
    const dipinjam = data.peminjaman.find((loan) => loan.kodeBuku === 'BKU-006')!
    const sebelum = countActiveLoans(data, '011250041')

    const result = processReturn(data, dipinjam.id, HARI_INI)
    expect(result.ok).toBe(true)
    expect(findBuku(result.data, 'BKU-006')?.status).toBe('Tersedia')
    expect(countActiveLoans(result.data, '011250041')).toBe(sebelum - 1)
  })

  it('menolak kode buku yang tidak ditemukan', () => {
    const data = createSeedData(HARI_INI)
    const result = processLoan(data, { npm: '011250041', kodeBuku: 'BKU-999' }, HARI_INI)
    expect(result.ok).toBe(false)
    expect(result.reasons.join(' ')).toContain('Buku dengan kode BKU-999 tidak ditemukan.')
  })
})
