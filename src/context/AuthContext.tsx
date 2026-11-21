import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Kredensial, Mahasiswa, Petugas, Role, Session } from '../types'
import { DEMO_CREDENTIALS } from '../lib/seed'
import { clearSession, loadSession, saveSession } from '../lib/storage'
import { useData } from './DataContext'

interface LoginResult {
  ok: boolean
  error?: string
}

interface AuthContextValue {
  session: Session | null
  currentUser: Mahasiswa | Petugas | undefined
  login: (credentials: Kredensial) => LoginResult
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data } = useData()
  const [session, setSession] = useState<Session | null>(() => loadSession())

  const currentUser = useMemo(() => {
    if (!session) return undefined
    if (session.role === 'mahasiswa') {
      return data.mahasiswa.find((item) => item.id === session.userId)
    }
    return data.petugas.find((item) => item.id === session.userId)
  }, [data, session])

  const login = useCallback(
    ({ identifier, password }: Kredensial): LoginResult => {
      const id = identifier.trim().toUpperCase()
      if (!id || !password) {
        return { ok: false, error: 'ID/NPM dan password wajib diisi.' }
      }

      const credential = DEMO_CREDENTIALS[id]
      if (!credential) {
        return { ok: false, error: 'Akun tidak ditemukan. Periksa kembali NPM / ID Petugas yang dimasukkan.' }
      }
      if (credential.password !== password) {
        return { ok: false, error: 'Password salah. Silakan coba lagi.' }
      }

      const role: Role = credential.role
      const user =
        role === 'mahasiswa'
          ? data.mahasiswa.find((item) => item.npm === id)
          : data.petugas.find((item) => item.username === id)

      if (!user) {
        return { ok: false, error: 'Akun tidak ditemukan pada data perpustakaan.' }
      }

      const nextSession: Session = { userId: user.id, role }
      saveSession(nextSession)
      setSession(nextSession)
      return { ok: true }
    },
    [data],
  )

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, currentUser, login, logout }),
    [session, currentUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider')
  return context
}
