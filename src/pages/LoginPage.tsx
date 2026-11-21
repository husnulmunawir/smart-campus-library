import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenCheck,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  LibraryBig,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function LoginPage() {
  const { login, session } = useAuth()
  const { data } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({})

  if (session) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from?.startsWith('/') && from !== '/login' ? from : '/dashboard'} replace />
  }

  const mahasiswaDemo = data.mahasiswa.find((item) => item.npm === '011250040')
  const petugasDemo = data.petugas.find((item) => item.username === 'PETUGAS001')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const errors: { identifier?: string; password?: string } = {}
    if (!identifier.trim()) errors.identifier = 'NPM / ID Petugas wajib diisi.'
    if (!password) errors.password = 'Password wajib diisi.'
    setFieldErrors(errors)
    setError('')
    if (Object.keys(errors).length > 0) return

    const result = login({ identifier, password })
    if (!result.ok) {
      setError(result.error ?? 'Login gagal.')
      return
    }
    navigate('/dashboard', { replace: true })
  }

  const isiDemo = (id: string, pass: string) => {
    setIdentifier(id)
    setPassword(pass)
    setError('')
    setFieldErrors({})
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto grid min-h-screen max-w-[1400px] lg:grid-cols-[1.05fr_1fr]">
        {/* Panel identitas */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-maroon px-12 py-12 text-white lg:flex">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl border border-gold/50 bg-white/5 text-gold">
              <BookOpenCheck size={24} strokeWidth={1.7} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-extrabold tracking-tight">Smart Campus</p>
              <p className="text-sm font-semibold tracking-tight text-gold">Library</p>
            </div>
          </div>

          <div className="relative max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-[11px] font-semibold text-gold">
              <LibraryBig size={13} /> Sistem Perpustakaan Kampus
            </span>
            <h1 className="mt-5 text-[38px] font-extrabold leading-[1.15] tracking-tight">
              Kelola peminjaman buku dengan rapi dan transparan.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Satu ruang kerja bagi mahasiswa untuk memantau pinjaman dan bagi petugas untuk mencatat
              transaksi peminjaman serta pengembalian.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { icon: GraduationCap, title: 'Untuk Mahasiswa', text: 'Cari buku & pantau pinjaman sendiri.' },
                { icon: ShieldCheck, title: 'Untuk Petugas', text: 'Catat transaksi dengan validasi otomatis.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <Icon size={20} className="text-gold" />
                  <p className="mt-2 text-xs font-bold">{title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-[11px] text-white/50">
            Prototipe UAS Rekayasa Perangkat Lunak · Data demo sintetis
          </p>
        </div>

        {/* Form login */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-[420px]">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl bg-maroon text-gold">
                <BookOpenCheck size={22} />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-extrabold text-maroon">Smart Campus</p>
                <p className="text-sm font-semibold text-navy">Library</p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-navy">Masuk ke akun Anda</h2>
            <p className="mt-2 text-sm text-muted">Gunakan akun kampus atau akun petugas perpustakaan.</p>

            <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-relaxed text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="identifier" className="field-label">NPM / ID Petugas</label>
                <div className="relative">
                  <UserRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="identifier"
                    value={identifier}
                    onChange={(event) => {
                      setIdentifier(event.target.value)
                      setFieldErrors((current) => ({ ...current, identifier: undefined }))
                    }}
                    placeholder="Contoh: 011250040"
                    autoComplete="username"
                    className={`input pl-10 ${fieldErrors.identifier ? 'border-red-400' : ''}`}
                  />
                </div>
                {fieldErrors.identifier && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.identifier}</p>}
              </div>

              <div>
                <label htmlFor="password" className="field-label">Password</label>
                <div className="relative">
                  <KeyRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setFieldErrors((current) => ({ ...current, password: undefined }))
                    }}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    className={`input pl-10 pr-11 ${fieldErrors.password ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>}
              </div>

              <button type="submit" className="btn btn-primary w-full py-3">
                Masuk <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Akun demo</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => isiDemo('011250040', 'mahasiswa123')}
                  className="rounded-xl border border-line bg-white p-3 text-left transition hover:border-maroon"
                >
                  <p className="flex items-center gap-1.5 text-xs font-bold text-maroon">
                    <GraduationCap size={14} /> Mahasiswa
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted">{mahasiswaDemo?.nama ?? 'Alya Putri Ramadhani'}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-navy">011250040 / mahasiswa123</p>
                </button>
                <button
                  type="button"
                  onClick={() => isiDemo('PETUGAS001', 'petugas123')}
                  className="rounded-xl border border-line bg-white p-3 text-left transition hover:border-maroon"
                >
                  <p className="flex items-center gap-1.5 text-xs font-bold text-maroon">
                    <ShieldCheck size={14} /> Petugas
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted">{petugasDemo?.nama ?? 'Rangga Mahendra'}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-navy">PETUGAS001 / petugas123</p>
                </button>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                Klik kartu akun untuk mengisi formulir otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
