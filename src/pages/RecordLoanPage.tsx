import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Info,
  LogIn,
  RotateCcw,
  UserRound,
} from 'lucide-react'
import type { Peminjaman } from '../types'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { formatDate } from '../lib/date'
import { BATAS_PINJAMAN_AKTIF, countActiveLoans, findBuku, findMahasiswa } from '../lib/library'
import { EmptyState } from '../components/Common'
import { BookStatusBadge } from '../components/StatusBadge'

export function RecordLoanPage() {
  const { data, catatPeminjaman } = useData()
  const { notify } = useToast()
  const [searchParams] = useSearchParams()
  const [npm, setNpm] = useState('')
  const [kodeBuku, setKodeBuku] = useState((searchParams.get('kode') ?? '').toUpperCase())
  const [reasons, setReasons] = useState<string[]>([])
  const [berhasil, setBerhasil] = useState<Peminjaman | null>(null)

  const mhs = useMemo(() => (npm.trim() ? findMahasiswa(data, npm) : undefined), [data, npm])
  const buku = useMemo(() => (kodeBuku.trim() ? findBuku(data, kodeBuku) : undefined), [data, kodeBuku])
  const jumlahAktif = mhs ? countActiveLoans(data, mhs.npm) : 0

  const bukuTersedia = data.buku.filter((item) => item.status === 'Tersedia')

  const proses = () => {
    setReasons([])
    setBerhasil(null)
    const result = catatPeminjaman({ npm, kodeBuku })
    if (!result.ok) {
      setReasons(result.reasons)
      notify('error', result.message)
      return
    }
    setBerhasil(result.peminjaman ?? null)
    setNpm('')
    setKodeBuku('')
    notify('success', result.message)
  }

  const resetForm = () => {
    setNpm('')
    setKodeBuku('')
    setReasons([])
    setBerhasil(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-navy">Catat Peminjaman</h2>
          <p className="mt-1 text-sm text-muted">
            Petugas mencatat satu transaksi untuk satu buku. Validasi dijalankan pada data transaksi sebenarnya.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs text-muted">
          <Info size={15} className="text-maroon" /> Maks. {BATAS_PINJAMAN_AKTIF} buku aktif · kembali dalam 7 hari
        </div>
      </div>

      {berhasil && (
        <div className="animate-in rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={21} className="mt-0.5 shrink-0 text-emerald-600" />
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-emerald-800">Peminjaman berhasil dicatat</h3>
              <p className="mt-1 text-xs text-emerald-700">
                Nomor transaksi <span className="font-bold">{berhasil.nomorPinjaman}</span> · status buku diperbarui menjadi Dipinjam.
              </p>
              <div className="mt-3 grid gap-2 text-xs text-emerald-800 sm:grid-cols-3">
                <p>NPM: <span className="font-bold">{berhasil.npm}</span></p>
                <p>Kode buku: <span className="font-bold">{berhasil.kodeBuku}</span></p>
                <p>Tanggal kembali: <span className="font-bold">{formatDate(berhasil.tanggalKembali)}</span></p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  <RotateCcw size={14} /> Catat lagi
                </button>
                <Link to="/pinjaman-aktif" className="btn btn-primary">Lihat Pinjaman Aktif</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {reasons.length > 0 && (
        <div className="animate-in rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="flex items-center gap-2 text-sm font-extrabold text-red-700">
            <AlertTriangle size={17} /> Peminjaman ditolak
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed text-red-700">
            {reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
          <p className="mt-2 text-[11px] text-red-600">Tidak ada transaksi baru dan status buku tidak diubah.</p>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h3 className="text-sm font-bold text-navy">Data Transaksi</h3>
            <p className="mt-1 text-xs text-muted">Isi NPM mahasiswa dan kode buku fisik yang akan dipinjam.</p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="npm" className="field-label">NPM Mahasiswa</label>
                <div className="relative">
                  <UserRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="npm"
                    className="input pl-10 uppercase"
                    value={npm}
                    onChange={(event) => { setNpm(event.target.value); setReasons([]) }}
                    placeholder="Contoh: 011250040"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="kode" className="field-label">Kode Unik Buku</label>
                <div className="relative">
                  <BookOpenCheck size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="kode"
                    className="input pl-10 uppercase"
                    value={kodeBuku}
                    onChange={(event) => { setKodeBuku(event.target.value.toUpperCase()); setReasons([]) }}
                    placeholder="Contoh: BKU-001"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-ivory/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Identitas Mahasiswa</p>
                {mhs ? (
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="font-bold text-navy">{mhs.nama}</p>
                    <p className="text-muted">NPM {mhs.npm} · {mhs.programStudi}</p>
                    <p className="text-muted">Status: <span className={mhs.status === 'Aktif' ? 'font-bold text-emerald-700' : 'font-bold text-red-600'}>{mhs.status}</span></p>
                    <p className="text-muted">Pinjaman aktif: <span className="font-bold text-navy">{jumlahAktif} / {BATAS_PINJAMAN_AKTIF}</span></p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted">Masukkan NPM untuk menampilkan identitas mahasiswa.</p>
                )}
              </div>
              <div className="rounded-xl border border-line bg-ivory/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Informasi Buku</p>
                {buku ? (
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="font-bold text-navy">{buku.judul}</p>
                    <p className="text-muted">Penulis: {buku.penulis}</p>
                    <p className="text-muted">Kode: {buku.kodeBuku}</p>
                    <div className="pt-1"><BookStatusBadge status={buku.status} /></div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted">Masukkan kode buku untuk menampilkan informasi buku.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button type="button" onClick={proses} className="btn btn-primary">
                <LogIn size={16} /> Proses Peminjaman
              </button>
              <button type="button" onClick={resetForm} className="btn btn-outline">
                <RotateCcw size={15} /> Kosongkan
              </button>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="text-sm font-bold text-navy">Aturan Validasi</h3>
            <ol className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
              <li>1. Mahasiswa berstatus Aktif.</li>
              <li>2. Jumlah pinjaman aktif mahasiswa kurang dari {BATAS_PINJAMAN_AKTIF} buku.</li>
              <li>3. Buku berstatus Tersedia.</li>
            </ol>
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-ivory px-3 py-2 text-[11px] leading-relaxed text-muted">
              <CalendarDays size={14} className="mt-0.5 shrink-0 text-maroon" />
              Tanggal kembali ditetapkan 7 hari kalender setelah tanggal peminjaman dan tidak diubah otomatis.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy">Pilih Mahasiswa</h3>
            <p className="mt-1 text-[11px] text-muted">Klik untuk mengisi NPM secara otomatis.</p>
            <div className="mt-3 space-y-2">
              {data.mahasiswa.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setNpm(item.npm); setReasons([]) }}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 text-left transition hover:border-maroon"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-navy">{item.nama}</span>
                    <span className="text-[10px] text-muted">{item.npm} · {countActiveLoans(data, item.npm)} aktif</span>
                  </span>
                  <span className={`text-[10px] font-bold ${item.status === 'Aktif' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy">Buku Tersedia</h3>
            <p className="mt-1 text-[11px] text-muted">Klik untuk mengisi kode buku secara otomatis.</p>
            {bukuTersedia.length === 0 ? (
              <div className="mt-3"><EmptyState title="Tidak ada buku tersedia" description="Semua buku sedang dipinjam." /></div>
            ) : (
              <div className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {bukuTersedia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setKodeBuku(item.kodeBuku); setReasons([]) }}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 text-left transition hover:border-maroon"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold text-navy">{item.judul}</span>
                      <span className="text-[10px] text-muted">{item.kodeBuku} · {item.penulis}</span>
                    </span>
                    <BookStatusBadge status={item.status} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
