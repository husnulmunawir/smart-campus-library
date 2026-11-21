import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LibraryBig,
  Sparkles,
} from 'lucide-react'
import type { Mahasiswa, Peminjaman } from '../types'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { greeting } from '../lib/date'
import { countActiveLoans, getOverdueLoans, sisaKuota } from '../lib/library'
import { BookCard } from '../components/BookCard'
import { ChangeRequestNote, SectionHeader } from '../components/Common'
import { LoanDetailModal } from '../components/LoanDetailModal'
import { LoanTable } from '../components/LoanTable'
import { StatCard } from '../components/StatCard'

export function StudentDashboardPage() {
  const { currentUser } = useAuth()
  const { data } = useData()
  const mhs = currentUser as Mahasiswa | undefined
  const [detail, setDetail] = useState<Peminjaman | null>(null)

  const loans = useMemo(
    () =>
      mhs
        ? data.peminjaman
            .filter((loan) => loan.npm === mhs.npm)
            .sort((a, b) => b.tanggalPinjam.localeCompare(a.tanggalPinjam))
        : [],
    [data.peminjaman, mhs],
  )

  const newBooks = useMemo(
    () =>
      data.buku
        .filter((book) => book.status === 'Tersedia')
        .slice()
        .sort((a, b) => b.tahunTerbit - a.tahunTerbit)
        .slice(0, 4),
    [data.buku],
  )

  if (!mhs) return null

  const aktif = countActiveLoans(data, mhs.npm)
  const kuota = sisaKuota(data, mhs.npm)
  const terlambat = getOverdueLoans(data, mhs.npm).length

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-2xl bg-maroon px-6 py-7 text-white sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-32 size-40 rounded-full border border-gold/20" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-gold">
              <Sparkles size={14} /> {greeting()}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{mhs.nama}</h2>
            <p className="mt-2 text-sm text-white/75">
              NPM {mhs.npm} <span className="mx-2 text-white/30">•</span> {mhs.programStudi} angkatan {mhs.angkatan}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="badge bg-white/15 text-white">
                <CheckCircle2 size={12} /> Status: {mhs.status}
              </span>
              <span className="badge bg-gold/20 text-gold">Mahasiswa</span>
            </div>
          </div>
          <Link to="/katalog" className="btn btn-gold">
            <LibraryBig size={16} /> Jelajahi Katalog
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Sedang Dipinjam"
          value={aktif}
          hint={`Dari maksimal 3 buku aktif`}
          icon={BookMarked}
        />
        <StatCard label="Sisa Kuota Peminjaman" value={kuota} hint="Kuota tersedia untuk pinjaman baru" icon={ClipboardList} tone="gold" />
        <StatCard
          label="Buku Terlambat"
          value={terlambat}
          hint="Status dihitung otomatis dari tanggal kembali"
          icon={Clock3}
          tone="red"
          cr
        />
      </section>

      <section>
        <SectionHeader
          title="Buku Terbaru"
          description="Beberapa buku tersedia yang dapat Anda lihat di katalog."
          action={
            <Link to="/katalog" className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:underline">
              Lihat semua <ArrowRight size={14} />
            </Link>
          }
        />
        {newBooks.length === 0 ? (
          <div className="card p-6 text-center text-sm text-muted">Belum ada buku tersedia saat ini.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {newBooks.map((book) => <BookCard key={book.id} buku={book} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="Pinjaman Saya"
          description="Hanya transaksi peminjaman milik Anda yang ditampilkan."
          action={
            <Link to="/pinjaman-saya" className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:underline">
              Lihat semua <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="card overflow-hidden">
          <LoanTable
            loans={loans.slice(0, 5)}
            data={data}
            showCR
            onDetail={setDetail}
            emptyTitle="Belum ada pinjaman"
            emptyDescription="Pinjaman Anda akan muncul setelah petugas perpustakaan mencatatnya."
          />
        </div>
      </section>

      <ChangeRequestNote />
      <LoanDetailModal loan={detail} data={data} onClose={() => setDetail(null)} />
    </div>
  )
}
