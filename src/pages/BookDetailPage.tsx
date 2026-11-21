import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookMarked,
  CalendarDays,
  Hash,
  Info,
  Landmark,
  LibraryBig,
  LogIn,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { BookCover } from '../components/BookCover'
import { EmptyState } from '../components/Common'
import { BookStatusBadge } from '../components/StatusBadge'

export function BookDetailPage() {
  const { id } = useParams()
  const { data } = useData()
  const { session } = useAuth()
  const buku = data.buku.find((item) => item.id === id)

  if (!buku) {
    return (
      <div className="card">
        <EmptyState
          title="Buku tidak ditemukan"
          description="Kode buku mungkin tidak valid atau data telah diubah."
          icon={LibraryBig}
          action={<Link to="/katalog" className="btn btn-soft">Kembali ke katalog</Link>}
        />
      </div>
    )
  }

  const metadata = [
    { icon: UserRound, label: 'Penulis', value: buku.penulis },
    { icon: Landmark, label: 'Penerbit', value: buku.penerbit },
    { icon: CalendarDays, label: 'Tahun Terbit', value: String(buku.tahunTerbit) },
    { icon: LibraryBig, label: 'Kategori', value: buku.kategori },
    { icon: Hash, label: 'Kode Buku', value: buku.kodeBuku },
  ]

  return (
    <div className="space-y-5">
      <Link to="/katalog" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-maroon">
        <ArrowLeft size={15} /> Kembali ke katalog
      </Link>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="card p-5">
          <div className="mx-auto w-full max-w-[260px]">
            <BookCover buku={buku} />
          </div>
          <div className="mt-5 flex justify-center"><BookStatusBadge status={buku.status} /></div>
        </div>

        <div className="card p-5 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gold">{buku.kategori}</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-navy sm:text-3xl">
            {buku.judul}
          </h2>
          <p className="mt-2 text-sm text-muted">Oleh {buku.penulis}</p>

          <div className="mt-6 grid gap-x-8 gap-y-4 border-y border-line py-5 sm:grid-cols-2">
            {metadata.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ivory text-maroon">
                  <Icon size={15} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-navy">Deskripsi</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{buku.deskripsi}</p>
          </div>

          <div className="mt-6 rounded-xl border border-maroon/15 bg-maroon-soft/60 p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-maroon">
              <Info size={15} />
              {buku.status === 'Tersedia' ? 'Cara meminjam buku' : 'Buku sedang dipinjam'}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-navy/80">
              {buku.status === 'Tersedia'
                ? 'Buku dapat diproses untuk peminjaman melalui petugas perpustakaan. Mahasiswa tidak dapat meminjam langsung dari sistem ini.'
                : 'Buku ini sedang dipinjam dan tidak dapat diproses untuk peminjaman sampai dikembalikan.'}
            </p>
            {buku.status === 'Tersedia' && session?.role === 'petugas' && (
              <Link
                to={`/catat-peminjaman?kode=${encodeURIComponent(buku.kodeBuku)}`}
                className="btn btn-primary mt-3"
              >
                <LogIn size={15} /> Catat Peminjaman Buku Ini
              </Link>
            )}
            {buku.status === 'Dipinjam' && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                <BookMarked size={13} /> Tidak ada tindakan peminjaman untuk buku ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
