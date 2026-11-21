import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import type { Buku } from '../types'
import { BookCard } from '../components/BookCard'
import { BookCover } from '../components/BookCover'
import { EmptyState } from '../components/Common'
import { BookStatusBadge } from '../components/StatusBadge'

export function CatalogPage() {
  const { data } = useData()
  const [query, setQuery] = useState('')
  const [kategori, setKategori] = useState('Semua')
  const [status, setStatus] = useState('Semua')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const kategoriList = useMemo(
    () => ['Semua', ...Array.from(new Set(data.buku.map((book) => book.kategori))).sort()],
    [data.buku],
  )

  const hasil = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.buku.filter((book) => {
      const cocokTeks = !q || book.judul.toLowerCase().includes(q) || book.penulis.toLowerCase().includes(q)
      const cocokKategori = kategori === 'Semua' || book.kategori === kategori
      const cocokStatus = status === 'Semua' || book.status === status
      return cocokTeks && cocokKategori && cocokStatus
    })
  }, [data.buku, query, kategori, status])

  const bersihkanFilter = () => {
    setQuery('')
    setKategori('Semua')
    setStatus('Semua')
  }

  const adaFilter = query.trim() !== '' || kategori !== 'Semua' || status !== 'Semua'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-navy">Katalog Buku</h2>
          <p className="mt-1 text-sm text-muted">
            {data.buku.length} buku dalam koleksi · {data.buku.filter((b) => b.status === 'Tersedia').length} tersedia
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-white p-1">
          <button
            type="button"
            onClick={() => setView('grid')}
            aria-label="Tampilan grid"
            title="Tampilan grid"
            className={`grid size-8 place-items-center rounded-md ${view === 'grid' ? 'bg-maroon text-white' : 'text-muted hover:text-navy'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-label="Tampilan daftar"
            title="Tampilan daftar"
            className={`grid size-8 place-items-center rounded-md ${view === 'list' ? 'bg-maroon text-white' : 'text-muted hover:text-navy'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input pl-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul atau penulis buku..."
              aria-label="Cari judul atau penulis buku"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <select
              className="input min-w-[170px] appearance-none pl-9 pr-8"
              value={kategori}
              onChange={(event) => setKategori(event.target.value)}
              aria-label="Filter kategori"
            >
              {kategoriList.map((item) => <option key={item} value={item}>{item === 'Semua' ? 'Semua kategori' : item}</option>)}
            </select>
          </div>
          <select
            className="input min-w-[150px]"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter status ketersediaan"
          >
            <option value="Semua">Semua status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Dipinjam">Dipinjam</option>
          </select>
          {adaFilter && (
            <button type="button" onClick={bersihkanFilter} className="btn btn-outline">
              <X size={15} /> Reset
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-muted">
          Menampilkan <span className="font-bold text-navy">{hasil.length}</span> dari {data.buku.length} buku
        </p>
      </div>

      {hasil.length === 0 ? (
        <div className="card">
          <EmptyState
            title="Buku tidak ditemukan"
            description="Coba kata kunci lain atau ubah filter kategori dan status."
            icon={Search}
            action={<button type="button" onClick={bersihkanFilter} className="btn btn-soft">Reset filter</button>}
          />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {hasil.map((book) => <BookCard key={book.id} buku={book} />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Kode</th>
                  <th>Judul & Penulis</th>
                  <th>Kategori</th>
                  <th>Tahun</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {hasil.map((book: Buku) => (
                  <tr key={book.id}>
                    <td><div className="w-9"><BookCover buku={book} /></div></td>
                    <td className="whitespace-nowrap font-semibold text-maroon">{book.kodeBuku}</td>
                    <td>
                      <p className="font-semibold text-navy">{book.judul}</p>
                      <p className="text-[11px] text-muted">{book.penulis}</p>
                    </td>
                    <td className="text-muted">{book.kategori}</td>
                    <td className="text-muted">{book.tahunTerbit}</td>
                    <td><BookStatusBadge status={book.status} /></td>
                    <td className="text-right">
                      <Link
                        to={`/buku/${book.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-maroon hover:bg-maroon-soft"
                      >
                        Detail <ArrowUpRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
