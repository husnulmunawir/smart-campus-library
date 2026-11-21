import type { LibraryData, Session } from '../types'
import { createSeedData } from './seed'

const DATA_KEY = 'smart-campus-library:data:v1'
const SESSION_KEY = 'smart-campus-library:session:v1'

function isLibraryData(value: unknown): value is LibraryData {
  if (!value || typeof value !== 'object') return false
  const data = value as Partial<LibraryData>
  return (
    Array.isArray(data.mahasiswa) &&
    Array.isArray(data.petugas) &&
    Array.isArray(data.buku) &&
    Array.isArray(data.peminjaman)
  )
}

export function loadData(): LibraryData {
  try {
    const raw = window.localStorage.getItem(DATA_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isLibraryData(parsed)) return parsed
    }
  } catch {
    // Penyimpanan tidak tersedia / data rusak: gunakan data awal.
  }
  const seeded = createSeedData()
  saveData(seeded)
  return seeded
}

export function saveData(data: LibraryData): void {
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(data))
  } catch {
    // Mode privat atau kuota penuh: aplikasi tetap berjalan di memori.
  }
}

export function resetData(): LibraryData {
  const seeded = createSeedData()
  saveData(seeded)
  return seeded
}

export function loadSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const session = parsed as Partial<Session>
    if ((session.role === 'mahasiswa' || session.role === 'petugas') && typeof session.userId === 'string') {
      return session as Session
    }
  } catch {
    return null
  }
  return null
}

export function saveSession(session: Session): void {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Abaikan kegagalan penyimpanan sesi.
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // Abaikan kegagalan penyimpanan sesi.
  }
}
