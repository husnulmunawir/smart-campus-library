import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RotateCcw, Search } from 'lucide-react'
import type { Peminjaman, StatusPinjaman } from '../types'
import { useData } from '../context/DataContext'
import { getLoanStatus } from '../lib/date'
import { findBuku, findMahasiswa, getActiveLoans, getOverdueLoans } from '../lib/library'
import { ChangeRequestNote } from '../components/Common'
import { LoanDetailModal } from '../components/LoanDetailModal'
import { LoanTable } from '../components/LoanTable'

const FILTERS: Array<'Semua' | StatusPinjaman> = ['Semua', 'Dipinjam', 'Terlambat']

export function ActiveLoansPage() {
  const { data } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState<Peminjaman | null>(null)

  const filterParam = searchParams.get('status')
  const filter = FILTERS.includes(filterParam as StatusPinjaman) ? (filterParam as StatusPinjaman) : 'Semua'

  const aktif = getActiveLoans(data)
  const terlambat = getOverdueLoans(data)

  const loans = useMemo(() => {
    const q = query.trim().toLowerCase()
    return aktif
      .filter((loan) => filter === 'Semua' || getLoanStatus(loan) === filter)
      .filter((loan) => {
        if (!q) return true
        const buku = findBuku(data, loan.kodeBuku)
        const mhs = findMahasiswa(data, loan.npm)
        return [loan.nomorPinjaman, loan.npm, loan.kodeBuku, buku?.judul ?? '', mhs?.nama ?? '']
          .some((field) => field.toLowerCase().includes(q))
      })
      .sort((a, b) => b.tanggalPinjam.localeCompare(a.tanggalPinjam))
  }, [aktif, data, filter, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-navy">Pinjaman Aktif</h2>
          <p className="mt-1 text-sm text-muted">
            {aktif.length} transaksi belum dikembalikan · {terlambat.length} di antaranya terlambat.
          </p>
        </div>
        <Link to="/catat-pengembalian" className="btn btn-primary">
          <RotateCcw size={15} /> Catat Pengembalian
        </Link>
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[240px] flex-1">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nomor, NPM, kode buku, judul, atau nama..."
            aria-label="Cari pinjaman aktif"
          />
        </div>
        <select
          className="input min-w-[160px]"
          value={filter}
          onChange={(event) => setSearchParams(event.target.value === 'Semua' ? {} : { status: event.target.value })}
          aria-label="Filter status pinjaman"
        >
          {FILTERS.map((item) => <option key={item} value={item}>{item === 'Semua' ? 'Semua status' : item}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <LoanTable
          loans={loans}
          data={data}
          showStudent
          showCR
          onDetail={setDetail}
          emptyTitle="Tidak ada pinjaman yang cocok"
          emptyDescription="Ubah kata kunci atau filter untuk melihat transaksi lain."
        />
      </div>

      <ChangeRequestNote compact />
      <LoanDetailModal loan={detail} data={data} onClose={() => setDetail(null)} />
    </div>
  )
}
