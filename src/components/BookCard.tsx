import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Buku } from '../types'
import { BookCover } from './BookCover'
import { BookStatusBadge } from './StatusBadge'

export function BookCard({ buku }: { buku: Buku }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative bg-[#f2ede2] p-3 pb-0">
        <div className="mx-auto w-[112px] max-w-full">
          <BookCover buku={buku} />
        </div>
        <div className="absolute right-3 top-3">
          <BookStatusBadge status={buku.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gold">{buku.kategori}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-navy">{buku.judul}</h3>
        <p className="mt-1 truncate text-xs text-muted">{buku.penulis}</p>
        <p className="mt-2 text-[10px] tracking-wide text-muted">Kode: {buku.kodeBuku}</p>
        <Link
          to={`/buku/${buku.id}`}
          className="mt-3 inline-flex items-center gap-1 self-start text-xs font-bold text-maroon hover:underline"
        >
          Lihat detail <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  )
}
