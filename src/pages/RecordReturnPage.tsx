import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { formatDate, getLoanStatus } from '../lib/date'
import { findBuku, findMahasiswa } from '../lib/library'
import { EmptyState, Modal } from '../components/Common'
import { LoanStatusBadge } from '../components/StatusBadge'

type Tab = 'aktif' | 'riwayat'

export function RecordReturnPage() {
  const { data, catatPengembalian } = useData()
  const { notify } = useToast()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('aktif')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState('')

  const daftar = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.peminjaman
      .filter((loan) => (tab === 'aktif' ? loan.status !== 'Dikembalikan' : loan.status === 'Dikembalikan'))
      .filter((loan) => {
        if (!q) return true
        const buku = findBuku(data, loan.kodeBuku)
        const mhs = findMahasiswa(data, loan.npm)
        return [loan.nomorPinjaman, loan.npm, loan.kodeBuku, buku?.judul ?? '', mhs?.nama ?? '']
          .some((field) => field.toLowerCase().includes(q))
      })
      .sort((a, b) => b.tanggalPinjam.localeCompare(a.tanggalPinjam))
  }, [data, query, tab])

  const selected = data.peminjaman.find((loan) => loan.id === selectedId) ?? null
  const buku = selected ? findBuku(data, selected.kodeBuku) : undefined
  const mhs = selected ? findMahasiswa(data, selected.npm) : undefined

  const konfirmasi = () => {
    if (!selected) return
    const result = catatPengembalian(selected.id)
    setConfirmOpen(false)
    if (!result.ok) {
      setError(result.reasons.join(' '))
      notify('error', result.message)
      return
    }
    setError('')
    setSelectedId(null)
    notify('success', result.message)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-navy">Catat Pengembalian</h2>
        <p className="mt-1 text-sm text-muted">
          Cari transaksi, periksa detailnya, lalu konfirmasi pengembalian. Status buku dan transaksi diperbarui otomatis.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          <AlertTriangle size={16} className="shrink-0" /> {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  className="input pl-10"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari no. pinjaman, NPM, kode, atau judul buku..."
                  aria-label="Cari transaksi"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-line bg-ivory p-1">
                <button
                  type="button"
                  onClick={() => { setTab('aktif'); setSelectedId(null) }}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold ${tab === 'aktif' ? 'bg-maroon text-white' : 'text-muted hover:text-navy'}`}
                >
                  Dipinjam
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('riwayat'); setSelectedId(null) }}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold ${tab === 'riwayat' ? 'bg-maroon text-white' : 'text-muted hover:text-navy'}`}
                >
                  Riwayat
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">{daftar.length} transaksi ditemukan.</p>
          </div>

          <div className="card overflow-hidden">
            {daftar.length === 0 ? (
              <EmptyState
                title="Transaksi tidak ditemukan"
                description="Coba kata kunci lain atau ganti tab pencarian."
                icon={Search}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No. Pinjaman</th>
                      <th>Mahasiswa</th>
                      <th>Judul Buku</th>
                      <th>Tgl. Kembali</th>
                      <th>Status</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftar.map((loan) => {
                      const book = findBuku(data, loan.kodeBuku)
                      const student = findMahasiswa(data, loan.npm)
                      const isSelected = loan.id === selectedId
                      return (
                        <tr key={loan.id} className={isSelected ? 'bg-maroon-soft/60' : ''}>
                          <td className="whitespace-nowrap font-semibold text-maroon">{loan.nomorPinjaman}</td>
                          <td>
                            <p className="font-semibold text-navy">{student?.nama ?? '—'}</p>
                            <p className="text-[11px] text-muted">{loan.npm}</p>
                          </td>
                          <td>
                            <p className="font-semibold text-navy">{book?.judul ?? loan.kodeBuku}</p>
                            <p className="text-[11px] text-muted">{loan.kodeBuku}</p>
                          </td>
                          <td className="whitespace-nowrap text-muted">{formatDate(loan.tanggalKembali)}</td>
                          <td><LoanStatusBadge status={getLoanStatus(loan)} showCR /></td>
                          <td className="text-right">
                            <button
                              type="button"
                              onClick={() => { setSelectedId(loan.id); setError('') }}
                              className="btn btn-outline px-2.5 py-1.5 text-[11px]"
                            >
                              {isSelected ? 'Dipilih' : 'Pilih'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
              <ShieldCheck size={16} className="text-maroon" /> Detail Transaksi Terpilih
            </h3>
            {!selected ? (
              <div className="mt-3">
                <EmptyState
                  title="Belum ada transaksi dipilih"
                  description="Pilih satu transaksi dari daftar untuk melihat detail dan mencatat pengembalian."
                  icon={RotateCcw}
                />
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-maroon">{selected.nomorPinjaman}</p>
                  <LoanStatusBadge status={getLoanStatus(selected)} showCR />
                </div>
                <dl className="mt-3 space-y-2.5 text-xs">
                  {[
                    ['Nama mahasiswa', mhs?.nama ?? '—'],
                    ['NPM', selected.npm],
                    ['Judul buku', buku?.judul ?? selected.kodeBuku],
                    ['Kode buku', selected.kodeBuku],
                    ['Tanggal pinjam', formatDate(selected.tanggalPinjam)],
                    ['Tanggal kembali', formatDate(selected.tanggalKembali)],
                    ['Tanggal pengembalian', formatDate(selected.tanggalPengembalian)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-3 border-b border-line pb-2 last:border-0">
                      <dt className="shrink-0 text-muted">{label}</dt>
                      <dd className="max-w-[60%] text-right font-semibold text-navy">{value}</dd>
                    </div>
                  ))}
                </dl>
                {selected.status === 'Dikembalikan' ? (
                  <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={15} /> Transaksi ini sudah dikembalikan.
                  </p>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary mt-4 w-full"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <RotateCcw size={15} /> Catat Pengembalian
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line bg-white p-4 text-xs leading-relaxed text-muted">
            <p className="font-bold text-navy">Yang terjadi setelah konfirmasi:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Status transaksi menjadi Dikembalikan.</li>
              <li>Tanggal pengembalian disimpan.</li>
              <li>Status buku kembali Tersedia.</li>
              <li>Kuota pinjaman mahasiswa berkurang satu.</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Konfirmasi Pengembalian"
        description="Pastikan buku yang dikembalikan sesuai dengan transaksi berikut."
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setConfirmOpen(false)}>Batal</button>
            <button type="button" className="btn btn-primary" onClick={konfirmasi}>
              <CheckCircle2 size={15} /> Ya, Catat Pengembalian
            </button>
          </>
        }
      >
        {selected && (
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between gap-3"><dt className="text-muted">No. pinjaman</dt><dd className="font-bold text-navy">{selected.nomorPinjaman}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Mahasiswa</dt><dd className="font-bold text-navy">{mhs?.nama ?? '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Buku</dt><dd className="font-bold text-navy">{buku?.judul ?? selected.kodeBuku}</dd></div>
          </dl>
        )}
      </Modal>
    </div>
  )
}
