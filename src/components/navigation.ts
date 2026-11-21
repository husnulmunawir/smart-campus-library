import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogIn,
  RotateCcw,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '../types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  mahasiswa: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/katalog', label: 'Katalog Buku', icon: BookOpen },
    { to: '/pinjaman-saya', label: 'Pinjaman Saya', icon: ClipboardList },
    { to: '/profil', label: 'Profil', icon: UserRound },
  ],
  petugas: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/katalog', label: 'Katalog Buku', icon: BookOpen },
    { to: '/catat-peminjaman', label: 'Catat Peminjaman', icon: LogIn },
    { to: '/catat-pengembalian', label: 'Catat Pengembalian', icon: RotateCcw },
    { to: '/pinjaman-aktif', label: 'Pinjaman Aktif', icon: ClipboardList },
    { to: '/profil', label: 'Profil', icon: UserRound },
  ],
}

export const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/katalog': 'Katalog Buku',
  '/pinjaman-saya': 'Pinjaman Saya',
  '/catat-peminjaman': 'Catat Peminjaman',
  '/catat-pengembalian': 'Catat Pengembalian',
  '/pinjaman-aktif': 'Pinjaman Aktif',
  '/profil': 'Profil Akun',
}

export function titleForPath(pathname: string): string {
  if (pathname.startsWith('/buku/')) return 'Detail Buku'
  return PAGE_TITLES[pathname] ?? 'Smart Campus Library'
}
