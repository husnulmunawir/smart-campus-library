import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ClipboardList,
  LibraryBig,
  LogIn,
  RotateCcw,
  TrendingUp,
} from 'lucide-react'
import type { LibraryData, Peminjaman } from '../types'
import { useData } from '../context/DataContext'
import { formatDate, getLoanStatus } from '../lib/date'
import {
  findBuku,
  findMahasiswa,
  getActiveLoans,
  getOverdueLoans,
} from '../lib/library'
import { ChangeRequestNote, EmptyState, SectionHeader } from '../components/Common'
import { LoanStatusBadge } from '../components/StatusBadge'
import { LoanTable } from '../components/LoanTable'
import { StatCard } from '../components/StatCard'

function RecentRow({
  loan,
  data,
  primaryDate,
  primaryLabel,
}: {
  loan: Peminjaman
  data: LibraryData
  primaryDate: string
  primaryLabel: string
}) {
  const buku = findBuku(data, loan.kodeBuku)
  const mhs = findMahasiswa(data, loan.npm)
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-navy">{buku?.judul ?? loan.kodeBuku}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted">
          {mhs?.nama ?? '—'} · {loan.npm}
        </p>
        <p className="mt-1 text-[10px] text-muted">{primaryLabel}: {formatDate(primaryDate)}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[10px] font-semibold text-maroon">{loan.nomorPinjaman}</p>
        <div className="mt-1"><LoanStatusBadge status={getLoanStatus(loan)} /></div>
      </div>
    </div>
  )
}

export function StaffDashboardPage() {
  const { data } = useData()
  const aktif = getActiveLoans(data)
  const terlambat = getOverdueLoans(data)
  const tersedia = data.buku.filter((book) => book.status === 'Tersedia').length
  const dipinjam = data.buku.filter((book) => book.status === 'Dipinjam').length

  const pinjamanTerbaru = data.peminjaman
    .slice()
    .sort((a, b) => b.tanggalPinjam.localeCompare(a.tanggalPinjam))
    .slice(0, 4)

  const pengembalianTerbaru = data.peminjaman
    .filter((loan) => loan.tanggalPengembalian !== null)
    .sort((a, b) => (b.tanggalPengembalian ?? '').localeCompare(a.tanggalPengembalian ?? ''))
    .slice(0, 4)

  const quickActions = [
    { to: '/catat-peminjaman', label: 'Catat Peminjaman', desc: 'Proses transaksi baru', icon: LogIn },
    { to: '/catat-pengembalian', label: 'Catat Pengembalian', desc: 'Kembalikan buku pinjaman', icon: RotateCcw },
    { to: '/katalog', label: 'Lihat Katalog', desc: 'Cari & filter buku', icon: BookOpen },
    { to: '/pinjaman-aktif', label: 'Pinjaman Aktif', desc: 'Pantau semua transaksi', icon: ClipboardList },
  ]

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-2xl bg-maroon px-6 py-7 text-white sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border border-white/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-gold">
              <TrendingUp size={14} /> Ringkasan Operasional
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Dashboard Petugas</h2>
            <p className="mt-2 max-w-xl text-sm text-white/75">
              Pantau katalog dan transaksi perpustakaan. Seluruh angka di bawah dihitung langsung dari data transaksi.
            </p>
          </div>
          <Link to="/catat-peminjaman" className="btn btn-gold">
            <LogIn size={16} /> Catat Peminjaman
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Buku" value={data.buku.length} hint="Seluruh koleksi katalog" icon={LibraryBig} />
        <StatCard label="Buku Tersedia" value={tersedia} hint="Siap dipinjam" icon={BookOpen} tone="gold" />
        <StatCard label="Buku Dipinjam" value={dipinjam} hint="Sedang dalam peminjaman" icon={ClipboardList} />
        <StatCard label="Total Pinjaman Aktif" value={aktif.length} hint="Termasuk yang terlambat" icon={TrendingUp} tone="navy" />
      </section>

      <section>
        <SectionHeader title="Aksi Cepat" description="Pintasan untuk pekerjaan yang paling sering dilakukan." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="card group flex items-center gap-3 p-4 transition hover:border-maroon hover:shadow-md"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-maroon-soft text-maroon">
                <Icon size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-navy">{label}</p>
                <p className="mt-0.5 text-[11px] text-muted">{desc}</p>
              </div>
              <ArrowRight size={15} className="text-muted transition group-hover:translate-x-0.5 group-hover:text-maroon" />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-bold text-navy">Aktivitas Peminjaman Terbaru</h2>
          <div className="mt-2">
            {pinjamanTerbaru.length === 0 ? (
              <EmptyState title="Belum ada peminjaman" description="Transaksi baru akan muncul di sini." />
            ) : (
              pinjamanTerbaru.map((loan) => (
                <RecentRow key={loan.id} loan={loan} data={data} primaryDate={loan.tanggalPinjam} primaryLabel="Dipinjam" />
              ))
            )}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-bold text-navy">Pengembalian Terbaru</h2>
          <div className="mt-2">
            {pengembalianTerbaru.length === 0 ? (
              <EmptyState title="Belum ada pengembalian" description="Transaksi yang dikembalikan akan muncul di sini." />
            ) : (
              pengembalianTerbaru.map((loan) => (
                <RecentRow
                  key={loan.id}
                  loan={loan}
                  data={data}
                  primaryDate={loan.tanggalPengembalian as string}
                  primaryLabel="Dikembalikan"
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Daftar Pinjaman Aktif"
          description={`${aktif.length} transaksi belum dikembalikan.`}
          action={
            <Link to="/pinjaman-aktif" className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:underline">
              Lihat semua <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="card overflow-hidden">
          <LoanTable
            loans={aktif.slice(0, 5)}
            data={data}
            showStudent
            showCR
            emptyTitle="Tidak ada pinjaman aktif"
            emptyDescription="Semua buku sudah dikembalikan."
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Peringatan Buku Terlambat"
          description="Transaksi dengan tanggal kembali sudah terlewati dan belum dikembalikan."
        />
        <div className="card p-5">
          {terlambat.length === 0 ? (
            <EmptyState
              title="Tidak ada buku terlambat"
              description="Semua pinjaman masih dalam batas tanggal kembali."
              icon={AlertTriangle}
            />
          ) : (
            <div className="divide-y divide-line">
              {terlambat.map((loan) => {
                const buku = findBuku(data, loan.kodeBuku)
                const mhs = findMahasiswa(data, loan.npm)
                return (
                  <div key={loan.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-xs font-bold text-navy">{buku?.judul ?? loan.kodeBuku}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {mhs?.nama ?? '—'} · {loan.npm} · jatuh tempo {formatDate(loan.tanggalKembali)}
                      </p>
                    </div>
                    <LoanStatusBadge status="Terlambat" showCR />
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="mt-3"><ChangeRequestNote compact /></div>
      </section>
    </div>
  )
}
