import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpenCheck,
  CircleUserRound,
  GraduationCap,
  Info,
  LogOut,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import type { Mahasiswa, Petugas } from '../types'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { countActiveLoans, sisaKuota } from '../lib/library'
import { Modal } from '../components/Common'

export function ProfilePage() {
  const { currentUser, session, logout } = useAuth()
  const { data, resetSemuaData } = useData()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [resetOpen, setResetOpen] = useState(false)

  if (!currentUser || !session) return null

  const isPetugas = session.role === 'petugas'
  const mahasiswa = !isPetugas ? (currentUser as Mahasiswa) : undefined
  const petugas = isPetugas ? (currentUser as Petugas) : undefined
  const inisial = currentUser.nama
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const fields = isPetugas
    ? [
        ['Nama', petugas?.nama ?? '—'],
        ['ID Petugas', petugas?.username ?? '—'],
        ['Jabatan', petugas?.jabatan ?? '—'],
        ['Hak akses', 'Petugas perpustakaan'],
      ]
    : [
        ['Nama', mahasiswa?.nama ?? '—'],
        ['NPM', mahasiswa?.npm ?? '—'],
        ['Program Studi', mahasiswa?.programStudi ?? '—'],
        ['Angkatan', mahasiswa?.angkatan ?? '—'],
        ['Status', mahasiswa?.status ?? '—'],
        ['Pinjaman aktif', `${countActiveLoans(data, mahasiswa!.npm)} dari 3`],
        ['Sisa kuota', String(sisaKuota(data, mahasiswa!.npm))],
      ]

  const reset = () => {
    resetSemuaData()
    setResetOpen(false)
    notify('success', 'Data demo berhasil dikembalikan ke kondisi awal.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-navy">Profil Akun</h2>
        <p className="mt-1 text-sm text-muted">Informasi akun yang sedang digunakan pada prototype ini.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="card overflow-hidden">
          <div className="bg-maroon px-6 py-8 text-center text-white">
            <span className="mx-auto grid size-16 place-items-center rounded-full border-2 border-gold/60 bg-white/10 text-lg font-extrabold text-gold">
              {inisial}
            </span>
            <h3 className="mt-3 text-base font-bold">{currentUser.nama}</h3>
            <p className="mt-1 text-xs text-white/70">{isPetugas ? petugas?.jabatan : `${mahasiswa?.programStudi} · ${mahasiswa?.angkatan}`}</p>
          </div>
          <div className="p-5">
            <span className={`badge ${isPetugas ? 'bg-maroon-soft text-maroon' : 'bg-gold-soft text-[#8a6620]'}`}>
              {isPetugas ? <ShieldCheck size={12} /> : <GraduationCap size={12} />}
              {isPetugas ? 'Petugas' : 'Mahasiswa'}
            </span>
            <button
              type="button"
              onClick={() => { logout(); navigate('/login') }}
              className="btn btn-outline mt-4 w-full"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
              <CircleUserRound size={17} className="text-maroon" /> Informasi Akun
            </h3>
            <div className="mt-4">
              {fields.map(([label, value]) => (
                <div key={label} className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-2.5 last:border-0">
                  <span className="text-xs text-muted">{label}</span>
                  <span className="text-xs font-bold text-navy">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
              <BookOpenCheck size={17} className="text-maroon" /> Tentang Aplikasi
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Smart Campus Library adalah prototype pengelolaan peminjaman dan pengembalian buku perpustakaan
              kampus. Petugas menjadi satu-satunya pengguna yang dapat mencatat transaksi, sementara mahasiswa
              dapat melihat katalog dan pinjaman miliknya sendiri.
            </p>
            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-lg bg-ivory px-3 py-2"><span className="text-muted">Total buku: </span><span className="font-bold text-navy">{data.buku.length}</span></div>
              <div className="rounded-lg bg-ivory px-3 py-2"><span className="text-muted">Total transaksi: </span><span className="font-bold text-navy">{data.peminjaman.length}</span></div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
              <Info size={17} className="text-maroon" /> Data Demo
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Seluruh perubahan tersimpan di browser melalui localStorage. Gunakan tombol di bawah untuk
              mengembalikan data ke kondisi awal sebelum demonstrasi.
            </p>
            <button type="button" onClick={() => setResetOpen(true)} className="btn btn-outline mt-4">
              <RotateCcw size={15} /> Reset Data Demo
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset Data Demo?"
        description="Seluruh transaksi dan perubahan status buku akan dikembalikan ke data awal."
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setResetOpen(false)}>Batal</button>
            <button type="button" className="btn btn-primary" onClick={reset}>Ya, Reset</button>
          </>
        }
      />
    </div>
  )
}
