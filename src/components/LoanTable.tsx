import { Info } from 'lucide-react'
import type { LibraryData, Peminjaman } from '../types'
import { formatDate, getLoanStatus } from '../lib/date'
import { findBuku, findMahasiswa } from '../lib/library'
import { LoanStatusBadge } from './StatusBadge'
import { EmptyState } from './Common'

export function LoanTable({
  loans,
  data,
  showStudent = false,
  showCR = false,
  onDetail,
  emptyTitle = 'Belum ada data peminjaman',
  emptyDescription = 'Transaksi peminjaman akan muncul di sini setelah dicatat oleh petugas.',
}: {
  loans: Peminjaman[]
  data: LibraryData
  showStudent?: boolean
  showCR?: boolean
  onDetail?: (loan: Peminjaman) => void
  emptyTitle?: string
  emptyDescription?: string
}) {
  if (loans.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={Info} />
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>No. Pinjaman</th>
            {showStudent && <th>Mahasiswa</th>}
            <th>Judul Buku</th>
            <th>Tgl. Pinjam</th>
            <th>Tgl. Kembali</th>
            <th>Status</th>
            {onDetail && <th className="text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => {
            const buku = findBuku(data, loan.kodeBuku)
            const mhs = findMahasiswa(data, loan.npm)
            const status = getLoanStatus(loan)
            return (
              <tr key={loan.id}>
                <td className="whitespace-nowrap font-semibold text-maroon">{loan.nomorPinjaman}</td>
                {showStudent && (
                  <td>
                    <p className="font-semibold text-navy">{mhs?.nama ?? '—'}</p>
                    <p className="text-[11px] text-muted">{loan.npm}</p>
                  </td>
                )}
                <td>
                  <p className="font-semibold text-navy">{buku?.judul ?? loan.kodeBuku}</p>
                  <p className="text-[11px] text-muted">{loan.kodeBuku}</p>
                </td>
                <td className="whitespace-nowrap text-muted">{formatDate(loan.tanggalPinjam)}</td>
                <td className="whitespace-nowrap text-muted">{formatDate(loan.tanggalKembali)}</td>
                <td><LoanStatusBadge status={status} showCR={showCR} /></td>
                {onDetail && (
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => onDetail(loan)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-maroon hover:bg-maroon-soft"
                    >
                      <Info size={13} /> Detail
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
