import type { ReactNode } from 'react'
import type { LibraryData, Peminjaman } from '../types'
import { formatDate, getLoanStatus } from '../lib/date'
import { findBuku, findMahasiswa } from '../lib/library'
import { Modal } from './Common'
import { LoanStatusBadge } from './StatusBadge'

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-2 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="max-w-[65%] text-right text-xs font-semibold text-navy">{value}</span>
    </div>
  )
}

export function LoanDetailModal({
  loan,
  data,
  onClose,
}: {
  loan: Peminjaman | null
  data: LibraryData
  onClose: () => void
}) {
  const buku = loan ? findBuku(data, loan.kodeBuku) : undefined
  const mhs = loan ? findMahasiswa(data, loan.npm) : undefined

  return (
    <Modal
      open={Boolean(loan)}
      onClose={onClose}
      title="Detail Peminjaman"
      description={loan ? `Transaksi ${loan.nomorPinjaman}` : undefined}
      footer={
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Tutup
        </button>
      }
    >
      {loan && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-maroon">{loan.nomorPinjaman}</span>
            <LoanStatusBadge status={getLoanStatus(loan)} showCR />
          </div>
          <Row label="Judul buku" value={buku?.judul ?? loan.kodeBuku} />
          <Row label="Kode buku" value={loan.kodeBuku} />
          <Row label="Penulis" value={buku?.penulis ?? '—'} />
          <Row label="Nama mahasiswa" value={mhs?.nama ?? '—'} />
          <Row label="NPM" value={loan.npm} />
          <Row label="Tanggal pinjam" value={formatDate(loan.tanggalPinjam)} />
          <Row label="Tanggal kembali" value={formatDate(loan.tanggalKembali)} />
          <Row label="Tanggal pengembalian" value={formatDate(loan.tanggalPengembalian)} />
        </div>
      )}
    </Modal>
  )
}
