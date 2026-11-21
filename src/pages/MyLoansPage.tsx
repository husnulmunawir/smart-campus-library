import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ClipboardList, Search } from 'lucide-react'
import type { Mahasiswa, Peminjaman, StatusPinjaman } from '../types'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { getLoanStatus } from '../lib/date'
import { ChangeRequestNote } from '../components/Common'
import { LoanDetailModal } from '../components/LoanDetailModal'
import { LoanTable } from '../components/LoanTable'

const FILTERS: Array<'Semua' | StatusPinjaman> = ['Semua', 'Dipinjam', 'Terlambat', 'Dikembalikan']

export function MyLoansPage() {
  const { currentUser } = useAuth()
  const { data } = useData()
  const mhs = currentUser as Mahasiswa | undefined
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState<Peminjaman | null>(null)

  const filterParam = searchParams.get('status')
  const filter = FILTERS.includes(filterParam as StatusPinjaman) ? (filterParam as StatusPinjaman) : 'Semua'

  const loans = useMemo(() => {
    if (!mhs) return []
    const q = query.trim().toLowerCase()
    return data.peminjaman
      .filter((loan) => loan.npm === mhs.npm)
      .filter((loan) => filter === 'Semua' || getLoanStatus(loan) === filter)
      .filter((loan) => {
        if (!q) return true
        const buku = data.buku.find((item) => item.kodeBuku === loan.kodeBuku)
        return (
          loan.nomorPinjaman.toLowerCase().includes(q) ||
          loan.kodeBuku.toLowerCase().includes(q) ||
          (buku?.judul.toLowerCase().includes(q) ?? false)
        )
      })
      .sort((a, b) => b.tanggalPinjam.localeCompare(a.tanggalPinjam))
  }, [data, mhs, filter, query])

  if (!mhs) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-navy">Pinjaman Saya</h2>
        <p className="mt-1 text-sm text-muted">
          Daftar seluruh transaksi peminjaman Anda. Data mahasiswa lain tidak ditampilkan.
        </p>
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[240px] flex-1">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nomor pinjaman, kode, atau judul buku..."
            aria-label="Cari pinjaman"
          />
        </div>
        <select
          className="input min-w-[160px]"
          value={filter}
          onChange={(event) => {
            const value = event.target.value
            setSearchParams(value === 'Semua' ? {} : { status: value })
          }}
          aria-label="Filter status pinjaman"
        >
          {FILTERS.map((item) => <option key={item} value={item}>{item === 'Semua' ? 'Semua status' : item}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <LoanTable
          loans={loans}
          data={data}
          showCR
          onDetail={setDetail}
          emptyTitle="Tidak ada pinjaman yang cocok"
          emptyDescription="Ubah kata kunci atau filter status untuk melihat transaksi lain."
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <ClipboardList size={14} /> Menampilkan {loans.length} transaksi milik {mhs.nama}.
      </div>
      <ChangeRequestNote compact />
      <LoanDetailModal loan={detail} data={data} onClose={() => setDetail(null)} />
    </div>
  )
}
